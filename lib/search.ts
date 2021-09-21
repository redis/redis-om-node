import { RedisClientType } from 'redis/dist/lib/client';
import { RedisModules } from 'redis/dist/lib/commands';
import { RedisLuaScripts } from 'redis/dist/lib/lua-script';

import { FieldDefinition, Schema } from "./schema";
import Client from "./client";
import { Entity, RedisData, RedisId } from './entity';

export interface Where<TEntity> {
  isTrue(): Search<TEntity>;
  isFalse(): Search<TEntity>;
  is(value: string): Search<TEntity>;
  equals(value: number): Search<TEntity>;
  greaterThan(value: number): Search<TEntity>;
  greaterThanEqual(value: number): Search<TEntity>;
  lessThan(value: number): Search<TEntity>;
  lessThanEqual(value: number): Search<TEntity>;
  inRange(bottom: number, top: number): Search<TEntity>;
  inRangeExclusive(bottom: number, top: number): Search<TEntity>;
}

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

export class WhereNumber<TEntity extends Entity> extends Where<TEntity> {
  private bottom: number = Number.NEGATIVE_INFINITY;
  private top: number = Number.POSITIVE_INFINITY;
  private exclusive: boolean = false;

  equals(value: number): Search<TEntity> {
    this.bottom = value;
    this.top = value;
    return this.search;
  }

  greaterThan(value: number): Search<TEntity> {
    this.bottom = value;
    this.exclusive = true;
    return this.search;
  }

  greaterThanEqual(value: number): Search<TEntity> {
    this.bottom = value;
    return this.search;
  }

  lessThan(value: number): Search<TEntity> {
    this.top = value;
    this.exclusive = true;
    return this.search;
  }

  lessThanEqual(value: number): Search<TEntity> {
    this.top = value;
    return this.search;
  }

  inRange(bottom: number, top: number): Search<TEntity> {
    this.bottom = bottom;
    this.top = top;
    return this.search;
  }

  inRangeExclusive(bottom: number, top: number): Search<TEntity> {
    this.bottom = bottom;
    this.top = top;
    this.exclusive = true;
    return this.search;
  }

  toString(): string {
    let bottom = this.makeBottomString();
    let top = this.makeTopString();
    return `@${this.field}:[${bottom} ${top}]`
  }

  private makeBottomString() {
    if (this.bottom === Number.NEGATIVE_INFINITY) return '-inf';
    if (this.exclusive) return `(${this.bottom}`;
    return this.bottom.toString()
  }

  private makeTopString() {
    if (this.top === Number.POSITIVE_INFINITY) return '+inf';
    if (this.exclusive) return `(${this.top}`;
    return this.top.toString()
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

  where(field: string): WhereString<TEntity> | WhereBoolean<TEntity> | WhereNumber<TEntity> {

    let fieldDef: FieldDefinition = this.schema.definition[field];

    if (fieldDef.type === 'boolean') {
      let where: WhereBoolean<TEntity>;
      where = new WhereBoolean<TEntity>(this, field);
      this.whereArray.push(where);
      return where;
    }
    
    if (fieldDef.type === 'number') {
      let where: WhereNumber<TEntity>;
      where = new WhereNumber<TEntity>(this, field);
      this.whereArray.push(where);
      return where;
    }
    
    let where: WhereString<TEntity>;
    where = new WhereString<TEntity>(this, field);
    this.whereArray.push(where);
    return where;
  }

  async run(): Promise<TEntity[]> {

    let command: string[] = ['FT.SEARCH', this.schema.indexName, this.query];
    let results = await this.redis.sendCommand<any[]>(command);

    let count = this.extractCount(results);
    let ids = this.extractIds(results);
    let entities = this.extractEntities(results, ids);
    return entities;
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
      .map((array, index) => this.arrayToEntity(array as string[], ids[index] as RedisId));
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
