import { RedisClientType } from 'redis/dist/lib/client';
import { RedisModules } from 'redis/dist/lib/commands';
import { RedisLuaScripts } from 'redis/dist/lib/lua-script';
import { WatchError } from 'redis/dist/lib/errors';

import { FieldDefinition, Schema, SchemaDefinition, StringField } from "./schema";
import Client from "./client";
import { Entity, RedisId } from './entity';
import { Search } from './search/search';

export default class Repository<TEntity extends Entity> {
  private schema: Schema<TEntity>;
  private client: Client;
  private redis: RedisClientType<RedisModules, RedisLuaScripts>;

  constructor(schema: Schema<TEntity>, client: Client) {
    this.schema = schema;
    this.client = client;
    this.redis = client.redis;
  }

  async createIndex(): Promise<void> {

    let schemaDef: SchemaDefinition = this.schema.definition;
    let schemaForCreate: string[] = [];

    for (let field in schemaDef) {

      let fieldDef: FieldDefinition = schemaDef[field];
      let fieldType = fieldDef.type;
      let fieldAlias = fieldDef.alias ?? field;

      schemaForCreate.push(fieldAlias)
      if (fieldType === 'number') schemaForCreate.push('NUMERIC')
      if (fieldType === 'string' && (fieldDef as StringField).textSearch === true) schemaForCreate.push('TEXT')
      if (fieldType === 'string' && (fieldDef as StringField).textSearch !== true) schemaForCreate.push('TAG')
      if (fieldType === 'boolean') schemaForCreate.push('TAG')
      if (fieldType === 'array') schemaForCreate.push('TAG')
    }

    await this.redis.sendCommand([
        'FT.CREATE', this.schema.indexName, 
        'ON', 'HASH',
        'PREFIX', '1', `${this.schema.prefix}:`,
        'SCHEMA', ...schemaForCreate
    ]);
  }

  create(): TEntity {
    let id: RedisId = this.schema.generateId();
    return new this.schema.entityCtor(id);
  }

  async save(entity: TEntity): Promise<string> {

    let key = this.makeKey(entity.redisId);

    // TODO: need to handle the WatchError
    // TODO: looks like a bug in Node Redis as this doesn't exit

    if (Object.keys(entity.redisData).length === 0) {
      this.redis.unlink(key);
      return entity.redisId;
    }

    await this.redis.executeIsolated(async isolatedClient => {
      await isolatedClient.watch(key);
      await isolatedClient
        .multi()
          .unlink(key)
          .hSet(key, entity.redisData)
        .exec();
    });

    return entity.redisId;
  }

  async fetch(id: string): Promise<TEntity> {
    let key = this.makeKey(id);
    let data = await this.redis.hGetAll(key);
    let entity = new this.schema.entityCtor(id, data);
    return entity;
  }

  async remove(id: string): Promise<void> {
    let key = this.makeKey(id);
    await this.redis.unlink(key);
  }

  search(): Search<TEntity> {
    return new Search<TEntity>(this.schema, this.client);
  }

  private makeKey(id: string): string {
    return `${this.schema.prefix}:${id}`;
  }
}
