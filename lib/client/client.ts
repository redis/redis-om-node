import { createClient, createCluster, RediSearchSchema, SearchOptions } from 'redis'

import { Repository } from '../repository'
import { InferSchema, Schema } from '../schema'
import { RedisOmError } from '../error'

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

// TODO: Complete removing this type from Search class

/** @internal This is a defintion for the return type of calls to ft.search in Node Redis.  */
export type SearchDocument = {
  id: string
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

/**
 * @internal This is a simplified redefintion of the CreateOptions type that is not exported by Node Redis.
 * TODO: Remove this type once CreateOptions is exported by Node Redis.
 * https://github.com/redis/node-redis/blob/master/packages/search/lib/commands/CREATE.ts#L4
 */
export type CreateOptions = {
  ON: SearchDataStructure
  PREFIX: string
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
 *
 * @deprecated Just use Node Redis client directly and pass it to the Repository.
 */
export class Client {
  /** @internal */
  #redis?: RedisConnection

  /** Returns the underlying Node Redis connection being used. */
  get redis(): RedisConnection {
    this.#validateRedisOpen() // validates connection defined
    return this.#redis as RedisConnection
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
    this.#redis = connection
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
      this.#redis = redis
    }
    return this
  }

  /**
   * Creates a repository for the given schema.
   *
   * @param schema The schema.
   * @returns A repository for the provided schema.
   */
  fetchRepository<T extends Schema<any>>(schema: T): Repository<InferSchema<T>> {
    return new Repository(schema, this.redis)
  }

  /**
   * Close the connection to Redis.
   */
  async close() {
    if (this.#redis) await this.#redis.quit()
    this.#redis = undefined
  }

  /** @internal */
  async search(indexName: string, query: string, options?: SearchOptions): Promise<SearchResults> {
    if (options) return await this.redis.ft.search(indexName, query, options)
    return await this.redis.ft.search(indexName, query)
  }

  /**
   * @returns Whether a connection is already open.
   */
  isOpen() {
    return !!this.#redis
  }

  #validateRedisOpen(): asserts this is { redis: RedisConnection } {
    if (!this.#redis) throw new RedisOmError('Redis connection needs to be open.')
  }
}
