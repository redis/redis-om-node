import { RedisClientType } from 'redis/dist/lib/client';
import { RedisModules } from 'redis/dist/lib/commands';
import { RedisLuaScripts } from 'redis/dist/lib/lua-script';

import Schema from "../schema/schema";
import Client from "../client";
import Entity from '../entity/entity';

import { EntityData, EntityId } from '../entity/entity-types';

import Where from './where';
import WhereArray from './where-array';
import WhereBoolean from './where-boolean';
import WhereNumber from './where-number';
import WhereString from './where-string';

export default class Search<TEntity extends Entity> {
  private schema: Schema<TEntity>;
  private redis: RedisClientType<RedisModules, RedisLuaScripts>;

  private whereArray: Where<TEntity>[] = [];

  constructor(schema: Schema<TEntity>, client: Client) {
    this.schema = schema;
    this.redis = client.redis;
  }

  where(field: string): WhereString<TEntity> | WhereBoolean<TEntity> | WhereNumber<TEntity> | WhereArray<TEntity> {

    let fieldDef = this.schema.definition[field];

    if (fieldDef.type === 'boolean') return this.createWhereBoolean(field);
    if (fieldDef.type === 'number') return this.createWhereNumber(field);
    if (fieldDef.type === 'array') return this.createWhereArray(field);
    return this.createWhereString(field);
  }

  async run(): Promise<TEntity[]> {

    let command: string[] = ['FT.SEARCH', this.schema.indexName, this.query];
    let results = await this.redis.sendCommand<any[]>(command);

    let count = this.extractCount(results);
    let ids = this.extractIds(results);
    let entities = this.extractEntities(results, ids);
    return entities;
  }

  private createWhereBoolean(field: string): WhereBoolean<TEntity> {
    let where: WhereBoolean<TEntity>;
    where = new WhereBoolean<TEntity>(this, field);
    this.whereArray.push(where);
    return where;
  }

  private createWhereNumber(field: string): WhereNumber<TEntity> {
    let where: WhereNumber<TEntity>;
    where = new WhereNumber<TEntity>(this, field);
    this.whereArray.push(where);
    return where;
  }

  private createWhereArray(field: string): WhereArray<TEntity> {
    let where: WhereArray<TEntity>;
    where = new WhereArray<TEntity>(this, field);
    this.whereArray.push(where);
    return where;
  }

  private createWhereString(field: string): WhereString<TEntity> {
    let where: WhereString<TEntity>;
    where = new WhereString<TEntity>(this, field);
    this.whereArray.push(where);
    return where;
  }

  private get query() : string {
    if (this.whereArray.length === 0) return '*';
    return this.whereArray.map(where => where.toString()).join(' ');
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
