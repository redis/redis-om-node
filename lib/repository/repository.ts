import Schema from "../schema/schema";
import Client from "../client";
import Entity from '../entity/entity';
import Search from '../search/search';

import { EntityData } from '../entity/entity';
import HashConverter from "./hash-converter";
import JsonConverter from "./json-converter";


export default class Repository<TEntity extends Entity> {
  private schema: Schema<TEntity>;
  private client: Client;
  private jsonConverter: JsonConverter;
  private hashConverter: HashConverter;

  constructor(schema: Schema<TEntity>, client: Client) {
    this.schema = schema;
    this.client = client;
    this.jsonConverter = new JsonConverter(this.schema.definition);
    this.hashConverter = new HashConverter(this.schema.definition);
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
    let id = this.schema.generateId();
    return new this.schema.entityCtor(id);
  }

  async save(entity: TEntity): Promise<string> {

    let key = this.makeKey(entity.entityId);

    if (Object.keys(entity.entityData).length === 0) {
      await this.client.unlink(key);
      return entity.entityId;
    }

    if (this.schema.dataStructure === 'JSON') {
      let jsonData = this.jsonConverter.toJsonData(entity.entityData);
      await this.client.jsonset(key, jsonData);
    } else {
      let hashData = this.hashConverter.toHashData(entity.entityData);
      await this.client.hsetall(key, hashData);
    }

    return entity.entityId;
  }

  async fetch(id: string): Promise<TEntity> {
    let key = this.makeKey(id);
    let entityData: EntityData = {};
    
    if (this.schema.dataStructure === 'JSON') {
      let jsonData = await this.client.jsonget(key);
      entityData = this.jsonConverter.toEntityData(jsonData);
    } else {
      let hashData = await this.client.hgetall(key);
      entityData = this.hashConverter.toEntityData(hashData);
    }

    let entity = new this.schema.entityCtor(id, entityData);
    return entity;
  }

  async remove(id: string): Promise<void> {
    let key = this.makeKey(id);
    await this.client.unlink(key);
  }

  search(): Search<TEntity> {
    return new Search<TEntity>(this.schema, this.client);
  }

  private makeKey(id: string): string {
    return `${this.schema.prefix}:${id}`;
  }
}
