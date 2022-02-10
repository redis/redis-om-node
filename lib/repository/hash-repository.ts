import Repository from "./repository";
import Schema from "../schema/schema";
import Client from "../client";
import Entity, { EntityData } from "../entity/entity";
import HashConverter from "./hash-converter";

export default class HashRepository<TEntity extends Entity> extends Repository<TEntity> {
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

