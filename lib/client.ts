import { createClient } from 'redis';

import { RedisClientType } from 'redis/dist/lib/client';
import { RedisModules } from 'redis/dist/lib/commands';
import { RedisLuaScripts } from 'redis/dist/lib/lua-script';

import Repository from './repository';
import { Schema } from './schema';

export default class Client {

  readonly redis: RedisClientType<RedisModules, RedisLuaScripts>;

  constructor(url?: string) {
    if (url) {
      this.redis = createClient({ socket : { url }});
    } else {
      this.redis = createClient();
    }
  }
  
  async open() : Promise<void> {
    return this.redis.connect();
  }

  async execute(command: any[]) : Promise<any> {
    return this.redis.sendCommand(command.map(arg => arg.toString()));
  }

  fetchRepository<T>(schema: Schema<T>) : Repository<T> {
    return new Repository(schema, this);
  }

  async close() : Promise<void> {
    return this.redis.quit();
  }
}
