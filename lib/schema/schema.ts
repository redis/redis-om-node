import { ulid } from 'ulid'
import { SearchDataStructure } from '../client';

import Entity from "../entity/entity";
import { EntityConstructor } from '../entity/entity';

import SchemaBuilder from './schema-builder';
import { FieldDefinition, IdStrategy, SchemaDefinition } from './schema-definitions';
import { SchemaOptions } from './schema-options';

/**
 * Defines a schema that determines how an {@link Entity}
 * is mapped to Redis data structures.
 *  
 * @template TEntity The {@link Entity} this Schema defines.
 */
export default class Schema<TEntity extends Entity> {
  /** @internal */
  readonly entityCtor: EntityConstructor<TEntity>;

  /** @internal */
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
   * The configured data structure, either `HASH` or `JSON`, that this Schema uses
   * to store {@link Entity | Entities} in Redis.
   * */
  get dataStructure(): SearchDataStructure { return this.options?.dataStructure ?? 'HASH'; }
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
      let fieldAlias = fieldDef.alias ?? field;

      Object.defineProperty(this.entityCtor.prototype, field, {
        configurable: true,
        get: function (): any {
          return this.entityData[fieldAlias] ?? null;
        },
        set: function(value: any): void {
          if (value === undefined) {
            throw Error(`Property '${field}' on entity of type '${entityName}' cannot be set to undefined. Use null instead.`);
          } else if (value === null) {
            delete this.entityData[fieldAlias];
          } else {
            this.entityData[fieldAlias] = value;
          }
        }
      });
    }
  }

  private validateOptions() {
    if (!['HASH', 'JSON'].includes(this.dataStructure))
      throw Error(`'${this.dataStructure}' in an invalid data structure. Valid data structures are 'HASH' and 'JSON'.`);

    if (this.options?.idStrategy && !(this.options.idStrategy instanceof Function))
      throw Error("ID strategy must be a function that takes no arguments and returns a string.");
  
    if (this.prefix === '') throw Error(`Prefix must be a non-empty string.`);
    if (this.indexName === '') throw Error(`Index name must be a non-empty string.`);
  }

  private validateFieldDef(field: string) {
    let fieldDef: FieldDefinition = this.definition[field];
    if (!['array', 'boolean', 'number', 'string'].includes(fieldDef.type))
      throw Error(`The field '${field}' is configured with a type of '${fieldDef.type}'. Valid types include 'array', 'boolean', 'number', and 'string'.`);
  }
}
