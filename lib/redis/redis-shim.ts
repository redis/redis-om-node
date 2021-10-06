import { createClient } from 'redis';

import { RedisClientType } from 'redis/dist/lib/client';
import { RedisModules } from 'redis/dist/lib/commands';
import { RedisLuaScripts } from 'redis/dist/lib/lua-script';
import { WatchError } from 'redis/dist/lib/errors';


export default class RedisShim {

  private redis?: RedisClientType<RedisModules, RedisLuaScripts>;

  async open(url: string) {
    this.validateConnectionDoesntExist();
    this.redis = createClient({ socket : { url }});
    await this.redis.connect();
  }

  async close() {
    this.validateConnectionExists();
    await this.redis!.quit();
    this.redis = undefined;
  }

  async execute<TResult>(command: string[]) : Promise<TResult> {
    this.validateConnectionExists();
    return await this.redis!.sendCommand<TResult>(command);
  }

  async unlink(key: string) {
    this.validateConnectionExists();
    await this.redis!.unlink(key);
  }

  async hgetall(key: string) {
    this.validateConnectionExists();
    return await this.redis!.hGetAll(key);
  }

  async hsetall(key: string, data: { [key: string]: string }) {
    this.validateConnectionExists();
    try {
      await this.redis!.executeIsolated(async isolatedClient => {
        await isolatedClient.watch(key);
        await isolatedClient
          .multi()
            .unlink(key)
            .hSet(key, data)
          .exec();
      });
    } catch (error) {
      if (error instanceof WatchError) 
        throw new Error("This entity was changed by another client while saving. Save aborted.");
      throw error;
    }
  }

  async createIndex(indexName: string, dataStructure: string, prefix: string, schema: string[]) {
    this.validateConnectionExists();
    await this.redis!.sendCommand([
      'FT.CREATE', indexName, 
        'ON', dataStructure,
        'PREFIX', '1', `${prefix}:`,
        'SCHEMA', ...schema
    ]);
  }

  async dropIndex(indexName: string) {
    this.validateConnectionExists();
    await this.redis!.sendCommand([ 'FT.DROPINDEX', indexName ]);
  }

  async search(indexName: string, query: string) {
    this.validateConnectionExists();
    return await this.redis!.sendCommand<any[]>([ 'FT.SEARCH', indexName, query ]);
  }

  private validateConnectionDoesntExist() {
    if (this.redis) throw new Error("Redis connection needs opened.");
  }

  private validateConnectionExists() {
    if (!this.redis) throw new Error("Redis connection has been closed.");
  }
}
