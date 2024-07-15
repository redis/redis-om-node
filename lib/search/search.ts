import { SearchOptions } from "redis"

import { Client, SearchResults } from "../client"
import { Entity, EntityKeys } from "../entity"
import { Schema } from "../schema"

import { Where } from "./where"
import { WhereAnd } from "./where-and"
import { WhereOr } from "./where-or"
import { WhereField } from "./where-field"
import { WhereStringArray } from "./where-string-array"
import { WhereHashBoolean, WhereJsonBoolean } from "./where-boolean"
import { WhereNumber } from "./where-number"
import { WherePoint } from "./where-point"
import { WhereString } from "./where-string"
import { WhereText } from "./where-text"

import {
  extractCountFromSearchResults,
  extractEntitiesFromSearchResults,
  extractEntityIdsFromSearchResults,
  extractKeyNamesFromSearchResults,
} from "./results-converter"
import { FieldNotInSchema, RedisOmError, SearchError } from "../error"
import { WhereDate } from "./where-date"

/**
 * A function that takes a {@link Search} and returns a {@link Search}. Used in nested queries.
 * @template TEntity The type of {@link Entity} being sought.
 */
export type SubSearchFunction<T extends Entity> = (
  search: Search<T>,
) => Search<T>

type AndOrConstructor = new (left: Where, right: Where) => Where

// This is a simplified redefintion of the SortByProperty type that is not exported by Node Redis
type SortOptions = { BY: string; DIRECTION: "ASC" | "DESC" }

/**
 * Abstract base class for {@link Search} and {@link RawSearch} that
 * contains methods to return search results.
 * @template TEntity The type of {@link Entity} being sought.
 */
export abstract class AbstractSearch<T extends Entity = Record<string, any>> {
  /** @internal */
  protected schema: Schema<T>

  /** @internal */
  protected client: Client

  /** @internal */
  protected sortOptions?: SortOptions

  /** @internal */
  constructor(schema: Schema<T>, client: Client) {
    this.schema = schema
    this.client = client
  }

  /** @internal */
  abstract get query(): string

  /**
   * Applies an ascending sort to the query.
   * @param field The field to sort by.
   * @returns this
   */
  sortAscending(field: EntityKeys<T>): AbstractSearch<T> {
    return this.sortBy(field, "ASC")
  }

  /**
   * Alias for {@link Search.sortDescending}.
   */
  sortDesc(field: EntityKeys<T>): AbstractSearch<T> {
    return this.sortDescending(field)
  }

  /**
   * Applies a descending sort to the query.
   * @param field The field to sort by.
   * @returns this
   */
  sortDescending(field: EntityKeys<T>): AbstractSearch<T> {
    return this.sortBy(field, "DESC")
  }

  /**
   * Alias for {@link Search.sortAscending}.
   */
  sortAsc(field: EntityKeys<T>): AbstractSearch<T> {
    return this.sortAscending(field)
  }

  /**
   * Applies sorting for the query.
   * @param fieldName The field to sort by.
   * @param order The order of returned {@link Entity | Entities} Defaults to `ASC` (ascending) if not specified
   * @returns this
   */
  sortBy(
    fieldName: EntityKeys<T>,
    order: "ASC" | "DESC" = "ASC",
  ): AbstractSearch<T> {
    const field = this.schema.fieldByName(fieldName)
    const dataStructure = this.schema.dataStructure

    if (!field) {
      const message = `'sortBy' was called on field '${String(fieldName)}' which is not defined in the Schema.`
      console.error(message)
      throw new RedisOmError(message)
    }

    const type = field.type
    const markedSortable = field.sortable

    const UNSORTABLE = ["point", "string[]"]
    const JSON_SORTABLE = ["number", "text", "date"]
    const HASH_SORTABLE = ["string", "boolean", "number", "text", "date"]

    if (UNSORTABLE.includes(type)) {
      const message = `'sortBy' was called on '${field.type}' field '${field.name}' which cannot be sorted.`
      console.error(message)
      throw new RedisOmError(message)
    }

    if (
      dataStructure === "JSON" &&
      JSON_SORTABLE.includes(type) &&
      !markedSortable
    )
      console.warn(
        `'sortBy' was called on field '${field.name}' which is not marked as sortable in the Schema. This may result is slower searches. If possible, mark the field as sortable in the Schema.`,
      )

    if (
      dataStructure === "HASH" &&
      HASH_SORTABLE.includes(type) &&
      !markedSortable
    )
      console.warn(
        `'sortBy' was called on field '${field.name}' which is not marked as sortable in the Schema. This may result is slower searches. If possible, mark the field as sortable in the Schema.`,
      )

    this.sortOptions = { BY: field.name, DIRECTION: order }

    return this
  }

