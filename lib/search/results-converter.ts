import { RedisHashData, RedisJsonData } from "../client";
import { Entity } from "../entity/entity";
import { Schema } from "../schema/schema";

export abstract class SearchResultsConverter<TEntity extends Entity> {

  private results: any[];
  protected schema: Schema<TEntity>;

  constructor(schema: Schema<TEntity>, results: any[]) {
    this.schema = schema;
    this.results = results;
  }

  get count(): number {
    const [count] = this.results;
    return Number.parseInt(count);
  }

  get ids(): Array<string> {
    return this.keys.map(key => key.toString().replace(/^.*:/, ""));
  }

  get keys(): Array<string> {
    const [_count, ...keysAndValues] = this.results;
    return keysAndValues.filter((_entry, index) => index % 2 === 0);
  }

  get values(): any[] {
    const [_count, ...keysAndValues] = this.results;
    return keysAndValues.filter((_entry, index) => index % 2 !== 0)
  }

  get entities(): TEntity[] {
    const ids = this.ids;
    const values = this.values;

    return values.map((array, index) => this.arrayToEntity(ids[index], array));
  }

  protected abstract arrayToEntity(id: string, array: Array<string>): TEntity;
}

export class HashSearchResultsConverter<TEntity extends Entity> extends SearchResultsConverter<TEntity> {
  protected arrayToEntity(id: string, array: Array<string | Buffer>): TEntity {
    const keys = array.filter((_entry, index) => index % 2 === 0);
    const values = array.filter((_entry, index) => index % 2 !== 0);

    const hashData: RedisHashData = keys.reduce((object: any, key, index) => {
      object[key.toString()] = values[index]
      return object
    }, {});

    const entity = new this.schema.entityCtor(this.schema, id);
    entity.fromRedisHash(hashData);
    return entity;
  }
}

export class JsonSearchResultsConverter<TEntity extends Entity> extends SearchResultsConverter<TEntity> {
  protected arrayToEntity(id: string, array: Array<string | Buffer>): TEntity {
    const items = array.map(item => item.toString())
    const index = items.findIndex(value => value === '$') + 1;
    const jsonString = items[index];
    const jsonData: RedisJsonData = JSON.parse(jsonString);
    const entity = new this.schema.entityCtor(this.schema, id);
    entity.fromRedisJson(jsonData);
    return entity;
  }
}
