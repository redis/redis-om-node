import { RedisClientType } from 'redis/dist/lib/client';
import { RedisModules } from 'redis/dist/lib/commands';
import { RedisLuaScripts } from 'redis/dist/lib/lua-script';

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

  async fetchById(id: string): Promise<TEntity> {

    let key = `${this.schema.prefix}:${id}`;
    let result = await this.redis.hGetAll(key);
    let entity = new this.schema.entityCtor(result);

    return entity;
  }

  async fetchAll(): Promise<TEntity[]> {

    let results: TEntity[] = [];

    let iterator = this.redis.scanIterator({
      TYPE: 'hash',
      MATCH: `${this.schema.prefix}:*`
    });

    for await (const key of iterator) {
      let result = await this.redis.hGetAll(key);
      let entity = new this.schema.entityCtor(result);
      results.push(entity);
    }

    return results;
  }

  // TODO: all the crud operations
  // TODO: search
}
