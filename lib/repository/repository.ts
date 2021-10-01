import { RedisClientType } from 'redis/dist/lib/client';
import { RedisModules } from 'redis/dist/lib/commands';
import { RedisLuaScripts } from 'redis/dist/lib/lua-script';
import { WatchError } from 'redis/dist/lib/errors';

import Schema from "../schema/schema";
import Client from "../client";
import Entity from '../entity/entity';
import Search from '../search/search';

import { EntityId, EntityKey } from '../entity/entity-types';

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
    await this.redis.sendCommand([
      'FT.CREATE', this.schema.indexName, 
        'ON', this.schema.dataStructure,
        'PREFIX', '1', `${this.schema.prefix}:`,
        'SCHEMA', ...this.schema.redisSchema
    ]);
  }

  createEntity(): TEntity {
    let id: EntityId = this.schema.generateId();
    return new this.schema.entityCtor(id);
  }

  async save(entity: TEntity): Promise<EntityId> {

    let key: EntityKey = this.makeKey(entity.entityId);

    if (Object.keys(entity.entityData).length === 0) {
      this.redis.unlink(key);
      return entity.entityId;
    }
    
    // TODO: looks like a bug in Node Redis as this doesn't exit
    try {
      await this.redis.executeIsolated(async isolatedClient => {
        await isolatedClient.watch(key);
        await isolatedClient
          .multi()
            .unlink(key)
            .hSet(key, entity.entityData)
          .exec();
      });
    } catch (error) {
      if (error instanceof WatchError) throw new Error("This entity was changed by another client while saving. Save aborted.")
    }

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
