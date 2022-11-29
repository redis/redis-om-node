import { fromRedisHash, fromRedisJson } from "../transformer";
import { RedisHashData, RedisJsonData } from "../client";
import { Schema } from "../schema/schema";

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

  get entities(): object[] {
    const ids = this.ids;
    const values = this.values;

    return values.map((array, index) => this.arrayToEntity(ids[index], array));
  }

  protected abstract arrayToEntity(id: string, array: Array<string>): object;
}

export class HashSearchResultsConverter extends SearchResultsConverter {
  protected arrayToEntity(id: string, array: Array<string>): object {
    const keys = array.filter((_entry, index) => index % 2 === 0);
    const values = array.filter((_entry, index) => index % 2 !== 0);

    const hashData: RedisHashData = keys.reduce((object: any, key, index) => {
      object[key] = values[index]
      return object
    }, {});

    const entity = fromRedisHash(this.schema, hashData)
    return entity;
  }
}

export class JsonSearchResultsConverter extends SearchResultsConverter {
  protected arrayToEntity(id: string, array: Array<string>): object {
    const index = array.findIndex(value => value === '$') + 1;
    const jsonString = array[index];

    const jsonData: RedisJsonData = JSON.parse(jsonString);

    const entity = fromRedisJson(this.schema, jsonData);
    return entity;
  }
}