  /**
   * Finds the {@link Entity} with the minimal value for a field.
   * @param field The field with the minimal value.
   * @returns The {@link Entity} with the minimal value
   */
  async min(field: EntityKeys<T>): Promise<T | null> {
    return await this.sortBy(field, "ASC").first()
  }

  /**
   * Finds the entity ID with the minimal value for a field.
   * @param field The field with the minimal value.
   * @returns The entity ID with the minimal value
   */
  async minId(field: EntityKeys<T>): Promise<string | null> {
    return await this.sortBy(field, "ASC").firstId()
  }

  /**
   * Finds the key name in Redis with the minimal value for a field.
   * @param field The field with the minimal value.
   * @returns The key name with the minimal value
   */
  async minKey(field: EntityKeys<T>): Promise<string | null> {
    return await this.sortBy(field, "ASC").firstKey()
  }

  /**
   * Finds the {@link Entity} with the maximal value for a field.
   * @param field The field with the maximal value.
   * @returns The entity ID {@link Entity} with the maximal value
   */
  async max(field: EntityKeys<T>): Promise<T | null> {
    return await this.sortBy(field, "DESC").first()
  }

  /**
   * Finds the entity ID with the maximal value for a field.
   * @param field The field with the maximal value.
   * @returns The entity ID with the maximal value
   */
  async maxId(field: EntityKeys<T>): Promise<string | null> {
    return await this.sortBy(field, "DESC").firstId()
  }

  /**
   * Finds the key name in Redis with the maximal value for a field.
   * @param field The field with the maximal value.
   * @returns The key name with the maximal value
   */
  async maxKey(field: EntityKeys<T>): Promise<string | null> {
    return await this.sortBy(field, "DESC").firstKey()
  }

  /**
   * Returns the number of {@link Entity | Entities} that match this query.
   * @returns
   */
  async count(): Promise<number> {
    const searchResults = await this.callSearch()
    return extractCountFromSearchResults(searchResults)
  }

  /**
   * Returns a page of {@link Entity | Entities} that match this query.
   * @param offset The offset for where to start returning {@link Entity | Entities}.
   * @param count The number of {@link Entity | Entities} to return.
   * @returns An array of {@link Entity | Entities} matching the query.
   */
  async page(offset: number, count: number): Promise<T[]> {
    const searchResults = await this.callSearch(offset, count)
    return extractEntitiesFromSearchResults(this.schema, searchResults)
  }

  /**
   * Returns a page of entity IDs that match this query.
   * @param offset The offset for where to start returning entity IDs.
   * @param count The number of entity IDs to return.
   * @returns An array of strings matching the query.
   */
  async pageOfIds(offset: number, count: number): Promise<string[]> {
    const searchResults = await this.callSearch(offset, count, true)
    return extractEntityIdsFromSearchResults(this.schema, searchResults)
  }

  /**
   * Returns a page of key names in Redis that match this query.
   * @param offset The offset for where to start returning key names.
   * @param count The number of key names to return.
   * @returns An array of strings matching the query.
   */
  async pageOfKeys(offset: number, count: number): Promise<string[]> {
    const searchResults = await this.callSearch(offset, count, true)
    return extractKeyNamesFromSearchResults(searchResults)
  }

  /**
   * Returns the first {@link Entity} that matches this query.
   */
  async first(): Promise<T | null> {
    const foundEntity = await this.page(0, 1)
    return foundEntity[0] ?? null
  }

  /**
   * Returns the first entity ID that matches this query.
   */
  async firstId(): Promise<string | null> {
    const foundIds = await this.pageOfIds(0, 1)
    return foundIds[0] ?? null
  }

