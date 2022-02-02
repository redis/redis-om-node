import { ulid } from 'ulid'
import { RedisError } from '..';
import { SearchDataStructure } from '../client';

import Entity from "../entity/entity";
import { EntityConstructor } from '../entity/entity';

import SchemaBuilder from './schema-builder';
import { FieldDefinition, IdStrategy, SchemaDefinition, StopWordOptions } from './schema-definitions';
import { SchemaOptions } from './schema-options';

/**
 * Defines a schema that determines how an {@link Entity} is mapped to Redis
 * data structures. Construct by passing in an {@link EntityConstructor}, 
 * a {@link SchemaDefinition}, and {@link SchemaOptions}:
 * 
 * ```typescript
 * let schema = new Schema(Foo, {
 *   aString: { type: 'string' },
 *   aNumber: { type: 'number' },
 *   aBoolean: { type: 'boolean' },
 *   aGeoPoint: { type: 'geopoint' },
 *   anArray: { type: 'array' }
 * }, {
 *   dataStructure: 'JSON'
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
  constructor(ctor: EntityConstructor<TEntity>, schemaDef: SchemaDefinition, options?: SchemaOptions ) {
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

  /**
   * The configured data structure, a string with the value of either `HASH` or `JSON`,
   * that this Schema uses to store {@link Entity | Entities} in Redis.
   * */
  get dataStructure(): SearchDataStructure { return this.options?.dataStructure ?? 'HASH'; }

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
  get stopWords(): string[] { return this.options?.stopWords ?? []; }

  /** @internal */
  get redisSchema(): string[] { return new SchemaBuilder(this).redisSchema; }

  /**
   * Generates a unique string using the configured {@link IdStrategy}.
   * @returns 
   */
  generateId(): string {
    let ulidStrategy: IdStrategy = () => ulid();
    return (this.options?.idStrategy ?? ulidStrategy)();
  }

  private defineProperties() {
    let entityName = this.entityCtor.name;
    for (let field in this.definition) {
      this.validateFieldDef(field);

      let fieldDef: FieldDefinition = this.definition[field];
      let fieldType = fieldDef.type;
      let fieldAlias = fieldDef.alias ?? field;

      Object.defineProperty(this.entityCtor.prototype, field, {
        configurable: true,
        get: function (): any {
          return this.entityData[fieldAlias] ?? null;
        },
        set: function(value: any): void {

          if (value === undefined) {
            throw Error(`Property '${field}' on entity of type '${entityName}' cannot be set to undefined. Use null instead.`);
          }
          
          if (value === null) {
            delete this.entityData[fieldAlias];
            return;
          }

          let isArray = Array.isArray(value);
          let isObject = typeof(value === 'object');
          let hasLongLat = typeof(value.longitude) === 'number' && typeof(value.latitude) === 'number';
          let isGeo = !isArray && isObject && hasLongLat;

          let valueType = isGeo ? 'geopoint' : (isArray ? 'array' : typeof(value))
          if (fieldType === valueType) {
            if (isArray) {
              this.entityData[fieldAlias] = value.map((v: any) => v.toString());
            } else {
              this.entityData[fieldAlias] = value;
            }

            return;
          }

          throw new RedisError(`Property '${field}' expected type of '${fieldType}' but received type of '${valueType}'.`);
        }
      });
    }
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

  private validateFieldDef(field: string) {
    let fieldDef: FieldDefinition = this.definition[field];
    if (!['array', 'boolean', 'number', 'string', 'geopoint'].includes(fieldDef.type))
      throw Error(`The field '${field}' is configured with a type of '${fieldDef.type}'. Valid types include 'array', 'boolean', 'geopoint', 'number', and 'string'.`);
  }
}
