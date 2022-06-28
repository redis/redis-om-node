import { Schema } from "../schema/schema"
import { Client } from "../client";
import { Entity } from "../entity/entity";

import { Search, RawSearch } from '../search/search';

import { CreateIndexOptions } from "../client";
import { EntityData } from "../entity/entity-data";

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
 *
 * @template TEntity The type of {@link Entity} that this repository manages.
 */
export abstract class Repository<TEntity extends Entity> {
  protected client: Client;
  protected schema: Schema<TEntity>;

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

    const currentIndexHash = await this.client.get(this.schema.indexHashName)

    if (currentIndexHash !== this.schema.indexHash) {

      await this.dropIndex();

      const options: CreateIndexOptions = {
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
  createEntity(data: EntityData = {}): TEntity {
    const id = this.schema.generateId();
    return new this.schema.entityCtor(this.schema, id, data);
  }

  /**
   * Save the {@link Entity} to Redis. If it already exists, it will be updated. If it doesn't
   * exist, it will be created.
   * @param entity The Entity to save.
   * @returns The ID of the Entity just saved.
   */
  async save(entity: TEntity): Promise<string> {
    await this.writeEntity(entity);
    return entity.entityId;
  }

  /**
   * Creates and saves an {@link Entity}. Equivalent of calling
   * {@link Repository.createEntity} followed by {@link Repository.save}.
   * @param data Optional values with which to initialize the entity.
   * @returns The newly created and saved Entity.
   */
  async createAndSave(data: EntityData = {}): Promise<TEntity> {
    const entity = this.createEntity(data);
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
  async fetch(id: string): Promise<TEntity>

  /**
   * Read and return the {@link Entity | Entities} from Redis with the given IDs. If
   * a particular {@link Entity} is not found, returns an {@link Entity} with all
   * properties set to `null`.
   * @param ids The IDs of the {@link Entity | Entities} you seek.
   * @returns The matching Entities.
   */
  async fetch(...ids: string[]): Promise<TEntity[]>

  async fetch(...id: string[]): Promise<TEntity | TEntity[]> {
    const entities = await this.readEntities(id)
    return id.length > 1 ? entities : entities[0];
  }

  /**
   * Remove an {@link Entity} from Redis with the given id. If the {@link Entity} is
   * not found, does nothing.
   * @param id The ID of the {@link Entity} you with to delete.
   */
  async remove(...ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    const keys = this.makeKeys(ids);
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
  protected abstract writeEntity(entity: TEntity): Promise<void>;

  /** @internal */
  protected abstract readEntities(ids: string[]): Promise<TEntity[]>;

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
export class HashRepository<TEntity extends Entity> extends Repository<TEntity> {
  protected async writeEntity(entity: TEntity): Promise<void> {
    const data = entity.toRedisHash();
    if (Object.keys(data).length === 0) {
      await this.client.unlink(entity.keyName);
      return;
    }
    await this.client.hsetall(entity.keyName, entity.toRedisHash());
  }

  protected async readEntities(ids: string[]): Promise<TEntity[]> {
    return Promise.all(
      ids.map(async (id) => {
        const key = this.makeKey(id);
        const hashData = await this.client.hgetall(key);
        const entity = new this.schema.entityCtor(this.schema, id);
        entity.fromRedisHash(hashData);
        return entity;
      }));
  }
}

/** @internal */
export class JsonRepository<TEntity extends Entity> extends Repository<TEntity> {
  protected async writeEntity(entity: TEntity): Promise<void> {
    await this.client.jsonset(entity.keyName, entity.toRedisJson());
  }

  protected async readEntities(ids: string[]): Promise<TEntity[]> {
    return Promise.all(
      ids.map(async (id) => {
        const key = this.makeKey(id);
        const jsonData = await this.client.jsonget(key);
        const entity = new this.schema.entityCtor(this.schema, id);
        entity.fromRedisJson(jsonData);
        return entity;
      }));
  }
}
