import { createHash } from 'crypto'
import { ulid } from 'ulid'

import { Entity } from "../entity"

import { IdStrategy, DataStructure, StopWordOptions, SchemaOptions } from './options'

import { SchemaDefinition } from './definitions'
import { Field } from './field'
import { InvalidSchema } from '../error'


/**
 * Defines a schema that determines how an {@link Entity} is mapped
 * to Redis data structures. Construct by passing in a schema name,
 * a {@link SchemaDefinition}, and optionally {@link SchemaOptions}:
 *
 * ```typescript
 * const schema = new Schema('foo', {
 *   aString: { type: 'string' },
 *   aNumber: { type: 'number' },
 *   aBoolean: { type: 'boolean' },
 *   someText: { type: 'text' },
 *   aPoint: { type: 'point' },
 *   aDate: { type: 'date' },
 *   someStrings: { type: 'string[]' }
 * }, {
 *   dataStructure: 'HASH'
 * })
 * ```
 *
 * A Schema is primarily used by a {@link Repository} which requires a Schema in
 * its constructor.
 */
export class Schema {

  #schemaName: string
  #fieldsByName: Record<string, Field> = {}
  #definition: SchemaDefinition
  #options?: SchemaOptions

  /**
   * Constructs a Schema.
   *
   * @param schemaName The name of the schema. Prefixes the ID when creating Redis keys.
   * @param schemaDef Defines all of the fields for the Schema and how they are mapped to Redis.
   * @param options Additional options for this Schema.
   */
  constructor(schemaName: string, schemaDef: SchemaDefinition, options?: SchemaOptions) {
    this.#schemaName = schemaName
    this.#definition = schemaDef
    this.#options = options

    this.#validateOptions()
    this.#createFields()
  }

  /**
   * The name of the schema. Prefixes the ID when creating Redis keys. Combined
   * with the results of idStrategy to generate a key. If name is `foo` and
   * idStrategy returns `12345` then the generated key would be `foo:12345`.
   */
  get schemaName(): string {
    return this.#schemaName
  }

  /** The {@link Field | Fields} defined by this Schema. */
  get fields(): Field[] {
    return Object.entries(this.#fieldsByName).map(([_name, field]) => field)
  }

  /**
   * Gets a single {@link Field} defined by this Schema.
   *
   * @param name The name of the {@link Field} in this Schema.
   * @returns The {@link Field}, or null of not found.
   */
  fieldByName(name: string): Field | null {
    return this.#fieldsByName[name] ?? null
  }

  /** The configured name for the RediSearch index for this Schema. */
  get indexName(): string { return this.#options?.indexName ?? `${this.schemaName}:index` }

  /** The configured name for the RediSearch index hash for this Schema. */
  get indexHashName(): string { return this.#options?.indexHashName ?? `${this.schemaName}:index:hash` }

  /**
   * The configured data structure, a string with the value of either `HASH` or `JSON`,
   * that this Schema uses to store {@link Entity | Entities} in Redis.
   */
  get dataStructure(): DataStructure { return this.#options?.dataStructure ?? 'JSON' }

  /**
   * The configured usage of stop words, a string with the value of either `OFF`, `DEFAULT`,
   * or `CUSTOM`. See {@link SchemaOptions} for more details.
   */
  get useStopWords(): StopWordOptions { return this.#options?.useStopWords ?? 'DEFAULT' }

  /**
   * The configured stop words. Ignored if {@link Schema.useStopWords} is anything other
   * than `CUSTOM`.
   */
  get stopWords(): Array<string> { return this.#options?.stopWords ?? [] }

  /**
   * Generates a unique string using the configured {@link IdStrategy}.
   *
   * @returns The generated id.
   */
  async generateId(): Promise<string> {
    const ulidStrategy = () => ulid()
    return await (this.#options?.idStrategy ?? ulidStrategy)()
  }

  /**
   * A hash for this Schema that is used to determine if the Schema has been
   * changed when calling {@link Repository#createIndex}.
   */
  get indexHash(): string {

    const data = JSON.stringify({
      definition: this.#definition,
      prefix: this.schemaName,
      indexName: this.indexName,
      indexHashName: this.indexHashName,
      dataStructure: this.dataStructure,
      useStopWords: this.useStopWords,
      stopWords: this.stopWords
    })

    return createHash('sha1').update(data).digest('base64')
  }

  #createFields() {
    return Object.entries(this.#definition).forEach(([fieldName, fieldDef]) => {
      const field = new Field(fieldName, fieldDef)
      this.#validateField(field)
      this.#fieldsByName[fieldName] = field
    })
  }

  #validateOptions() {
    const { dataStructure, useStopWords } = this

    if (dataStructure !== 'HASH' && dataStructure !== 'JSON')
      throw new InvalidSchema(`'${dataStructure}' in an invalid data structure. Valid data structures are 'HASH' and 'JSON'.`)

    if (useStopWords !== 'OFF' && useStopWords !== 'DEFAULT' && useStopWords !== 'CUSTOM')
      throw new InvalidSchema(`'${useStopWords}' in an invalid value for stop words. Valid values are 'OFF', 'DEFAULT', and 'CUSTOM'.`)

    if (this.#options?.idStrategy && typeof this.#options.idStrategy !== 'function')
      throw new InvalidSchema("ID strategy must be a function that takes no arguments and returns a string.")

    if (this.schemaName === '') throw new InvalidSchema(`Schema name must be a non-empty string.`)
    if (this.indexName === '') throw new InvalidSchema(`Index name must be a non-empty string.`)
  }

  #validateField(field: Field) {
    const { type } = field
    if (type !== 'boolean' && type !== 'date' && type !== 'number' && type !== 'point' &&
        type !== 'string' && type !== 'string[]' && type !== 'text')
      throw new InvalidSchema(`The field '${field.name}' is configured with a type of '${field.type}'. Valid types include 'boolean', 'date', 'number', 'point', 'string', 'string[]', and 'text'.`)
  }
}
