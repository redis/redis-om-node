import Repository from "./repository";
import Schema from "../schema/schema";
import Client from "../client";
import Entity, { EntityData } from "../entity/entity";
import JsonConverter from "./json-converter";

export default class JsonRepository<TEntity extends Entity> extends Repository<TEntity> {
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
