import { createClient, createCluster, RediSearchSchema, SearchOptions } from 'redis'

import { Repository } from '../repository'
import { Schema } from '../schema'
import { RedisError } from '../errors'

/** A conventional Redis connection. */
export type RedisClientConnection = ReturnType<typeof createClient>

/** A clustered Redis connection. */
export type RedisClusterConnection = ReturnType<typeof createCluster>

/** A Redis connection, clustered or conventional. */
export type RedisConnection = RedisClientConnection | RedisClusterConnection

/** @internal This is a defintion for the type that calls to ft.search in Node Redis return.  */
export type SearchResults = {
  total: number
  documents: SearchDocument[]
}

/** @internal This is a defintion for the return type of calls to ft.search in Node Redis.  */
export type SearchDocument = {
  id: string,
  value: {
    [key: string]: any
  }
}

/** @internal */
export type RedisHashData = { [key: string]: string }

/** @internal */
export type RedisJsonData = { [key: string]: any }

/** @internal */
export type SearchDataStructure = 'HASH' | 'JSON'

/** @internal This is a simplified redefintion of the CreateOptions type that is not exported by Node Redis. */
export type CreateOptions = {
  ON: SearchDataStructure,
  PREFIX: string,
  STOPWORDS?: string[]
}

/**
 * A Client is the starting point for working with Redis OM. Clients manage the
 * connection to Redis and provide limited functionality for executing Redis commands.
 * Create a client and open it before you use it:
 *
 * ```typescript
 * const client = new Client()
 * await client.open()
 * ```
 *
 * A Client is primarily used by a {@link Repository} which requires a client in
 * its constructor.
 */
export class Client {
  /** @internal */
  private _redis?: RedisConnection

  /** Returns the underlying Node Redis connection being used. */
  get redis() {
    return this._redis
  }

  /**
   * Attaches an existing Node Redis connection to this Redis OM client. Closes
   * any existing connection.
   *
   * @param connection An existing Node Redis client.
   * @returns This {@link Client} instance.
   */
  async use(connection: RedisConnection): Promise<Client> {
    await this.close()
    return this.useNoClose(connection)
  }

  /**
   * Attaches an existing Node Redis connection to this Redis OM client. Does
   * not close any existing connection.
   *
   * @param connection An existing Node Redis client.
   * @returns This {@link Client} instance.
   */
  useNoClose(connection: RedisConnection): Client {
    this._redis = connection
    return this
  }

  /**
   * Open a connection to Redis at the provided URL.
   *
   * @param url A URL to Redis as defined with the [IANA](https://www.iana.org/assignments/uri-schemes/prov/redis).
   * @returns This {@link Client} instance.
   */
  async open(url: string = 'redis://localhost:6379'): Promise<Client> {
    if (!this.isOpen()) {
      const redis = createClient({ url })
      await redis.connect()
      this._redis = redis
    }
    return this
  }

  /**
   * Creates a repository for the given schema.
   *
   * @param schema The schema.
   * @returns A repository for the provided schema.
   */
  fetchRepository(schema: Schema): Repository {
    this.validateRedisOpen()
    return new Repository(schema, this)
  }

  /**
   * Close the connection to Redis.
   */
  async close() {
    if (this.redis) await this.redis.quit()
    this._redis = undefined
  }

  /** @internal */
  async createIndex(indexName: string, schema: RediSearchSchema, options: CreateOptions) {
    this.validateRedisOpen()
    await this.redis.ft.create(indexName, schema, options)
  }

  /** @internal */
  async dropIndex(indexName: string) {
    this.validateRedisOpen()
    await this.redis.ft.dropIndex(indexName)
  }

  /** @internal */
  async search(indexName: string, query: string, options?: SearchOptions): Promise<SearchResults> {
    this.validateRedisOpen()
    if (options) return await this.redis.ft.search(indexName, query, options)
    return await this.redis.ft.search(indexName, query)
  }

  /** @internal */
  async unlink(...keys: string[]) {
    this.validateRedisOpen()
    if (keys.length > 0) await this.redis.unlink(keys)
  }

  /** @internal */
  async expire(key: string, ttl: number) {
    this.validateRedisOpen()
    await this.redis.expire(key, ttl)
  }

  /** @internal */
  async get(key: string): Promise<string | null> {
    this.validateRedisOpen()
    return this.redis.get(key)
  }

  /** @internal */
  async set(key: string, value: string) {
    this.validateRedisOpen()
    await this.redis.set(key, value)
  }

  /** @internal */
  async hgetall(key: string): Promise<RedisHashData> {
    this.validateRedisOpen()
    return this.redis.hGetAll(key)
  }

  /** @internal */
  async hsetall(key: string, data: RedisHashData) {
    this.validateRedisOpen()
    await this.redis
      .multi()
        .unlink(key)
        .hSet(key, data)
      .exec()
  }

  /** @internal */
  async jsonget(key: string): Promise<RedisJsonData | null> {
    this.validateRedisOpen()
    const json = await this.redis.json.get(key, { path: '$' })
    return json === null ? null : (json as RedisJsonData)[0]
  }

  /** @internal */
  async jsonset(key: string, data: RedisJsonData) {
    this.validateRedisOpen()
    await this.redis.json.set(key, '$', data)
  }

  /**
   * @returns Whether a connection is already open.
   */
  isOpen() {
    return !!this.redis
  }

  private validateRedisOpen(): asserts this is { redis: RedisConnection } {
    if (!this.redis) throw new RedisError("Redis connection needs to be open.")
  }
}
