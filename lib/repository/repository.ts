import { CreateOptions, RedisConnection, RedisHashData, RedisJsonData } from '../client'
import { Entity, EntityId, EntityKeyName } from '../entity'
import { buildRediSearchSchema } from '../indexer'
import { Schema } from '../schema'
import { RawSearch, Search } from '../search'
import { fromRedisHash, fromRedisJson, toRedisHash, toRedisJson } from '../transformer'

/**
 * A repository is the main interaction point for reading, writing, and
 * removing {@link Entity | Entities} from Redis. Create one using new and
 * passing in a {@link Schema} and an open Redis connection. Then
 * use the {@link Repository#fetch}, {@link Repository#save}, and
 * {@link Repository#remove} methods to manage your data:
 *
 * ```typescript
 * const repository = new Repository(schema, redis)
 *
 * const foo = await repository.fetch('01FK6TCJBDK41RJ766A4SBWDJ9')
 * foo.aString = 'bar'
 * foo.aBoolean = false
 * await repository.save(foo)
 * ```
 *
 * If you want to use the {@link Repository#search} method, you need to create an index
 * first, and you need RediSearch or RedisJSON installed on your instance of Redis:
 *
 * ```typescript
 * await repository.createIndex()
 * const entities = await repository.search()
 *   .where('aString').eq('bar')
 *   .and('aBoolean').is.false().returnAll()
 * ```
 */
export class Repository<T extends Entity = Record<string, any>> {
  readonly #schema: Schema<T>
  #redis: RedisConnection

  /**
   * Creates a new {@link Repository}.
   *
   * @param schema The schema defining that data in the repository.
   * @param redis A connected Redis client.
   */
  constructor(schema: Schema<T>, redis: RedisConnection) {
    this.#schema = schema
    this.#redis = redis
  }

