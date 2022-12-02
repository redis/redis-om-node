import { createHash } from 'crypto';
import { ulid } from 'ulid'

import { Entity } from "../entity/entity";

import { IdStrategy, DataStructure, StopWordOptions, SchemaOptions } from './options';

import { SchemaDefinition, FieldDefinition } from './definition';
import { Field } from './field';

/**
 * Defines a schema that determines how an {@link Entity} is mapped to Redis
 * data structures. Construct by passing in an {@link EntityConstructor},
 * a {@link SchemaDefinition}, and optionally {@link SchemaOptions}:
 *
 * ```typescript
 * const schema = new Schema(Foo, {
 *   aString: { type: 'string' },
 *   aNumber: { type: 'number' },
 *   aBoolean: { type: 'boolean' },
 *   someText: { type: 'text' },
 *   aPoint: { type: 'point' },
 *   aDate: { type: 'date' },
 *   someStrings: { type: 'string[]' }
 * }, {
 *   dataStructure: 'HASH'
 * });
 * ```
 *
 * A Schema is primarily used by a {@link Repository} which requires a Schema in
 * its constructor.
 */
export class Schema {

  private _prefix: string
  private _fieldsByName: Record<string, Field> = {}
  private _definition: SchemaDefinition;
  private _options?: SchemaOptions;

  /**
   * @param prefix The string that comes before the ID when creating Redis keys.
   * @param schemaDef Defines all of the fields for the Schema and how they are mapped to Redis.
   * @param options Additional options for this Schema.
   */
  constructor(prefix: string, schemaDef: SchemaDefinition, options?: SchemaOptions) {

    this._prefix = prefix
    this._definition = schemaDef
    this._options = options

    this.validateOptions()
    this.createFields()
  }

  /**
   * The string that comes before the ID when creating Redis keys. Combined
   * with the results of idStrategy to generate a key. If prefix is `Foo` and
   * idStrategy returns `12345` then the generated key would be `Foo:12345`.
   */
  get prefix(): string {
    return this._prefix
  }

  /** The {@link Field | Fields} defined by this Schema. */
  get fields(): Field[] {
    return Object.entries(this._fieldsByName).map(([_name, field]) => field)
  }

  /**
   * Get a single {@link Field} defined by this Schema.
   * @returns The {@link Field}, or null of not found.
   */
  fieldByName(name: string): Field {
    return this._fieldsByName[name] ?? null
  }

  /** The configured name for the RediSearch index for this Schema. */
  get indexName(): string { return this._options?.indexName ?? `${this.prefix}:index`; }

  /** The configured name for the RediSearch index hash for this Schema. */
  get indexHashName(): string { return this._options?.indexHashName ?? `${this.prefix}:index:hash`; }

  /**
   * The configured data structure, a string with the value of either `HASH` or `JSON`,
   * that this Schema uses to store {@link Entity | Entities} in Redis.
   * */
  get dataStructure(): DataStructure { return this._options?.dataStructure ?? 'JSON'; }

  /**
   * The configured usage of stop words, a string with the value of either `OFF`, `DEFAULT`,
   * or `CUSTOM`. See {@link SchemaOptions.useStopWords} and {@link SchemaOptions.stopWords}
   * for more details.
   */
  get useStopWords(): StopWordOptions { return this._options?.useStopWords ?? 'DEFAULT'; }

  /**
   * The configured stop words. Ignored if {@link Schema.useStopWords} is anything other
   * than `CUSTOM`.
   */
  get stopWords(): Array<string> { return this._options?.stopWords ?? []; }

  /**
   * Generates a unique string using the configured {@link IdStrategy}.
   * @returns
   */
  generateId(): string {
    const ulidStrategy: IdStrategy = () => ulid();
    return (this._options?.idStrategy ?? ulidStrategy)();
  }

  /** @internal */
  get indexHash(): string {

    const data = JSON.stringify({
      definition: this._definition,
      prefix: this.prefix,
      indexName: this.indexName,
      indexHashName: this.indexHashName,
      dataStructure: this.dataStructure,
      useStopWords: this.useStopWords,
      stopWords: this.stopWords
    })

    return createHash('sha1').update(data).digest('base64');
  }

  private createFields() {
    return Object.entries(this._definition).forEach(([fieldName, fieldDef]) => {
      const field = new Field(fieldName, fieldDef)
      this.validateField(field)
      this._fieldsByName[fieldName] = new Field(fieldName, fieldDef)
    })
  }

  private validateOptions() {
    if (!['HASH', 'JSON'].includes(this.dataStructure))
      throw Error(`'${this.dataStructure}' in an invalid data structure. Valid data structures are 'HASH' and 'JSON'.`);

    if (!['OFF', 'DEFAULT', 'CUSTOM'].includes(this.useStopWords))
      throw Error(`'${this.useStopWords}' in an invalid value for stop words. Valid values are 'OFF', 'DEFAULT', and 'CUSTOM'.`);

    if (this._options?.idStrategy && !(this._options.idStrategy instanceof Function))
      throw Error("ID strategy must be a function that takes no arguments and returns a string.");

    if (this.prefix === '') throw Error(`Prefix must be a non-empty string.`);
    if (this.indexName === '') throw Error(`Index name must be a non-empty string.`);
  }

  private validateField(field: Field) {
    if (!['boolean', 'date', 'number', 'point', 'string', 'string[]', 'text'].includes(field.type))
      throw Error(`The field '${field.name}' is configured with a type of '${field.type}'. Valid types include 'boolean', 'date', 'number', 'point', 'string', 'string[]', and 'text'.`);
  }
}