  /**
   * Returns the first key name that matches this query.
   */
  async firstKey(): Promise<string | null> {
    const foundKeys = await this.pageOfKeys(0, 1)
    return foundKeys[0] ?? null
  }

  /**
   * Returns all the {@link Entity | Entities} that match this query. This method
   * makes multiple calls to Redis until all the {@link Entity | Entities} are returned.
   * You can specify the batch size by setting the `pageSize` property on the
   * options:
   *
   * ```typescript
   * const entities = await repository.search().returnAll({ pageSize: 100 })
   * ```
   *
   * @param options Options for the call.
   * @param options.pageSize Number of {@link Entity | Entities} returned per batch.
   * @returns An array of {@link Entity | Entities} matching the query.
   */
  async all(options = { pageSize: 10 }): Promise<T[]> {
    return this.allThings(this.page, options) as Promise<T[]>
  }

  /**
   * Returns all the entity IDs that match this query. This method
   * makes multiple calls to Redis until all the entity IDs are returned.
   * You can specify the batch size by setting the `pageSize` property on the
   * options:
   *
   * ```typescript
   * const keys = await repository.search().returnAllIds({ pageSize: 100 })
   * ```
   *
   * @param options Options for the call.
   * @param options.pageSize Number of entity IDs returned per batch.
   * @returns An array of entity IDs matching the query.
   */
  async allIds(options = { pageSize: 10 }): Promise<string[]> {
    return this.allThings(this.pageOfIds, options) as Promise<string[]>
  }

  /**
   * Returns all the key names in Redis that match this query. This method
   * makes multiple calls to Redis until all the key names are returned.
   * You can specify the batch size by setting the `pageSize` property on the
   * options:
   *
   * ```typescript
   * const keys = await repository.search().returnAllKeys({ pageSize: 100 })
   * ```
   *
   * @param options Options for the call.
   * @param options.pageSize Number of key names returned per batch.
   * @returns An array of key names matching the query.
   */
  async allKeys(options = { pageSize: 10 }): Promise<string[]> {
    return this.allThings(this.pageOfKeys, options)
  }

  /**
   * Returns the current instance. Syntactic sugar to make your code more fluent.
   * @returns this
   */
  get return(): AbstractSearch<T> {
    return this
  }

  /**
   * Alias for {@link Search.min}.
   */
  async returnMin(field: EntityKeys<T>): Promise<T | null> {
    return await this.min(field)
  }

  /**
   * Alias for {@link Search.minId}.
   */
  async returnMinId(field: EntityKeys<T>): Promise<string | null> {
    return await this.minId(field)
  }

  /**
   * Alias for {@link Search.minKey}.
   */
  async returnMinKey(field: EntityKeys<T>): Promise<string | null> {
    return await this.minKey(field)
  }

  /**
   * Alias for {@link Search.max}.
   */
  async returnMax(field: EntityKeys<T>): Promise<T | null> {
    return await this.max(field)
  }

  /**
   * Alias for {@link Search.maxId}.
   */
  async returnMaxId(field: EntityKeys<T>): Promise<string | null> {
    return await this.maxId(field)
  }

  /**
   * Alias for {@link Search.maxKey}.
   */
  async returnMaxKey(field: EntityKeys<T>): Promise<string | null> {
    return await this.maxKey(field)
  }

  /**
   * Alias for {@link Search.count}.
   */
  async returnCount(): Promise<number> {
    return await this.count()
  }

  /**
   * Alias for {@link Search.page}.
   */
  async returnPage(offset: number, count: number): Promise<T[]> {
    return await this.page(offset, count)
  }

  /**
   * Alias for {@link Search.pageOfIds}.
   */
  async returnPageOfIds(offset: number, count: number): Promise<string[]> {
    return await this.pageOfIds(offset, count)
  }

  /**
   * Alias for {@link Search.pageOfKeys}.
   */
  async returnPageOfKeys(offset: number, count: number): Promise<string[]> {
    return await this.pageOfKeys(offset, count)
  }

  /**
   * Alias for {@link Search.first}.
   */
  async returnFirst(): Promise<T | null> {
    return await this.first()
  }