  /**
   * Creates an index in Redis for use by the {@link Repository#search} method.
   * Does not create a new index if the index hasn't changed. Requires that
   * RediSearch and RedisJSON are installed on your instance of Redis.
   */
  async createIndex() {
    const incomingIndexHash = this.#schema.indexHash

    // TODO: use a transaction to getset the current index hash and get the indexing status
    const currentIndexHash = await this.#redis.get(this.#schema.indexHashName)

    // if there is no hash change, return
    // if there is a hash change and the index is building, return an error
    // if there is a hash change and the index is not building, use a transaction to drop the index and create a new one

    // NOTE: might want to refactor how Client works to make this easier

    if (currentIndexHash !== incomingIndexHash) {
      await this.dropIndex()

      const { indexName, indexHashName, dataStructure, schemaName: prefix, useStopWords, stopWords } = this.#schema

      const schema = buildRediSearchSchema(this.#schema)
      const options: CreateOptions = {
        ON: dataStructure,
        PREFIX: `${prefix}:`
      }

      if (useStopWords === 'OFF') {
        options.STOPWORDS = []
      } else if (useStopWords === 'CUSTOM') {
        options.STOPWORDS = stopWords
      }

      await Promise.all([
        this.#redis.ft.create(indexName, schema, options),
        this.#redis.set(indexHashName, incomingIndexHash)
      ])
    }
  }

  /**
   * Removes an existing index from Redis. Use this method if you want to swap out your index
   * because your {@link Entity} has changed. Requires that RediSearch and RedisJSON are installed
   * on your instance of Redis.
   */
  async dropIndex() {
    try {
      await Promise.all([
        this.#redis.unlink(this.#schema.indexHashName),
        this.#redis.ft.dropIndex(this.#schema.indexName)
      ])
    } catch (e) {
      /* NOTE: It would be better if this error handler was only around the call
         to `.dropIndex`. Might muss up the code a bit though. Life is full of
         tough choices. */
      if (e instanceof Error && (e.message === 'Unknown Index name' || e.message === 'Unknown index name')) {
        // no-op: the thing we are dropping doesn't exist
      } else {
        throw e
      }
    }
  }

  /**
   * Insert or update an {@link Entity} to Redis using its entityId property
   * if present. If it's not, one is generated.
   *
   * @param entity The Entity to save.
   * @returns A copy of the provided Entity with EntityId and EntityKeyName properties added.
   */
  async save(entity: T): Promise<T>

  /**
   * Insert or update the {@link Entity} to Redis using the provided entityId.
   *
   * @param id The id to save the Entity under.
   * @param entity The Entity to save.
   * @returns A copy of the provided Entity with EntityId and EntityKeyName properties added.
   */
  async save(id: string, entity: T): Promise<T>

  async save(entityOrId: T | string, maybeEntity?: T): Promise<T> {
    let entity: T | undefined
    let entityId: string | undefined

    if (typeof entityOrId !== 'string') {
      entity = entityOrId
      entityId = entity[EntityId] ?? (await this.#schema.generateId())
    } else {
      entity = maybeEntity
      entityId = entityOrId
    }

    const keyName = `${this.#schema.schemaName}:${entityId}`
    const clonedEntity = { ...entity, [EntityId]: entityId, [EntityKeyName]: keyName } as T
    await this.writeEntity(clonedEntity)

    return clonedEntity
  }

  /**
   * Read and return an {@link Entity} from Redis for the given id. If
   * the {@link Entity} is not found, returns an empty {@link Entity}.
   *
   * @param id The ID of the {@link Entity} you seek.
   * @returns The matching Entity.
   */
  async fetch(id: string): Promise<T>

  /**
   * Read and return the {@link Entity | Entities} from Redis with the given IDs. If
   * a particular {@link Entity} is not found, returns that {@link Entity} as empty.
   *
   * @param ids The IDs of the {@link Entity | Entities} you seek.
   * @returns The matching Entities.
   */
  async fetch(...ids: string[]): Promise<T[]>

  /**
   * Read and return the {@link Entity | Entities} from Redis with the given IDs. If
   * a particular {@link Entity} is not found, returns that {@link Entity} as empty.
   *
   * @param ids The IDs of the {@link Entity | Entities} you seek.
   * @returns The matching Entities.
   */
  async fetch(ids: string[]): Promise<T[]>

  async fetch(ids: string | string[]): Promise<T | T[]> {
    if (arguments.length > 1) return this.readEntities([...arguments])
    if (Array.isArray(ids)) return this.readEntities(ids)

    const [entity] = await this.readEntities([ids])
    return entity!
  }

  /**
   * Remove an {@link Entity} from Redis for the given id. If the {@link Entity} is
   * not found, does nothing.
   *
   * @param id The ID of the {@link Entity} you wish to delete.
   */
  async remove(id: string): Promise<void>

  /**
   * Remove the {@link Entity | Entities} from Redis for the given ids. If a
   * particular {@link Entity} is not found, does nothing.
   *
   * @param ids The IDs of the {@link Entity | Entities} you wish to delete.
   */
  async remove(...ids: string[]): Promise<void>

  /**
   * Remove the {@link Entity | Entities} from Redis for the given ids. If a
   * particular {@link Entity} is not found, does nothing.
   *
   * @param ids The IDs of the {@link Entity | Entities} you wish to delete.
   */
  async remove(ids: string[]): Promise<void>

  async remove(ids: string | string[]): Promise<void> {
    // TODO: clean code
    const keys =
      arguments.length > 1
        ? this.makeKeys([...arguments])
        : Array.isArray(ids)
          ? this.makeKeys(ids)
          : ids
            ? this.makeKeys([ids])
            : []

    if (keys.length === 0) return
    await this.#redis.unlink(keys)
  }

  /**
   * Set the time to live of the {@link Entity}. If the {@link Entity} is not
   * found, does nothing.
   *
   * @param id The ID of the {@link Entity} to set and expiration for.
   * @param ttlInSeconds The time to live in seconds.
   */
  async expire(id: string, ttlInSeconds: number): Promise<void>

  /**
   * Set the time to live of the {@link Entity | Entities} in Redis with the given
   * ids. If a particular {@link Entity} is not found, does nothing.
   *
   * @param ids The IDs of the {@link Entity | Entities} you wish to delete.
   * @param ttlInSeconds The time to live in seconds.
   */
  async expire(ids: string[], ttlInSeconds: number): Promise<void>

  async expire(idOrIds: string | string[], ttlInSeconds: number): Promise<void> {
    const ids = typeof idOrIds === 'string' ? [idOrIds] : idOrIds
    await Promise.all(
      ids.map(id => {
        const key = this.makeKey(id)
        return this.#redis.expire(key, ttlInSeconds)
      })
    )
  }

  /**
   * Use Date object to set the {@link Entity}'s time to live. If the {@link Entity}
   * is not found, does nothing.
   *
   * @param id The ID of the {@link Entity} to set an expiration date for.
   * @param expirationDate The time the data should expire.
   */
  async expireAt(id: string, expirationDate: Date): Promise<void>

  /**
   * Use Date object to set the {@link Entity | Entities} in Redis with the given
   * ids. If a particular {@link Entity} is not found, does nothing.
   *
   * @param ids The IDs of the {@link Entity | Entities} to set an expiration date for.
   * @param expirationDate The time the data should expire.
   */
  async expireAt(ids: string[], expirationDate: Date): Promise<void>

  async expireAt(idOrIds: string | string[], expirationDate: Date) {
    const ids = typeof idOrIds === 'string' ? [idOrIds] : idOrIds
    if (Date.now() >= expirationDate.getTime()) {
      throw new Error(`${expirationDate.toString()} is invalid. Expiration date must be in the future.`)
    }
    await Promise.all(
      ids.map(id => {
        const key = this.makeKey(id)
        return this.#redis.expireAt(key, expirationDate)
      })
    )
  }

  /**
   * Kicks off the process of building a query. Requires that RediSearch (and optionally
   * RedisJSON) be installed on your instance of Redis.
   *
   * @returns A {@link Search} object.
   */
  search(): Search<T> {
    return new Search(this.#schema, this.#redis)
  }

  /**
   * Creates a search that bypasses Redis OM and instead allows you to execute a raw
   * RediSearch query. Requires that RediSearch (and optionally RedisJSON) be installed
   * on your instance of Redis.
   *
   * Refer to https://redis.io/docs/stack/search/reference/query_syntax/ for details on
   * RediSearch query syntax.
   *
   * @query The raw RediSearch query you want to rune.
   * @returns A {@link RawSearch} object.
   */
  searchRaw(query: string): RawSearch<T> {
    return new RawSearch(this.#schema, this.#redis, query)
  }

  private async writeEntity(entity: T): Promise<void> {
    return this.#schema.dataStructure === 'HASH' ? this.#writeEntityToHash(entity) : this.writeEntityToJson(entity)
  }

  private async readEntities(ids: string[]): Promise<T[]> {
    return this.#schema.dataStructure === 'HASH' ? this.readEntitiesFromHash(ids) : this.readEntitiesFromJson(ids)
  }

  async #writeEntityToHash(entity: Entity): Promise<void> {
    const keyName = entity[EntityKeyName]!
    const hashData: RedisHashData = toRedisHash(this.#schema, entity)
    if (Object.keys(hashData).length === 0) {
      await this.#redis.unlink(keyName)
    } else {
      await this.#redis.multi().unlink(keyName).hSet(keyName, hashData).exec()
    }
  }

  private async readEntitiesFromHash(ids: string[]): Promise<T[]> {
    return Promise.all(
      ids.map(async (entityId): Promise<T> => {
        const keyName = this.makeKey(entityId)
        const hashData = await this.#redis.hGetAll(keyName)
        const entityData = fromRedisHash(this.#schema, hashData)
        return { ...entityData, [EntityId]: entityId, [EntityKeyName]: keyName } as T
      })
    )
  }

  private async writeEntityToJson(entity: Entity): Promise<void> {
    const keyName = entity[EntityKeyName]!
    const jsonData: RedisJsonData = toRedisJson(this.#schema, entity)
    await this.#redis.json.set(keyName, '$', jsonData)
  }

  private async readEntitiesFromJson(ids: string[]): Promise<T[]> {
    return Promise.all(
      ids.map(async (entityId): Promise<T> => {
        const keyName = this.makeKey(entityId)
        const jsonData = (await this.#redis.json.get(keyName)) ?? {}
        const entityData = fromRedisJson(this.#schema, jsonData as RedisJsonData)
        return { ...entityData, [EntityId]: entityId, [EntityKeyName]: keyName } as T
      })
    )
  }

  private makeKeys(ids: string[]): string[] {
    return ids.map(id => this.makeKey(id))
  }

  private makeKey(id: string): string {
    return `${this.#schema.schemaName}:${id}`
  }
}
