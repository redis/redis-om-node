import { createClient } from 'redis';

import RedisError from '../errors';

export type RedisConnection = ReturnType<typeof createClient>;

export default class RedisShim {

  private redis!: RedisConnection;

  constructor(urlOrConnection: string | RedisConnection) {
    if (typeof urlOrConnection === 'string') {
      this.redis = createClient({ url: urlOrConnection });
    } else {
      this.redis = urlOrConnection;
    }
  }

  async open() {
    await this.redis.connect();
  }

  async close() {
    await this.redis.quit();
  }

  execute<TResult>(command: Array<string>): Promise<TResult> {
    return this.redis.sendCommand<TResult>(command);
  }

  async unlink(key: string) {
    await this.redis.unlink(key);
  }

  async expire(key: string, ttl: number) {
    await this.redis.expire(key, ttl);
  }

  get(key: string) {
    return this.redis.get(key);
  }

  set(key: string, value: string) {
    return this.redis.set(key, value);
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