  /**
   * Alias for {@link Search.firstId}.
   */
  async returnFirstId(): Promise<string | null> {
    return await this.firstId()
  }

  /**
   * Alias for {@link Search.firstKey}.
   */
  async returnFirstKey(): Promise<string | null> {
    return await this.firstKey()
  }

  /**
   * Alias for {@link Search.all}.
   */
  async returnAll(options = { pageSize: 10 }): Promise<T[]> {
    return await this.all(options)
  }

  /**
   * Alias for {@link Search.allIds}.
   */
  async returnAllIds(options = { pageSize: 10 }): Promise<string[]> {
    return await this.allIds(options)
  }

  /**
   * Alias for {@link Search.allKeys}.
   */
  async returnAllKeys(options = { pageSize: 10 }): Promise<string[]> {
    return await this.allKeys(options)
  }

  private async allThings<R extends T[] | string[]>(
    pageFn: (offset: number, pageSide: number) => Promise<R>,
    options = { pageSize: 10 },
  ): Promise<R> {
    // TypeScript is just being mean in this function. The internal logic will be fine in runtime,
    // However, it is important during future changes to double check your work.
    let things: unknown[] = []
    let offset = 0
    const pageSize = options.pageSize

    while (true) {
      const foundThings = await pageFn.call(this, offset, pageSize)
      things.push(...(foundThings as unknown[]))
      if (foundThings.length < pageSize) break
      offset += pageSize
    }

    return things as R
  }

  private async callSearch(
    offset = 0,
    count = 0,
    keysOnly = false,
  ): Promise<SearchResults> {
    const dataStructure = this.schema.dataStructure
    const indexName = this.schema.indexName
    const query = this.query
    const options: SearchOptions = {
      LIMIT: { from: offset, size: count },
    }

    if (this.sortOptions !== undefined) options.SORTBY = this.sortOptions

    if (keysOnly) {
      options.RETURN = []
    } else if (dataStructure === "JSON") {
      options.RETURN = "$"
    }

    let searchResults
    try {
      searchResults = await this.client.search(indexName, query, options)
    } catch (error) {
      const message = (error as Error).message
      if (message.startsWith("Syntax error")) {
        throw new SearchError(
          `The query to RediSearch had a syntax error: "${message}".\nThis is often the result of using a stop word in the query. Either change the query to not use a stop word or change the stop words in the schema definition. You can check the RediSearch source for the default stop words at: https://github.com/RediSearch/RediSearch/blob/master/src/stopwords.h.`,
        )
      }
      throw error
    }
    return searchResults
  }
}

/**
 * Entry point to raw search which allows using raw RediSearch queries
 * against Redis OM. Requires that RediSearch (and optionally RedisJSON) be
 * installed.
 * @template TEntity The type of {@link Entity} being sought.
 */
export class RawSearch<
  T extends Entity = Record<string, any>,
> extends AbstractSearch<T> {
  private readonly rawQuery: string

  /** @internal */
  constructor(schema: Schema<T>, client: Client, query: string = "*") {
    super(schema, client)
    this.rawQuery = query
  }

  /** @internal */
  get query(): string {
    return this.rawQuery
  }
}

/**
 * Entry point to fluent search. This is the default Redis OM experience.
 * Requires that RediSearch (and optionally RedisJSON) be installed.
 * @template TEntity The type of {@link Entity} being sought.
 */
export class Search<
  T extends Entity = Record<string, any>,
