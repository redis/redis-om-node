import { createClient, commandOptions } from 'redis';
import { Repository } from './repository';
import { JsonRepository, HashRepository } from './repository';
import { Entity } from './entity/entity';
import { Schema } from './schema/schema';
import { RedisError } from './errors';

export type RedisConnection = ReturnType<typeof createClient>;

/**
 * Alias for a JavaScript object used by HSET.
 * @internal
 */
export type RedisHashData = { [key: string]: string | Buffer };

/**
 * Alias for any old JavaScript object used by JSON.SET.
 * @internal
 */
export type RedisJsonData = { [key: string]: any };

/** The type of data structure in Redis to map objects to. */
export type SearchDataStructure = 'HASH' | 'JSON';

/** @internal */
export type CreateIndexOptions = {
  indexName: string,
  dataStructure: SearchDataStructure,
  schema: Array<string>,
  prefix: string,
  stopWords?: Array<string>
}

/** @internal */
export type LimitOptions = {
  offset: number;
  count: number;
}

/** @internal */
export type SortOptions = {
  field: string;
  order: 'ASC' | 'DESC';
}

/** @internal */
export type SearchOptions = {
  indexName: string,
  query: string,
  limit?: LimitOptions,
  sort?: SortOptions,
  keysOnly?: boolean
}

/**
 * A Client is the starting point for working with Redis OM. Clients manage the
 * connection to Redis and provide limited functionality for executing Redis commands.
 * Create a client and open it before you use it:
 *
 * ```typescript
 * const client = new Client();
 * await client.open();
 * ```
 *
 * A Client is primarily used by a {@link Repository} which requires a client in
 * its constructor.
 */
export class Client {
  /** @internal */
  protected redis?: RedisConnection

  /**
   * Attaches an existing Node Redis connection to this Redis OM client. Closes
   * any existing connection.
   * @param connection An existing Node Redis client.
   * @returns This {@link Client} instance.
   */
  async use(connection: RedisConnection): Promise<Client> {
    // close existing connection
    await this.close()
    this.redis = connection
    return this;
  }

  /**
   * Open a connection to Redis at the provided URL.
   * @param url A URL to Redis as defined with the [IANA](https://www.iana.org/assignments/uri-schemes/prov/redis).
   * @returns This {@link Client} instance.
   */
  async open(url: string = 'redis://localhost:6379'): Promise<Client> {
    if (!this.isOpen()) {
      this.redis = createClient({ url })
      await this.redis.connect();
    }
    return this;
  }

  /**
   * Execute an arbitrary Redis command.
   * @template TResult Expect result type such as `string`, `Array<string>`, or whatever complex type Redis returns.
   * @param command The command to execute.
   * @returns The raw results of calling the Redis command.
   */
  async execute(command: Array<string | number | boolean>): Promise<unknown> {
    this.validateRedisOpen();
    return this.redis.sendCommand<any>(command.map(arg => {
      if (arg === false) return '0';
      if (arg === true) return '1';
      return arg.toString();
    }));
  }

  /**
   * Creates a repository for the given schema.
   * @template TEntity The entity type for this {@link Schema} and {@link Repository}.
   * @param schema The schema.
   * @returns A repository for the provided schema.
   */
  fetchRepository<TEntity extends Entity>(schema: Schema<TEntity>): Repository<TEntity> {
    this.validateRedisOpen();
    if (schema.dataStructure === 'JSON') {
      return new JsonRepository(schema, this);
    } else {
      return new HashRepository(schema, this);
    }
  }

  /**
   * Close the connection to Redis.
   */
  async close() {
    if (this.redis) {
      await this.redis.quit()
    }
    this.redis = undefined;
  }

  /** @internal */
  async createIndex(options: CreateIndexOptions) {
    this.validateRedisOpen();

    const { indexName, dataStructure, prefix, schema, stopWords } = options;

    const command = [
      'FT.CREATE', indexName,
      'ON', dataStructure,
      'PREFIX', '1', `${prefix}`];

    if (stopWords !== undefined)
      command.push('STOPWORDS', `${stopWords.length}`, ...stopWords);

    command.push('SCHEMA', ...schema);

    await this.redis.sendCommand(command);
  }

  /** @internal */
  async dropIndex(indexName: string) {
    this.validateRedisOpen();
    await this.redis.sendCommand(['FT.DROPINDEX', indexName]);
  }

  /** @internal */
  async search(options: SearchOptions) {
    this.validateRedisOpen();
    const { indexName, query, limit, sort, keysOnly } = options
    const command = ['FT.SEARCH', indexName, query];

    if (limit !== undefined)
      command.push('LIMIT', limit.offset.toString(), limit.count.toString());

    if (sort !== undefined)
      command.push('SORTBY', sort.field, sort.order);

    if (keysOnly) command.push('RETURN', '0');

    return this.redis.sendCommand<any[]>(command, commandOptions({ returnBuffers: true }));
  }

  /** @internal */
  async unlink(...keys: string[]) {
    this.validateRedisOpen();
    if (keys.length > 0) await this.redis.unlink(keys);
  }

  /** @internal */
  async expire(key: string, ttl: number) {
    this.validateRedisOpen();
    await this.redis.expire(key, ttl);
  }

  /** @internal */
  async get(key: string): Promise<string | null> {
    this.validateRedisOpen();
    return this.redis.get(key);
  }

  /** @internal */
  async set(key: string, value: string) {
    this.validateRedisOpen();
    await this.redis.set(key, value);
  }

  /** @internal */
  async hgetall(key: string): Promise<RedisHashData> {
    this.validateRedisOpen();
    return this.redis.hGetAll(commandOptions({ returnBuffers: true }), key);
  }

  /** @internal */
  async hsetall(key: string, data: RedisHashData) {
    this.validateRedisOpen();
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

  /** @internal */
  async jsonget(key: string): Promise<RedisJsonData> {
    this.validateRedisOpen();
    const json = await this.redis.sendCommand<string>(['JSON.GET', key, '.']);
    return JSON.parse(json);
  }

  /** @internal */
  async jsonset(key: string, data: RedisJsonData) {
    this.validateRedisOpen();
    const json = JSON.stringify(data);
    await this.redis.sendCommand<string>(['JSON.SET', key, '.', json]);
  }

  /**
   * @returns Whether a connection is already open.
   */
  isOpen() {
    return !!this.redis;
  }

  private validateRedisOpen(): asserts this is { redis: RedisConnection } {
    if (!this.redis) throw new RedisError("Redis connection needs to be open.");
  }
}
