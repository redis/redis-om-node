import { RedisHashData, RedisJsonData } from "../client";
import { Entity } from "../entity";
import { Schema } from "../schema";
import { fromRedisHash, fromRedisJson } from "../transformer";

export abstract class SearchResultsConverter {

  private results: any[];
  protected schema: Schema;

  constructor(schema: Schema, results: any[]) {
    this.schema = schema;
    this.results = results;
  }

  get count(): number {
    const [count] = this.results;
    return Number.parseInt(count);
  }

  get ids(): Array<string> {
    return this.keys.map(key => (key as string).replace(/^.*:/, ""));
  }

  get keys(): Array<string> {
    const [_count, ...keysAndValues] = this.results;
    return keysAndValues.filter((_entry, index) => index % 2 === 0);
  }

  get values(): any[] {
    const [_count, ...keysAndValues] = this.results;
    return keysAndValues.filter((_entry, index) => index % 2 !== 0)
  }

  get entities(): Entity[] {
    const ids = this.ids;
    const values = this.values;

    return values.map((array, index) => this.arrayToEntity(ids[index], array));
  }

  protected makeKey(id: string): string {
    return `${this.schema.prefix}:${id}`;
  }

  protected abstract arrayToEntity(entityId: string, array: Array<string>): Entity;
}

export class HashSearchResultsConverter extends SearchResultsConverter {
  protected arrayToEntity(entityId: string, array: Array<string>): Entity {
    const keys = array.filter((_entry, index) => index % 2 === 0);
    const values = array.filter((_entry, index) => index % 2 !== 0);

    const hashData: RedisHashData = keys.reduce((object: any, key, index) => {
      object[key] = values[index]
      return object
    }, {});

    const keyName = this.makeKey(entityId);
    const entityData = fromRedisHash(this.schema, hashData)
    const entity = { ...entityData, entityId, keyName}
    return entity;
  }
}

export class JsonSearchResultsConverter extends SearchResultsConverter {
  protected arrayToEntity(entityId: string, array: Array<string>): Entity {
    const index = array.findIndex(value => value === '$') + 1;
    const jsonString = array[index];

    const jsonData: RedisJsonData = JSON.parse(jsonString);

    const keyName = this.makeKey(entityId);
    const entityData = fromRedisJson(this.schema, jsonData);
    const entity = { ...entityData, entityId, keyName}
    return entity;
  }
}
