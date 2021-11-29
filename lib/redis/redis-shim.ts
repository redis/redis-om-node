import { createClient } from '@node-redis/client';

import { RedisClientType, } from '@node-redis/client/dist/lib/client';
import { RedisScripts, RedisModules } from '@node-redis/client/dist/lib/commands';
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

  execute<TResult>(command: string[]) : Promise<TResult> {
    return this.redis.sendCommand<TResult>(command);
  }

  async unlink(key: string) {
    await this.redis.unlink(key);
  }

  hgetall(key: string) {
    return this.redis.hGetAll(key);
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
