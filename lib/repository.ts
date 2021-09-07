import { RedisClientType } from 'redis/dist/lib/client';
import { RedisModules } from 'redis/dist/lib/commands';
import { RedisLuaScripts } from 'redis/dist/lib/lua-script';

import { Schema } from "./schema";
import Client from "./client";

export default class Repository<T> {
  private schema: Schema<T>;
  private redis: RedisClientType<RedisModules, RedisLuaScripts>;

  constructor(schema: Schema<T>, client: Client) {
    this.schema = schema;
    this.redis = client.redis;
  }

  async fetchById(id: string): Promise<T> {

    let key = `${this.schema.prefix}:${id}`;
    let result = await this.redis.hGetAll(key);
    let entity = new this.schema.entityCtor(result);

    return entity;
  }
}
