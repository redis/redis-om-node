import { RedisClientType } from 'redis/dist/lib/client';
import { RedisModules } from 'redis/dist/lib/commands';
import { RedisLuaScripts } from 'redis/dist/lib/lua-script';
import { WatchError } from 'redis/dist/lib/errors';

import { Schema } from "./schema";
import Client from "./client";
import Entity from './entity';

export default class Repository<TEntity extends Entity> {
  private schema: Schema<TEntity>;
  private redis: RedisClientType<RedisModules, RedisLuaScripts>;

  constructor(schema: Schema<TEntity>, client: Client) {
    this.schema = schema;
    this.redis = client.redis;
  }

  async save(entity: TEntity): Promise<string> {

    let key = this.makeKey(entity.redisId);

    // TODO: need to handle the WatchError
    // TODO: looks like a bug in Node Redis as this doesn't exit

    await this.redis.executeIsolated(async isolatedClient => {
      await isolatedClient.watch(key);
      await isolatedClient
        .multi()
          .unlink(key)
          .hSet(key, entity.redisData)
        .exec();
    });

    // await this.redis.unlink(key)
    // await this.redis.hSet(key, entity.redisData);

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

  private makeKey(id: string): string {
    return `${this.schema.prefix}:${id}`;
  }
}