> extends AbstractSearch<T> {
  private rootWhere?: Where

  /** @internal */
  get query(): string {
    if (this.rootWhere === undefined) return "*"
    return `${this.rootWhere.toString()}`
  }

  /**
   * Sets up a query matching a particular field. If there are multiple calls
   * to {@link Search.where}, they are treated logically as AND.
   * @param field The field to filter on.
   * @returns A subclass of {@link WhereField} matching the type of the field.
   */
  where(field: EntityKeys<T>): WhereField<T>

  /**
   * Sets up a nested search. If there are multiple calls to {@link Search.where},
   * they are treated logically as AND.
   * @param subSearchFn A function that takes a {@link Search} and returns another {@link Search}.
   * @returns `this`.
   */
  where(subSearchFn: SubSearchFunction<T>): Search<T>
  where(
    fieldOrFn: EntityKeys<T> | SubSearchFunction<T>,
  ): WhereField<T> | Search<T> {
    return this.anyWhere(WhereAnd, fieldOrFn)
  }

  /**
   * Sets up a query matching a particular field as a logical AND.
   * @param field The field to filter on.
   * @returns A subclass of {@link WhereField} matching the type of the field.
   */
  and(field: EntityKeys<T>): WhereField<T>

  /**
   * Sets up a nested search as a logical AND.
   * @param subSearchFn A function that takes a {@link Search} and returns another {@link Search}.
   * @returns `this`.
   */
  and(subSearchFn: SubSearchFunction<T>): Search<T>
  and(
    fieldOrFn: EntityKeys<T> | SubSearchFunction<T>,
  ): WhereField<T> | Search<T> {
    return this.anyWhere(WhereAnd, fieldOrFn)
  }

  /**
   * Sets up a query matching a particular field as a logical OR.
   * @param field The field to filter on.
   * @returns A subclass of {@link WhereField} matching the type of the field.
   */
  or(field: EntityKeys<T>): WhereField<T>

  /**
   * Sets up a nested search as a logical OR.
   * @param subSearchFn A function that takes a {@link Search} and returns another {@link Search}.
   * @returns `this`.
   */
  or(subSearchFn: SubSearchFunction<T>): Search<T>
  or(
    fieldOrFn: EntityKeys<T> | SubSearchFunction<T>,
  ): WhereField<T> | Search<T> {
    return this.anyWhere(WhereOr, fieldOrFn)
  }

  private anyWhere(
    ctor: AndOrConstructor,
    fieldOrFn: EntityKeys<T> | SubSearchFunction<T>,
  ): WhereField<T> | Search<T> {
    if (typeof fieldOrFn === "function") {
      return this.anyWhereForFunction(ctor, fieldOrFn)
    } else {
      return this.anyWhereForField(ctor, fieldOrFn)
    }
  }

  private anyWhereForField(
    ctor: AndOrConstructor,
    field: EntityKeys<T>,
  ): WhereField<T> {
    const where = this.createWhere(field)

    if (this.rootWhere === undefined) {
      this.rootWhere = where
    } else {
      this.rootWhere = new ctor(this.rootWhere, where)
    }

    return where
  }

  private anyWhereForFunction(
    ctor: AndOrConstructor,
    subSearchFn: SubSearchFunction<T>,
  ): Search<T> {
    const search = new Search(this.schema, this.client)
    const subSearch = subSearchFn(search)

    if (subSearch.rootWhere === undefined) {
      throw new SearchError(
        "Sub-search without a root where was somehow defined.",
      )
    } else {
      if (this.rootWhere === undefined) {
        this.rootWhere = subSearch.rootWhere
      } else {
        this.rootWhere = new ctor(this.rootWhere, subSearch.rootWhere)
      }
    }

    return this
  }

  private createWhere(fieldName: EntityKeys<T>): WhereField<T> {
    const field = this.schema.fieldByName(fieldName)

    if (field === null) throw new FieldNotInSchema(String(fieldName))

    if (field.type === "boolean" && this.schema.dataStructure === "HASH")
      return new WhereHashBoolean(this, field)
    if (field.type === "boolean" && this.schema.dataStructure === "JSON")
      return new WhereJsonBoolean(this, field)
    if (field.type === "date") return new WhereDate(this, field)
    if (field.type === "number") return new WhereNumber(this, field)
    if (field.type === "number[]") return new WhereNumber(this, field)
    if (field.type === "point") return new WherePoint(this, field)
    if (field.type === "text") return new WhereText(this, field)
    if (field.type === "string") return new WhereString(this, field)
    if (field.type === "string[]") return new WhereStringArray(this, field)

    throw new RedisOmError(
      // @ts-ignore: This is a trap for JavaScript
      `The field type of '${fieldDef.type}' is not a valid field type. Valid types include 'boolean', 'date', 'number', 'point', 'string', and 'string[]'.`,
    )
  }
}
