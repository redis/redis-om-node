import { createClient } from 'redis';

import { RedisClientType } from 'redis/dist/lib/client';
import { RedisScripts, RedisModules } from 'redis/dist/lib/commands';
import RedisError from '../errors';

export default class RedisShim {

  private redis!: RedisClientType<RedisModules, RedisScripts>;

  async open(url: string) {
    this.redis = createClient({ url });
    await this.redis.connect();
  }

  async close() {
    await this.redis.quit();
  }

  async execute<TResult>(command: string[]) : Promise<TResult> {
    return await this.redis.sendCommand<TResult>(command);
  }

  async unlink(key: string) {
    await this.redis.unlink(key);
  }

  async hgetall(key: string) {
    return await this.redis.hGetAll(key);
  }

  async hsetall(key: string, data: { [key: string]: string }) {
    try {
      await this.redis.executeIsolated(async isolatedClient => {
        await isolatedClient.watch(key);
        await isolatedClient
          .multi()
            .unlink(key)
            .hSet(key, data)
          .exec();
      });
    } catch (error: any) {
      if (error.name === 'WatchError') throw new RedisError("Watch error when setting HASH.");
      throw error;
    }
  }
}
