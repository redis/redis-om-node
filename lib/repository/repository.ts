import Schema from "../schema/schema";
import Client from "../client";
import Entity from '../entity/entity';
import Search from '../search/search';

import { EntityId, EntityKey } from '../entity/entity-types';

export default class Repository<TEntity extends Entity> {
  private schema: Schema<TEntity>;
  private client: Client;

  constructor(schema: Schema<TEntity>, client: Client) {
    this.schema = schema;
    this.client = client;
  }

  async createIndex() {
    await this.client.createIndex(
      this.schema.indexName,
      this.schema.dataStructure,
      `${this.schema.prefix}:`,
      this.schema.redisSchema);
  }

  async dropIndex() {
    await this.client.dropIndex(this.schema.indexName);
  }

  createEntity(): TEntity {
    let id: EntityId = this.schema.generateId();
    return new this.schema.entityCtor(id);
  }

  async save(entity: TEntity): Promise<EntityId> {

    let key: EntityKey = this.makeKey(entity.entityId);

    if (Object.keys(entity.entityData).length === 0) {
      await this.client.unlink(key);
      return entity.entityId;
    }

    await this.client.hsetall(key, entity.entityData);
    return entity.entityId;
  }

  async fetch(id: EntityId): Promise<TEntity> {
    let key = this.makeKey(id);
    let data = await this.client.hgetall(key);
    let entity = new this.schema.entityCtor(id, data);
    return entity;
  }

  async remove(id: EntityId): Promise<void> {
    let key = this.makeKey(id);
    await this.client.unlink(key);
  }

  search(): Search<TEntity> {
    return new Search<TEntity>(this.schema, this.client);
  }

  private makeKey(id: EntityId): EntityKey {
    return `${this.schema.prefix}:${id}`;
  }
}
