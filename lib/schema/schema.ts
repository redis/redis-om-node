import { createHash } from 'crypto';
import { ulid } from 'ulid'

import Entity from "../entity/entity";
import EntityConstructor from "../entity/entity-constructor";

import IdStrategy from './options/id-strategy';
import DataStructure from './options/data-structure';
import StopWordOptions from './options/stop-word-options';
import SchemaOptions from './options/schema-options';

import SchemaDefinition from './definition/schema-definition';
import FieldDefinition from './definition/field-definition';
import JsonSchemaBuilder from './builders/json-schema-builder';
import HashSchemaBuilder from './builders/hash-schema-builder';

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
 *
 * @template TEntity The {@link Entity} this Schema defines.
 */
export default class Schema<TEntity extends Entity> {
  /**
   * The provided {@link EntityConstructor}.
   * @internal
   */
  readonly entityCtor: EntityConstructor<TEntity>;

  /**
   * The provided {@link SchemaDefinition}.
   * @internal
   */
  readonly definition: SchemaDefinition;

  private options?: SchemaOptions;

  /**
   * @template TEntity The {@link Entity} this Schema defines.
   * @param ctor A constructor that creates an {@link Entity} of type TEntity.
   * @param schemaDef Defines all of the fields for the Schema and how they are mapped to Redis.
   * @param options Additional options for this Schema.
   */
  constructor(ctor: EntityConstructor<TEntity>, schemaDef: SchemaDefinition, options?: SchemaOptions) {
    this.entityCtor = ctor;
    this.definition = schemaDef;
    this.options = options;

    this.validateOptions();
    this.defineProperties();
  }

  /** The configured keyspace prefix in Redis for this Schema. */
  get prefix(): string { return this.options?.prefix ?? this.entityCtor.name; }

  /** The configured name for the RediSearch index for this Schema. */
  get indexName(): string { return this.options?.indexName ?? `${this.prefix}:index`; }

  /** The configured name for the RediSearch index hash for this Schema. */
  get indexHashName(): string { return this.options?.indexHashName ?? `${this.prefix}:index:hash`; }

  /**
   * The configured data structure, a string with the value of either `HASH` or `JSON`,
   * that this Schema uses to store {@link Entity | Entities} in Redis.
   * */
  get dataStructure(): DataStructure { return this.options?.dataStructure ?? 'JSON'; }

  /**
   * The configured usage of stop words, a string with the value of either `OFF`, `DEFAULT`,
   * or `CUSTOM`. See {@link SchemaOptions.useStopWords} and {@link SchemaOptions.stopWords}
   * for more details.
   */
  get useStopWords(): StopWordOptions { return this.options?.useStopWords ?? 'DEFAULT'; }

  /**
   * The configured stop words. Ignored if {@link Schema.useStopWords} is anything other
   * than `CUSTOM`.
   */
  get stopWords(): Array<string> { return this.options?.stopWords ?? []; }

  /**
   * The configured indexed default setting for fields
   */
  get indexedDefault(): boolean { return this.options?.indexedDefault ?? true; }

  /** The hash value of this index. Stored in Redis under {@link Schema.indexHashName}. */
  get indexHash(): string {

    const data = JSON.stringify({
      definition: this.definition,
      prefix: this.prefix,
      indexName: this.indexName,
      indexHashName: this.indexHashName,
      dataStructure: this.dataStructure,
      useStopWords: this.useStopWords,
      stopWords: this.stopWords,
    });

    return createHash('sha1').update(data).digest('base64');
  }

  /** @internal */
  get redisSchema(): Array<string> {
    if (this.dataStructure === 'HASH') return new HashSchemaBuilder(this).redisSchema;
    if (this.dataStructure === 'JSON') return new JsonSchemaBuilder(this).redisSchema;
    throw new Error(`'${this.dataStructure}' in an invalid data structure. Valid data structures are 'HASH' and 'JSON'.`);
  }

  /**
   * Generates a unique string using the configured {@link IdStrategy}.
   * @returns
   */
  generateId(): string {
    const ulidStrategy: IdStrategy = () => ulid();
    return (this.options?.idStrategy ?? ulidStrategy)();
  }

  private defineProperties() {
    Object.keys(this.definition).forEach(fieldName => {

      const fieldDef: FieldDefinition = this.definition[fieldName];
      const fieldAlias = fieldDef.alias ?? fieldName;

      this.validateFieldDef(fieldName, fieldDef);

      Object.defineProperty(this.entityCtor.prototype, fieldName, {
        configurable: true,
        get: function (): any {
          return this.entityFields[fieldAlias].value;
        },
        set: function (value: any): void {
          this.entityFields[fieldAlias].value = value;
        }
      });
    })
  }

  private validateOptions() {
    if (!['HASH', 'JSON'].includes(this.dataStructure))
      throw Error(`'${this.dataStructure}' in an invalid data structure. Valid data structures are 'HASH' and 'JSON'.`);

    if (!['OFF', 'DEFAULT', 'CUSTOM'].includes(this.useStopWords))
      throw Error(`'${this.useStopWords}' in an invalid value for stop words. Valid values are 'OFF', 'DEFAULT', and 'CUSTOM'.`);

    if (this.options?.idStrategy && !(this.options.idStrategy instanceof Function))
      throw Error("ID strategy must be a function that takes no arguments and returns a string.");

    if (this.prefix === '') throw Error(`Prefix must be a non-empty string.`);
    if (this.indexName === '') throw Error(`Index name must be a non-empty string.`);
  }

  private validateFieldDef(field: string, fieldDef: FieldDefinition) {
    if (!['boolean', 'date', 'number', 'point', 'string', 'string[]', 'text'].includes(fieldDef.type))
      throw Error(`The field '${field}' is configured with a type of '${fieldDef.type}'. Valid types include 'boolean', 'date', 'number', 'point', 'string', 'string[]', and 'text'.`);
  }
}
