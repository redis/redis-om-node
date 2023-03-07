import { Client, CreateOptions, RedisConnection, RedisHashData, RedisJsonData } from '../client'
import { Entity, EntityId, EntityKeyName } from '../entity'
import { buildRediSearchSchema } from '../indexer'
import { Schema } from '../schema'
import { Search, RawSearch } from '../search'
import { fromRedisHash, fromRedisJson, toRedisHash, toRedisJson } from '../transformer'

/**
 * A repository is the main interaction point for reading, writing, and
 * removing {@link Entity | Entities} from Redis. Create one by calling
 * {@link Client.fetchRepository} and passing in a {@link Schema}. Then
 * use the {@link Repository#fetch}, {@link Repository#save}, and
 * {@link Repository#remove} methods to manage your data:
 *
 * ```typescript
 * const repository = client.fetchRepository(schema)
 *
 * const foo = await repository.fetch('01FK6TCJBDK41RJ766A4SBWDJ9')
 * foo.aString = 'bar'
 * foo.aBoolean = false
 * await repository.save(foo)
 * ```
 *
 * Use the repository to create a new instance of an {@link Entity}
 * before you save it:
 *
 * ```typescript
 * const foo = await repository.createEntity()
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
export class Repository {

  // NOTE: Not using "#" private as the spec needs to check calls on this class. Will be resolved when Client class is removed.
  private client: Client
  #schema: Schema

  /**
   * Creates a new {@link Repository}.
   *
   * @param schema The schema defining that data in the repository.
   * @param client A client to talk to Redis.
   */
  constructor(schema: Schema, clientOrConnection: Client | RedisConnection) {
    this.#schema = schema
    if (clientOrConnection instanceof Client) {
      this.client = clientOrConnection
    } else {
      this.client = new Client()
      this.client.useNoClose(clientOrConnection)
    }
  }

  /**
   * Creates an index in Redis for use by the {@link Repository#search} method.
   * Does not create a new index if the index hasn't changed. Requires that
   * RediSearch and RedisJSON are installed on your instance of Redis.
   */
  async createIndex() {

    const currentIndexHash = await this.client.get(this.#schema.indexHashName)
    const incomingIndexHash = this.#schema.indexHash

    if (currentIndexHash !== incomingIndexHash) {

      await this.dropIndex()

      const {
        indexName, indexHashName, dataStructure,
        schemaName: prefix, useStopWords, stopWords
      } = this.#schema

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
        this.client.createIndex(indexName, schema, options),
        this.client.set(indexHashName, incomingIndexHash)
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
        this.client.unlink(this.#schema.indexHashName),
        this.client.dropIndex(this.#schema.indexName)
      ])
    } catch (e) {
      /* NOTE: It would be better if this error handler was only around the call
         to `.dropIndex`. Might muss up the code a bit though. Life is full of
         tough choices. */
      if (e instanceof Error && e.message === "Unknown Index name") {
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
  async save(entity: Entity): Promise<Entity>

  /**
   * Insert or update the {@link Entity} to Redis using the provided entityId.
   *
   * @param id The id to save the Entity under.
   * @param entity The Entity to save.
   * @returns A copy of the provided Entity with EntityId and EntityKeyName properties added.
   */
  async save(id: string, entity: Entity): Promise<Entity>

  async save(entityOrId: Entity | string, maybeEntity?: Entity): Promise<Entity> {
    let entity: Entity | undefined
    let entityId: string | undefined

    if (typeof entityOrId !== 'string') {
      entity = entityOrId
      entityId = entity[EntityId] ?? await this.#schema.generateId()
    } else {
      entity = maybeEntity
      entityId = entityOrId
    }

    const keyName = `${this.#schema.schemaName}:${entityId}`
    const clonedEntity = { ...entity, [EntityId]: entityId, [EntityKeyName]: keyName }
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
  async fetch(id: string): Promise<Entity>

  /**
   * Read and return the {@link Entity | Entities} from Redis with the given IDs. If
   * a particular {@link Entity} is not found, returns that {@link Entity} as empty.
   *
   * @param ids The IDs of the {@link Entity | Entities} you seek.
   * @returns The matching Entities.
   */
  async fetch(...ids: string[]): Promise<Entity[]>

  /**
   * Read and return the {@link Entity | Entities} from Redis with the given IDs. If
   * a particular {@link Entity} is not found, returns that {@link Entity} as empty.
   *
   * @param ids The IDs of the {@link Entity | Entities} you seek.
   * @returns The matching Entities.
   */
  async fetch(ids: string[]): Promise<Entity[]>

  async fetch(ids: string | string[]): Promise<Entity | Entity[]> {
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
    const keys = arguments.length > 1
      ? this.makeKeys([...arguments])
      : Array.isArray(ids)
        ? this.makeKeys(ids)
        : ids ? this.makeKeys([ids]) : []

    if (keys.length === 0) return
    await this.client.unlink(...keys)
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
   */
  async expire(ids: string[], ttlInSeconds: number): Promise<void>

  async expire(idOrIds: string | string[], ttlInSeconds: number): Promise<void> {
    const ids = typeof(idOrIds) === 'string' ? [ idOrIds ] : idOrIds
    await Promise.all(
      ids.map(id => {
        const key = this.makeKey(id)
        return this.client.expire(key, ttlInSeconds)
      })
    )
  }

  /**
   * Kicks off the process of building a query. Requires that RediSearch (and optionally
   * RedisJSON) be installed on your instance of Redis.
   *
   * @returns A {@link Search} object.
   */
  search(): Search {
    return new Search(this.#schema, this.client)
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
  searchRaw(query: string): RawSearch {
    return new RawSearch(this.#schema, this.client, query)
  }

  private async writeEntity(entity: Entity): Promise<void> {
    return this.#schema.dataStructure === 'HASH' ? this.writeEntityToHash(entity) : this.writeEntityToJson(entity)
  }

  private async readEntities(ids: string[]): Promise<Entity[]> {
    return this.#schema.dataStructure === 'HASH' ? this.readEntitiesFromHash(ids) : this.readEntitiesFromJson(ids)
  }

  // TODO: make this actually private... like with #
  private async writeEntityToHash(entity: Entity): Promise<void> {
    const keyName = entity[EntityKeyName]!
    const hashData: RedisHashData = toRedisHash(this.#schema, entity)
    if (Object.keys(hashData).length === 0) {
      await this.client.unlink(keyName)
    } else {
      await this.client.hsetall(keyName, hashData)
    }
  }

  private async readEntitiesFromHash(ids: string[]): Promise<Entity[]> {
    return Promise.all(
      ids.map(async (entityId) => {
        const keyName = this.makeKey(entityId)
        const hashData = await this.client.hgetall(keyName)
        const entityData = fromRedisHash(this.#schema, hashData)
        const entity = { ...entityData, [EntityId]: entityId, [EntityKeyName]: keyName }
        return entity
      }))
  }

  private async writeEntityToJson(entity: Entity): Promise<void> {
    const keyName = entity[EntityKeyName]!
    const jsonData: RedisJsonData = toRedisJson(this.#schema, entity)
    await this.client.jsonset(keyName, jsonData)
  }

  private async readEntitiesFromJson(ids: string[]): Promise<Entity[]> {
    return Promise.all(
      ids.map(async (entityId) => {
        const keyName = this.makeKey(entityId)
        const jsonData = await this.client.jsonget(keyName) ?? {}
        const entityData = fromRedisJson(this.#schema, jsonData)
        const entity = {...entityData, [EntityId]: entityId, [EntityKeyName]: keyName }
        return entity
      }))
  }

  private makeKeys(ids: string[]): string[] {
    return ids.map(id => this.makeKey(id))
  }

  private makeKey(id: string): string {
    return `${this.#schema.schemaName}:${id}`
  }
}
