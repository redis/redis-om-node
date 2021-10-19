import { HashData, JsonData } from "../client";
import Entity from "../entity/entity";
import { EntityData } from "../entity/entity-types";
import HashConverter from "../repository/hash-converter";
import JsonConverter from "../repository/json-converter";
import Schema from "../schema/schema";

export abstract class SearchResultsConverter<TEntity extends Entity> {

  private results: any[];
  protected schema: Schema<TEntity>;

  constructor(schema: Schema<TEntity>, results: any[]) {
    this.schema = schema;
    this.results = results;
  }

  get count(): number {
    let [count] = this.results;
    return Number.parseInt(count);
  }

  get ids(): string[] {
    return this.keys.map(key => (key as string).replace(/^.*:/, ""));
  }
  
  get keys(): string[] {
    let [_count, ...keysAndValues] = this.results;
    return keysAndValues.filter((_entry, index) => index % 2 === 0);
  }
  
  get values(): any[] {
    let [_count, ...keysAndValues] = this.results;
    return keysAndValues.filter((_entry, index) => index % 2 !== 0)
  }
  
  get entities(): TEntity[] {
    let ids = this.ids;
    let values = this.values;

    return values.map((array, index) => this.arrayToEntity(ids[index], array));
  }

  protected abstract arrayToEntity(id: string, array: string[]): TEntity;
}

export class HashSearchResultsConverter<TEntity extends Entity> extends SearchResultsConverter<TEntity> {
  protected arrayToEntity(id: string, array: string[]): TEntity {
    let keys = array.filter((_entry, index) => index % 2 === 0);
    let values = array.filter((_entry, index) => index % 2 !== 0);
    
    let hashData: HashData = keys.reduce((object: any, key, index) => {
      object[key] = values[index]
      return object
    }, {});

    let converter = new HashConverter(this.schema.definition);
    let entityData: EntityData = converter.toEntityData(hashData);
    return new this.schema.entityCtor(id, entityData);
  }
}

export class JsonSearchResultsConverter<TEntity extends Entity> extends SearchResultsConverter<TEntity> {
  protected arrayToEntity(id: string, array: string[]): TEntity {
    let jsonString = array[1];
    let jsonData: JsonData = JSON.parse(jsonString);
    let converter = new JsonConverter(this.schema.definition);
    let entityData: EntityData = converter.toEntityData(jsonData);
    return new this.schema.entityCtor(id, entityData);
  }
}
