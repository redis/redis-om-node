import { HashData, JsonData } from "../client";
import Entity from "../entity/entity";
import EntityData from '../entity/entity-data';
import { JsonConverter, HashConverter } from "../repository/converter";
import Schema from "../schema/schema";

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

  get ids(): string[] {
    return this.keys.map(key => (key as string).replace(/^.*:/, ""));
  }

  get keys(): string[] {
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

  protected abstract arrayToEntity(id: string, array: string[]): TEntity;
}

export class HashSearchResultsConverter<TEntity extends Entity> extends SearchResultsConverter<TEntity> {
  protected arrayToEntity(id: string, array: string[]): TEntity {
    const keys = array.filter((_entry, index) => index % 2 === 0);
    const values = array.filter((_entry, index) => index % 2 !== 0);

    const hashData: HashData = keys.reduce((object: any, key, index) => {
      object[key] = values[index]
      return object
    }, {});

    const converter = new HashConverter(this.schema.definition);
    const entityData: EntityData = converter.toEntityData(hashData);
    return new this.schema.entityCtor(this.schema, id, entityData);
  }
}

export class JsonSearchResultsConverter<TEntity extends Entity> extends SearchResultsConverter<TEntity> {
  protected arrayToEntity(id: string, array: string[]): TEntity {
    const index = array.findIndex(value => value === '$') + 1;
    const jsonString = array[index];
    const jsonData: JsonData = JSON.parse(jsonString);
    const converter = new JsonConverter(this.schema.definition);
    const entityData: EntityData = converter.toEntityData(jsonData);
    return new this.schema.entityCtor(this.schema, id, entityData);
  }
}
