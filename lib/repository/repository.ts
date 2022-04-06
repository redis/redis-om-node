import Schema from "../schema/schema"
import Client from "../client";
import Entity from "../entity/entity";
import EntityData from "../entity/entity-data";
import Point from "../entity/point";

import { Search, RawSearch } from '../search/search';

import { CreateIndexOptions } from "../client";
import { JsonConverter, HashConverter } from "./converter";

/**
 * Initialization data for {@link Entity} creation when calling
 * {@link Repository.createEntity} or {@link Repository.createAndSave}.
 */
export type EntityCreationData = Record<string, number | boolean | string | string[] | Point | Date | null>;

/**
 * A repository is the main interaction point for reading, writing, and
 * removing {@link Entity | Entities} from Redis. Create one by calling
 * {@link Client.fetchRepository} and passing in a {@link Schema}. Then
 * use the {@link Repository.fetch}, {@link Repository.save}, and
 * {@link Repository.remove} methods to manage your data:
 *
 * ```typescript
 * let repository = client.fetchRepository<Foo>(schema);
 *
 * let foo = await repository.fetch('01FK6TCJBDK41RJ766A4SBWDJ9');
 * foo.aString = 'bar';
 * foo.aBoolean = false;
 * await repository.save(foo);
 * ```
 *
 * Be sure to use the repository to create a new instance of an
 * {@link Entity} you want to create before you save it:

 * ```typescript
 * let foo = await repository.createEntity();
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
 * let entities = await repository.search()
 *   .where('aString').eq('bar')
 *   .and('aBoolean').is.false().returnAll();
 * ```
 *
 * @template TEntity The type of {@link Entity} that this repository manages.
 */
 export default abstract class Repository<TEntity extends Entity> {
  protected client: Client;
  private schema: Schema<TEntity>;

  /** @internal */
  constructor(schema: Schema<TEntity>, client: Client) {
    this.schema = schema;
    this.client = client
  }

  /**
   * Creates an index in Redis for use by the {@link Repository.search} method. Requires
   * that RediSearch or RedisJSON is installed on your instance of Redis.
   */
  async createIndex() {

    let currentIndexHash = await this.client.get(this.schema.indexHashName)

    if (currentIndexHash !== this.schema.indexHash) {

      await this.dropIndex();

      let options : CreateIndexOptions = {
        indexName: this.schema.indexName,
        dataStructure: this.schema.dataStructure,
        prefix: `${this.schema.prefix}:`,
        schema: this.schema.redisSchema
      };

      if (this.schema.useStopWords === 'OFF') options.stopWords = []
      if (this.schema.useStopWords === 'CUSTOM') options.stopWords = this.schema.stopWords

      await this.client.createIndex(options);
      await this.client.set(this.schema.indexHashName, this.schema.indexHash);
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
   * Creates an {@link Entity} with a populated {@link Entity.entityId} property.
   * @param data Optional values with which to initialize the entity.
   * @returns A newly created Entity.
   */
  createEntity(data: EntityCreationData = {}): TEntity {
    let id = this.schema.generateId();
    let entity = new this.schema.entityCtor(this.schema, id);
    for (let key in data) {
      if (this.schema.entityCtor.prototype.hasOwnProperty(key)) {
        (entity as Record<string, any>)[key] = data[key]
      }
    }
    return entity;
  }

  /**
   * Save the {@link Entity} to Redis. If it already exists, it will be updated. If it doesn't
   * exist, it will be created.
   * @param entity The Entity to save.
   * @returns The ID of the Entity just saved.
   */
  async save(entity: TEntity) : Promise<string> {
    let key = this.makeKey(entity.entityId);

    if (Object.keys(entity.entityData).length === 0) {
      await this.client.unlink(key);
    } else {
      await this.writeEntity(key, entity.entityData);
    }

    return entity.entityId;
  }

  /**
   * Creates and saves an {@link Entity}. Equivalent of calling
   * {@link Repository.createEntity} followed by {@link Repository.save}.
   * @param data Optional values with which to initialize the entity.
   * @returns The newly created and saved Entity.
   */
  async createAndSave(data: EntityCreationData = {}): Promise<TEntity> {
    let entity = this.createEntity(data);
    await this.save(entity)
    return entity
  }

  /**
   * Read and return an {@link Entity} from Redis with the given id. If
   * the {@link Entity} is not found, returns an {@link Entity} with all
   * properties set to `null`.
   * @param id The ID of the {@link Entity} you seek.
   * @returns The matching Entity.
   */
  async fetch(id: string): Promise<TEntity> {
    let key = this.makeKey(id);
    let entityData = await this.readEntity(key);
    return new this.schema.entityCtor(this.schema, id, entityData);
  }

  /**
   * Remove an {@link Entity} from Redis with the given id. If the {@link Entity} is
   * not found, does nothing.
   * @param id The ID of the {@link Entity} you with to delete.
   */
  async remove(id: string): Promise<void> {
    let key = this.makeKey(id);
    await this.client.unlink(key);
  }

  /**
   * Set the time to live of the {@link Entity}. If the {@link Entity} is not
   * found, does nothing.
   * @param id The ID of the {@link Entity} to set and expiration for.
   * @param ttlInSeconds THe time to live in seconds.
   */
  async expire(id: string, ttlInSeconds: number) {
    let key =  this.makeKey(id);
    await this.client.expire(key, ttlInSeconds);
  }

  /**
   * Kicks off the process of building a query. Requires that RediSearch (and optionally
   * RedisJSON) be is installed on your instance of Redis.
   * @template TEntity The type of {@link Entity} sought.
   * @returns A {@link Search} object.
   */
  search(): Search<TEntity> {
    return new Search<TEntity>(this.schema, this.client);
  }

  /**
   * Creates a search that bypassed Redis OM and instead allows you to execute a raw
   * RediSearch query. Requires that RediSearch (and optionally RedisJSON) be installed
   * on your instance of Redis.
   * @template TEntity The type of {@link Entity} sought.
   * @query The raw RediSearch query you want to rune.
   * @returns A {@link RawSearch} object.
   */
  searchRaw(query: string): RawSearch<TEntity> {
    return new RawSearch<TEntity>(this.schema, this.client, query);
  }

  /** @internal */
  protected abstract writeEntity(key: string, data: EntityData): Promise<void>;

  /** @internal */
  protected abstract readEntity(key: string): Promise<EntityData>;

  /** @internal */
  protected makeKey(id: string): string {
    return `${this.schema.prefix}:${id}`;
  }
}

/** @internal */
export class HashRepository<TEntity extends Entity> extends Repository<TEntity> {
  private converter: HashConverter;

  constructor(schema: Schema<TEntity>, client: Client) {
    super(schema, client);
    this.converter = new HashConverter(schema.definition);
  }

  protected async writeEntity(key: string, data: EntityData): Promise<void> {
    let hashData = this.converter.toHashData(data);
    await this.client.hsetall(key, hashData);
  }

  protected async readEntity(key: string): Promise<EntityData> {
    let hashData = await this.client.hgetall(key);
    return this.converter.toEntityData(hashData);
  }
}

/** @internal */
export class JsonRepository<TEntity extends Entity> extends Repository<TEntity> {
  private converter: JsonConverter;

  constructor(schema: Schema<TEntity>, client: Client) {
    super(schema, client);
    this.converter = new JsonConverter(schema.definition);
  }

  protected async writeEntity(key: string, data: EntityData): Promise<void> {
    let jsonData = this.converter.toJsonData(data);
    await this.client.jsonset(key, jsonData);
  }

  protected async readEntity(key: string): Promise<EntityData> {
    let jsonData = await this.client.jsonget(key);
    return this.converter.toEntityData(jsonData);
  }
}
