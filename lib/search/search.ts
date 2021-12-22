import Schema from "../schema/schema";
import Client, { SearchOptions } from "../client";
import Entity from '../entity/entity';

import Where from './where';
import WhereAnd from './where-and';
import WhereOr from './where-or';
import WhereField from './where-field';
import WhereArray from './where-array';
import { WhereHashBoolean, WhereJsonBoolean } from './where-boolean';
import WhereNumber from './where-number';
import WhereString from './where-string';
import WhereText from './where-text';

import { HashSearchResultsConverter, JsonSearchResultsConverter } from "./results-converter";
import { RedisError } from "..";

/**
 * A function that takes a {@link Search} and returns a {@link Search}. Used in nested queries.
 * @template TEntity The type of {@link Entity} being sought.
 */
export type SubSearchFunction<TEntity extends Entity> = (search: Search<TEntity>) => Search<TEntity>

type AndOrConstructor = new (left: Where, right: Where) => Where;

/**
 * Entry point to fluent search. Requires the RediSearch or RedisJSON is installed.
 * @template TEntity The type of {@link Entity} being sought.
 */
export default class Search<TEntity extends Entity> {
  private schema: Schema<TEntity>;
  private client: Client;

  private rootWhere?: Where;

  /** @internal */
  constructor(schema: Schema<TEntity>, client: Client) {
    this.schema = schema;
    this.client = client;
  }

  /** @internal */
  get query() : string {
    if (this.rootWhere === undefined) return '*';
    return `${this.rootWhere.toString()}`;
  }

  /**
   * Returns the number of {@link Entity | Entities} that match this query.
   * @returns 
   */
  async count(): Promise<number> {
    let searchResults = await this.callSearch()
    return this.schema.dataStructure === 'JSON'
      ? new JsonSearchResultsConverter(this.schema, searchResults).count
      : new HashSearchResultsConverter(this.schema, searchResults).count;
  }

  /**
   * Returns a page of {@link Entity | Entities} that match this query.
   * @param offset The offset for where to start returning {@link Entity | Entities}.
   * @param pageSize The number of {@link Entity | Entities} to return.
   * @returns An array of {@link Entity | Entities} matching the query.
   */
  async return(offset: number, count: number): Promise<TEntity[]> {
    let searchResults = await this.callSearch(offset, count)
    return this.schema.dataStructure === 'JSON'
      ? new JsonSearchResultsConverter(this.schema, searchResults).entities
      : new HashSearchResultsConverter(this.schema, searchResults).entities;
  }

  /**
   * Returns all the {@link Entity | Entities} that match this query. This method
   * makes multiple calls to Redis until all the {@link Entity | Entities} are returned.
   * You can specify the batch size by setting the `pageSize` property on the
   * options:
   * 
   * ```typescript
   * let entities = await repository.search().returnAll({ pageSize: 100 });
   * ```
   * 
   * @param options Options for the call.
   * @param options.pageSize Number of {@link Entity | Entities} returned per batch.
   * @returns An array of {@link Entity | Entities} matching the query.
   */
  async returnAll(options = { pageSize: 10 }): Promise<TEntity[]> {
    let entities: TEntity[] = [];
    let offset = 0;
    let pageSize = options.pageSize;

    while (true) {
      let foundEntities = await this.return(offset, pageSize);
      entities.push(...foundEntities);
      if (foundEntities.length < pageSize) break;
      offset += pageSize;
    }

    return entities;
  }

  /**
   * Alias for {@link Search.returnAll}.
   */
  async all(options = { pageSize: 10 }): Promise<TEntity[]> {
    return await this.returnAll(options)
  }

  /**
   * Sets up a query matching a particular field. If there are multiple calls
   * to {@link Search.where}, they are treated logically as AND.
   * @param field The field to filter on.
   * @returns A subclass of {@link WhereField} matching the type of the field.
   */
  where(field: string): WhereField<TEntity>;

  /**
   * Sets up a nested search. If there are multiple calls to {@link Search.where},
   * they are treated logically as AND.
   * @param subSearchFn A function that takes a {@link Search} and returns another {@link Search}.
   * @returns `this`.
   */
  where(subSearchFn: SubSearchFunction<TEntity>): Search<TEntity>;
  where(fieldOrFn: string | SubSearchFunction<TEntity>): WhereField<TEntity> | Search<TEntity> {
    return this.anyWhere(WhereAnd, fieldOrFn);
  }

