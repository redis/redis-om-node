import { RedisClientType } from 'redis/dist/lib/client';
import { RedisModules } from 'redis/dist/lib/commands';
import { RedisLuaScripts } from 'redis/dist/lib/lua-script';

import Schema from "./schema/schema";
import Client from "./client";
import Entity from './entity/entity';
import Search from './search/search';

import { FieldDefinition, SchemaDefinition, StringField } from './schema/schema-definitions';
import { EntityId, EntityKey } from './entity/entity-types';

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
    let id: EntityId = this.schema.generateId();
    return new this.schema.entityCtor(id);
  }

  async save(entity: TEntity): Promise<EntityId> {

    let key: EntityKey = this.makeKey(entity.entityId);

    // TODO: need to handle the WatchError
    // TODO: looks like a bug in Node Redis as this doesn't exit

    if (Object.keys(entity.entityData).length === 0) {
      this.redis.unlink(key);
      return entity.entityId;
    }

    await this.redis.executeIsolated(async isolatedClient => {
      await isolatedClient.watch(key);
      await isolatedClient
        .multi()
          .unlink(key)
          .hSet(key, entity.entityData)
        .exec();
    });

    return entity.entityId;
  }

  async fetch(id: EntityId): Promise<TEntity> {
    let key = this.makeKey(id);
    let data = await this.redis.hGetAll(key);
    let entity = new this.schema.entityCtor(id, data);
    return entity;
  }

  async remove(id: EntityId): Promise<void> {
    let key = this.makeKey(id);
    await this.redis.unlink(key);
  }

  search(): Search<TEntity> {
    return new Search<TEntity>(this.schema, this.client);
  }

  private makeKey(id: EntityId): EntityKey {
    return `${this.schema.prefix}:${id}`;
  }
}
