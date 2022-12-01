import { Schema } from "../schema"
import { Client, RedisHashData, RedisJsonData } from "../client"

import { Search, RawSearch } from '../search/search';

import { CreateIndexOptions } from "../client";
import { buildRediSearchIndex } from "../indexer";
import { fromRedisHash, fromRedisJson, toRedisHash, toRedisJson } from "../transformer";
import { Entity, EntityData } from "../entity";

/**
 * A repository is the main interaction point for reading, writing, and
 * removing {@link Entity | Entities} from Redis. Create one by calling
 * {@link Client.fetchRepository} and passing in a {@link Schema}. Then
 * use the {@link Repository.fetch}, {@link Repository.save}, and
 * {@link Repository.remove} methods to manage your data:
 *
 * ```typescript
 * const repository = client.fetchRepository<Foo>(schema);
 *
 * const foo = await repository.fetch('01FK6TCJBDK41RJ766A4SBWDJ9');
 * foo.aString = 'bar';
 * foo.aBoolean = false;
 * await repository.save(foo);
 * ```
 *
 * Be sure to use the repository to create a new instance of an
 * {@link Entity} you want to create before you save it:

 * ```typescript
 * const foo = await repository.createEntity();
 * foo.aString = 'bar';
 * foo.aBoolean = false;
 * await repository.save(foo);
 * ```
 *
 * If you want to the {@link Repository.search} method, you need to create an index
 * first, and you need RediSearch or RedisJSON installed on your instance of Redis:
 *
 * ```typescript
 * await repository.createIndex();
 * const entities = await repository.search()
 *   .where('aString').eq('bar')
 *   .and('aBoolean').is.false().returnAll();
 * ```
 */
export abstract class Repository {
  protected client: Client;
  protected schema: Schema;

  /** @internal */
  constructor(schema: Schema, client: Client) {
    this.schema = schema;
    this.client = client
  }

  /**
   * Creates an index in Redis for use by the {@link Repository#search} method. Requires
   * that RediSearch or RedisJSON is installed on your instance of Redis.
   */
  async createIndex() {

    const currentIndexHash = await this.client.get(this.schema.indexHashName)
    const incomingIndexHash = this.schema.indexHash

    if (currentIndexHash !== incomingIndexHash) {

      await this.dropIndex();

      const options: CreateIndexOptions = {
        indexName: this.schema.indexName,
        dataStructure: this.schema.dataStructure,
        prefix: `${this.schema.prefix}:`,
        schema: buildRediSearchIndex(this.schema)
      };

      if (this.schema.useStopWords === 'OFF') options.stopWords = []
      if (this.schema.useStopWords === 'CUSTOM') options.stopWords = this.schema.stopWords

      await this.client.createIndex(options);
      await this.client.set(this.schema.indexHashName, incomingIndexHash);
    }
  }

  /**
   * Removes an existing index from Redis. Use this method if you want to swap out your index
   * because your {@link Entity} has changed. Requires that RediSearch or RedisJSON is installed
   * on your instance of Redis.
   */
  async dropIndex() {
    try {
      await this.client.unlink(this.schema.indexHashName);
      await this.client.dropIndex(this.schema.indexName);
    } catch (e) {
      if (e instanceof Error && e.message === "Unknown Index name") {
        // no-op: the thing we are dropping doesn't exist
      } else {
        throw e
      }
    }
  }

  /**
   * Creates an empty {@link Entity} with a generated {@link Entity#entityId} property.
   *
   * @returns A newly created Entity.
   */
  createEntity(): Entity

  /**
   * Creates an empty {@link Entity} with a provided {@link Entity#entityId} property.
   *
   * @param id The provided entityId.
   * @returns A newly created Entity.
   */
  createEntity(id: string): Entity

  /**
   * Creates an {@link Entity} populated with provided data and a generated {@link Entity#entityId} property.
   *
   * @param entityData The provided entity data.
   * @returns A newly created Entity.
   */
  createEntity(entityData: EntityData): Entity

