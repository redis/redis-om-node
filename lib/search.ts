import { RedisClientType } from 'redis/dist/lib/client';
import { RedisModules } from 'redis/dist/lib/commands';
import { RedisLuaScripts } from 'redis/dist/lib/lua-script';

import { FieldDefinition, Schema } from "./schema";
import Client from "./client";
import { Entity, RedisData, RedisId } from './entity';

export abstract class Where<TEntity extends Entity> {
  protected search: Search<TEntity>;
  protected field: String;

  constructor(search: Search<TEntity>, field: string) {
    this.search = search;
    this.field = field;
  }

  abstract toString(): string;
}

export class WhereBoolean<TEntity extends Entity> extends Where<TEntity> {
  private value?: boolean;

  isTrue(): Search<TEntity> {
    this.value = true;
    return this.search;
  }

  isFalse(): Search<TEntity> {
    this.value = false;
    return this.search;
  }

  toString(): string {
    return `@${this.field}:{${this.value ? '1' : '0'}}`
  }
}

export class WhereString<TEntity extends Entity> extends Where<TEntity> {
  private value?: string;

  is(value: string): Search<TEntity> {
    this.value = value;
    return this.search;
  }

  toString(): string {
    return `@${this.field}:{${this.value}}`
  }
}

export class Search<TEntity extends Entity> {
  private schema: Schema<TEntity>;
  private redis: RedisClientType<RedisModules, RedisLuaScripts>;

  private whereArray: Where<TEntity>[] = [];

  constructor(schema: Schema<TEntity>, client: Client) {
    this.schema = schema;
    this.redis = client.redis;
  }

  where(field: string): WhereString<TEntity> | WhereBoolean<TEntity> | any {

    let fieldDef: FieldDefinition = this.schema.definition[field];

    if (fieldDef.type === 'boolean') {
      let where: WhereBoolean<TEntity>;
      where = new WhereBoolean<TEntity>(this, field);
      this.whereArray.push(where);
      return where;
    }
    
    let where: WhereString<TEntity>;
    where = new WhereString<TEntity>(this, field);
    this.whereArray.push(where);
    return where;
  }

  async run(): Promise<TEntity[]> {

    let query: string

    if (this.whereArray.length > 0) {
      query = this.whereArray.map(where => where.toString()).join(' ');
    } else {
      query = '*';
    }

    let command: string[] = ['FT.SEARCH', this.schema.indexName, query];

    let [_, ...foundKeysAndValues] = await this.redis.sendCommand<any[]>(command);

    let ids = foundKeysAndValues
      .filter((_entry, index) => index % 2 === 0)
      .map(key => key.replace(/^.*:/, ""));

    let values = foundKeysAndValues
      .filter((_entry, index) => index % 2 !== 0)
      .map((array, index) => this.arrayToEntity(array, ids[index] as RedisId));

    return values;
  }

  private arrayToEntity(array: string[], id: RedisId): TEntity{
    let keys = array.filter((_entry, index) => index % 2 === 0);
    let values = array.filter((_entry, index) => index % 2 !== 0);
    
    let data: RedisData = keys.reduce((object: any, key, index) => {
      object[key] = values[index]
      return object
    }, {});
    
    return new this.schema.entityCtor(id, data);
  }
}
