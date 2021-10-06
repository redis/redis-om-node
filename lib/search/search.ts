import RedisShim from '../redis/redis-shim';

import Schema from "../schema/schema";
import Client from "../client";
import Entity from '../entity/entity';

import { EntityData, EntityId } from '../entity/entity-types';

import Where from './where';
import WhereAnd from './where-and';
import WhereOr from './where-or';
import WhereField from './where-field';
import WhereArray from './where-array';
import WhereBoolean from './where-boolean';
import WhereNumber from './where-number';
import WhereString from './where-string';
import WhereText from './where-text';

type SubSearchFunction<TEntity extends Entity> = (search: Search<TEntity>) => Search<TEntity>
type AndOrConstructor = new (left: Where, right: Where) => Where;

export default class Search<TEntity extends Entity> {
  private schema: Schema<TEntity>;
  private client: Client;
  private redis: RedisShim;

  private rootWhere?: Where;

  constructor(schema: Schema<TEntity>, client: Client) {
    this.schema = schema;
    this.client = client;
    this.redis = client.redis;
  }

  where(field: string): WhereField<TEntity>;
  where(subSearchFn: SubSearchFunction<TEntity>): Search<TEntity>;
  where(fieldOrFn: string | SubSearchFunction<TEntity>): WhereField<TEntity> | Search<TEntity> {
    return this.anyWhere(WhereAnd, fieldOrFn);
  }

  and(field: string): WhereField<TEntity>;
  and(subSearchFn: SubSearchFunction<TEntity>): Search<TEntity>;
  and(fieldOrFn: string | SubSearchFunction<TEntity>): WhereField<TEntity> | Search<TEntity> {
    return this.anyWhere(WhereAnd, fieldOrFn);
  }

  or(field: string): WhereField<TEntity>;
  or(subSearchFn: SubSearchFunction<TEntity>): Search<TEntity>;
  or(fieldOrFn: string | SubSearchFunction<TEntity>): WhereField<TEntity> | Search<TEntity> {
    return this.anyWhere(WhereOr, fieldOrFn);
  }

  get query() : string {
    if (this.rootWhere === undefined) return '*';
    return `${this.rootWhere.toString()}`;
  }

  async run(): Promise<TEntity[]> {

    let command: string[] = ['FT.SEARCH', this.schema.indexName, this.query];
    let results = await this.redis.execute<any[]>(command);

    let count = this.extractCount(results);
    let ids = this.extractIds(results);
    let entities = this.extractEntities(results, ids);
    return entities;
  }

  private anyWhere(ctor: AndOrConstructor, fieldOrFn: string | SubSearchFunction<TEntity>): WhereField<TEntity> | Search<TEntity> {
    if (typeof fieldOrFn === 'string') {
      return this.anyWhereForField(ctor, fieldOrFn);
    } else {
      return this.anyWhereForFunction(ctor, fieldOrFn);
    }
  }

  private anyWhereForField(ctor: AndOrConstructor, field: string): WhereField<TEntity> {
    let where = this.createWhere(field);

    if (this.rootWhere === undefined) {
      this.rootWhere = where;
    } else {
      this.rootWhere = new ctor(this.rootWhere, where);
    }

    return where;
  }

  private anyWhereForFunction(ctor: AndOrConstructor, subSearchFn: SubSearchFunction<TEntity>): Search<TEntity> {
    let search = new Search<TEntity>(this.schema, this.client);
    let subSearch = subSearchFn(search);

    if (subSearch.rootWhere !== undefined) {
      if (this.rootWhere === undefined) {
        this.rootWhere = subSearch.rootWhere;
      } else {
        this.rootWhere = new ctor(this.rootWhere, subSearch.rootWhere);
      }
    }

    return this;
  }

  private createWhere(field: string): WhereField<TEntity> {
    let fieldDef = this.schema.definition[field];

    if (fieldDef === undefined) throw new Error(`The field '${field}' is not part of the schema.`);

    let where: WhereField<TEntity>;

    if (fieldDef.type === 'array') {
      where = new WhereArray<TEntity>(this, field);
    } else if (fieldDef.type === 'boolean') {
      where = new WhereBoolean<TEntity>(this, field);
    } else if (fieldDef.type === 'number') {
      where = new WhereNumber<TEntity>(this, field);
    } else if (fieldDef.type === 'string' && fieldDef.textSearch === true) {
      where = new WhereText<TEntity>(this, field);
    } else if (fieldDef.type === 'string' && fieldDef.textSearch !== true) {
      where = new WhereString<TEntity>(this, field);
    } else {
      // @ts-ignore: This is a trap for JavaScript
      throw new Error(`The field type of '${fieldDef.type}' is not a valid field type. Valid types include 'array', 'boolean', 'number', and 'string'.`);
    }

    return where;
  }

  private extractCount(results: any[]): number {
    return results[0];
  }

  private extractIds(results: any[]): string[] {
    let [, ...foundKeysAndValues] = results;
    return foundKeysAndValues
      .filter((_entry, index) => index % 2 === 0)
      .map(key => (key as string).replace(/^.*:/, ""));
  }

  private extractEntities(results: any[], ids: string[]): TEntity[] {
    let [, ...foundKeysAndValues] = results;
    return foundKeysAndValues
      .filter((_entry, index) => index % 2 !== 0)
      .map((array, index) => this.arrayToEntity(array as string[], ids[index] as EntityId));
  }

  private arrayToEntity(array: string[], id: EntityId): TEntity{
    let keys = array.filter((_entry, index) => index % 2 === 0);
    let values = array.filter((_entry, index) => index % 2 !== 0);
    
    let data: EntityData = keys.reduce((object: any, key, index) => {
      object[key] = values[index]
      return object
    }, {});
    
    return new this.schema.entityCtor(id, data);
  }
}