  /**
   * Creates an {@link Entity} populated with provided data and a provided {@link Entity#entityId} property.
   *
   * @param id The provided entityId.
   * @param entityData The provided entity data.
   * @returns A newly created Entity.
   */
  createEntity(id: string, entityData: EntityData): Entity

  createEntity(entityDataOrId?: EntityData | string, maybeEntityData?: EntityData): Entity {
    const entityId = typeof(entityDataOrId) === 'string' ? entityDataOrId : this.schema.generateId()
    const keyName = `${this.schema.prefix}:${entityId}`
    const entityData = typeof(entityDataOrId) === 'object' ? entityDataOrId : maybeEntityData ?? {}
    return { ...entityData, entityId, keyName }
  }

  /**
   * Insert or update the {@link Entity} to Redis using its {@link Entity#entityId} property
   * if present. If it's not, it generates one.
   *
   * @param entity The Entity to save.
   * @returns The provided or generated entityId.
   */
  async save(entity: Entity): Promise<string>

  /**
   * Insert or update the {@link Entity} to Redis using the provided {@link Entity#entityId}.
   *
   * @param id The Entity to save.
   * @param entity The Entity to save.
   * @returns The provided or generated entityId.
   */
  async save(id: string, entity: Entity): Promise<string>

  async save(entityOrId: Entity | string, maybeEntity?: Entity): Promise<string> {
    const entityId = typeof(entityOrId) === 'string' ? entityOrId : entityOrId.entityId ?? this.schema.generateId()
    const keyName = `${this.schema.prefix}:${entityId}`
    const entity = typeof(entityOrId) === 'object' ? entityOrId : maybeEntity ?? {}
    await this.writeEntity({ ...entity, entityId, keyName })
    return entityId
  }

  /**
   * Creates and saves an {@link Entity}. Equivalent of calling
   * {@link Repository.createEntity} followed by {@link Repository.save}.
   *
   * @param entityData The data to be saved.
   * @returns The newly created and saved Entity.
   */
  async createAndSave(entityData: EntityData): Promise<Entity>

  /**
   * Creates and saves an {@link Entity} to the provided {@link Entity#entityId}. Equivalent
   * of calling {@link Repository.createEntity} followed by {@link Repository.save}.
   *
   * @param entityData The data to be saved.
   * @returns The newly created and saved Entity.
   */
  async createAndSave(id: string, entityData: EntityData): Promise<Entity>

  async createAndSave(entityDataOrId: EntityData | string, maybeEntityData?: EntityData): Promise<Entity> {
    const entityId = typeof(entityDataOrId) === 'string' ? entityDataOrId : this.schema.generateId()
    const keyName = `${this.schema.prefix}:${entityId}`
    const entityData = typeof(entityDataOrId) === 'object' ? entityDataOrId : maybeEntityData ?? {}
    const entity = { ...entityData, entityId, keyName }
    await this.writeEntity(entity)
    return entity
  }

  /**
   * Read and return an {@link Entity} from Redis with the given id. If
   * the {@link Entity} is not found, returns an {@link Entity} with all
   * properties set to `null`.
   * @param id The ID of the {@link Entity} you seek.
   * @returns The matching Entity.
   */
  async fetch(id: string): Promise<object>

  /**
   * Read and return the {@link Entity | Entities} from Redis with the given IDs. If
   * a particular {@link Entity} is not found, returns an {@link Entity} with all
   * properties set to `null`.
   * @param ids The IDs of the {@link Entity | Entities} you seek.
   * @returns The matching Entities.
   */
  async fetch(...ids: string[]): Promise<object[]>

  /**
   * Read and return the {@link Entity | Entities} from Redis with the given IDs. If
   * a particular {@link Entity} is not found, returns an {@link Entity} with all
   * properties set to `null`.
   * @param ids The IDs of the {@link Entity | Entities} you seek.
   * @returns The matching Entities.
   */
  async fetch(ids: string[]): Promise<object[]>

  async fetch(ids: string | string[]): Promise<object | object[]> {
    if (arguments.length > 1) {
      return this.readEntities([...arguments]);
    }

    if (Array.isArray(ids)) {
      return this.readEntities(ids)
    }

    const entities = await this.readEntities([ids])
    return entities[0]
  }