  /**
   * Sets up a query matching a particular field as a logical AND.
   * @param field The field to filter on.
   * @returns A subclass of {@link WhereField} matching the type of the field.
   */
  and(field: string): WhereField<TEntity>;

  /**
   * Sets up a nested search as a logical AND.
   * @param subSearchFn A function that takes a {@link Search} and returns another {@link Search}.
   * @returns `this`.
   */
  and(subSearchFn: SubSearchFunction<TEntity>): Search<TEntity>;
  and(fieldOrFn: string | SubSearchFunction<TEntity>): WhereField<TEntity> | Search<TEntity> {
    return this.anyWhere(WhereAnd, fieldOrFn);
  }

  /**
   * Sets up a query matching a particular field as a logical OR.
   * @param field The field to filter on.
   * @returns A subclass of {@link WhereField} matching the type of the field.
   */
  or(field: string): WhereField<TEntity>;

  /**
   * Sets up a nested search as a logical OR.
   * @param subSearchFn A function that takes a {@link Search} and returns another {@link Search}.
   * @returns `this`.
   */
  or(subSearchFn: SubSearchFunction<TEntity>): Search<TEntity>;
  or(fieldOrFn: string | SubSearchFunction<TEntity>): WhereField<TEntity> | Search<TEntity> {
    return this.anyWhere(WhereOr, fieldOrFn);
  }

  private async callSearch(offset = 0, count = 0) {
    let options: SearchOptions = { 
      indexName: this.schema.indexName,
      query: this.query,
      offset,
      count
    };

    let searchResults
    try {
      searchResults = await this.client.search(options);
    } catch (error) {
      let message = (error as Error).message
      if (message.startsWith("Syntax error")) {
        throw new RedisError(`The query to RediSearch had a syntax error: "${message}".\nThis is often the result of using a stop word in the query. Either change the query to not use a stop word or change the stop words in the schema definition. You can check the RediSearch source for the default stop words at: https://github.com/RediSearch/RediSearch/blob/master/src/stopwords.h.`)
      }
      throw error
    }
    return searchResults
  }

  private anyWhere(ctor: AndOrConstructor, fieldOrFn: string | SubSearchFunction<TEntity>): WhereField<TEntity> | Search<TEntity> {
    if (typeof fieldOrFn === 'string') {
      return this.anyWhereForField(ctor, fieldOrFn);
    } else {
      return this.anyWhereForFunction(ctor, fieldOrFn);
    }
  }

  private anyWhereForField(ctor: AndOrConstructor, field: string): WhereField<TEntity> {
    let where = this.createWhere(field);

    if (this.rootWhere === undefined) {
      this.rootWhere = where;
    } else {
      this.rootWhere = new ctor(this.rootWhere, where);
    }

    return where;
  }

  private anyWhereForFunction(ctor: AndOrConstructor, subSearchFn: SubSearchFunction<TEntity>): Search<TEntity> {
    let search = new Search<TEntity>(this.schema, this.client);
    let subSearch = subSearchFn(search);

    if (subSearch.rootWhere === undefined) {
      throw new Error("Sub-search without and root where was somehow defined.");
    } else {
      if (this.rootWhere === undefined) {
        this.rootWhere = subSearch.rootWhere;
      } else {
        this.rootWhere = new ctor(this.rootWhere, subSearch.rootWhere);
      }
    }

    return this;
  }

  private createWhere(field: string): WhereField<TEntity> {
    let fieldDef = this.schema.definition[field];

    if (fieldDef === undefined) throw new Error(`The field '${field}' is not part of the schema.`);

    if (fieldDef.type === 'array')
      return new WhereArray<TEntity>(this, field);

    if (fieldDef.type === 'boolean' && this.schema.dataStructure === 'HASH')
      return new WhereHashBoolean<TEntity>(this, field);

    if (fieldDef.type === 'boolean' && this.schema.dataStructure === 'JSON')
      return new WhereJsonBoolean<TEntity>(this, field);

    if (fieldDef.type === 'number')
      return new WhereNumber<TEntity>(this, field);

    if (fieldDef.type === 'string' && fieldDef.textSearch === true)
      return new WhereText<TEntity>(this, field);

    if (fieldDef.type === 'string' && fieldDef.textSearch !== true)
      return new WhereString<TEntity>(this, field);

    // @ts-ignore: This is a trap for JavaScript
    throw new Error(`The field type of '${fieldDef.type}' is not a valid field type. Valid types include 'array', 'boolean', 'number', and 'string'.`);
  }
}