  /**
   * Remove an {@link Entity} from Redis with the given id. If the {@link Entity} is
   * not found, does nothing.
   * @param id The ID of the {@link Entity} you wish to delete.
   */
  async remove(id: string): Promise<void>

  /**
   * Remove the {@link Entity | Entities} from Redis with the given ids. If a
   * particular {@link Entity} is not found, does nothing.
   * @param ids The IDs of the {@link Entity | Entities} you wish to delete.
   */
  async remove(...ids: string[]): Promise<void>

  /**
   * Remove the {@link Entity | Entities} from Redis with the given ids. If a
   * particular {@link Entity} is not found, does nothing.
   * @param ids The IDs of the {@link Entity | Entities} you wish to delete.
   */
  async remove(ids: string[]): Promise<void>

  async remove(ids: string | string[]): Promise<void> {
    const keys = arguments.length > 1
      ? this.makeKeys([...arguments])
      : Array.isArray(ids)
        ? this.makeKeys(ids)
        : ids ? this.makeKeys([ids]) : []

    if (keys.length === 0) return;
    await this.client.unlink(...keys);
  }

  /**
   * Set the time to live of the {@link Entity}. If the {@link Entity} is not
   * found, does nothing.
   * @param id The ID of the {@link Entity} to set and expiration for.
   * @param ttlInSeconds THe time to live in seconds.
   */
  async expire(id: string, ttlInSeconds: number) {
    const key = this.makeKey(id);
    await this.client.expire(key, ttlInSeconds);
  }

  /**
   * Kicks off the process of building a query. Requires that RediSearch (and optionally
   * RedisJSON) be is installed on your instance of Redis.
   * @template TEntity The type of {@link Entity} sought.
   * @returns A {@link Search} object.
   */
  search(): Search {
    return new Search(this.schema, this.client);
  }

  /**
   * Creates a search that bypassed Redis OM and instead allows you to execute a raw
   * RediSearch query. Requires that RediSearch (and optionally RedisJSON) be installed
   * on your instance of Redis.
   * @template TEntity The type of {@link Entity} sought.
   * @query The raw RediSearch query you want to rune.
   * @returns A {@link RawSearch} object.
   */
  searchRaw(query: string): RawSearch {
    return new RawSearch(this.schema, this.client, query);
  }

  /** @internal */
  protected abstract writeEntity(entity: Entity): Promise<void>;

  /** @internal */
  protected abstract readEntities(ids: string[]): Promise<Entity[]>;

  /** @internal */
  protected makeKeys(ids: string[]): string[] {
    return ids.map(id => this.makeKey(id));
  }

  /** @internal */
  protected makeKey(id: string): string {
    return `${this.schema.prefix}:${id}`;
  }
}

/** @internal */
export class HashRepository extends Repository {
  protected async writeEntity(entity: Entity): Promise<void> {
    const { entityId, keyName, ...entityData } = entity
    const hashData: RedisHashData = toRedisHash(this.schema, entityData)
    if (Object.keys(hashData).length === 0) {
      await this.client.unlink(keyName ?? '');
    } else {
      await this.client.hsetall(keyName ?? '', hashData);
    }
  }

  protected async readEntities(ids: string[]): Promise<Entity[]> {
    return Promise.all(
      ids.map(async (id) => {
        const key = this.makeKey(id);
        const hashData = await this.client.hgetall(key);
        const entity = fromRedisHash(this.schema, hashData)
        return entity;
      }));
  }
}

/** @internal */
export class JsonRepository extends Repository {
  protected async writeEntity(entity: Entity): Promise<void> {
    const { entityId, keyName, ...entityData } = entity
    const jsonData: RedisJsonData = toRedisJson(this.schema, entityData)
    await this.client.jsonset(keyName ?? '', jsonData);
  }

  protected async readEntities(ids: string[]): Promise<Entity[]> {
    return Promise.all(
      ids.map(async (id) => {
        const key = this.makeKey(id);
        const jsonData = await this.client.jsonget(key);
        const entity = fromRedisJson(this.schema, jsonData);
        return entity;
      }));
  }
}
