import { v4 } from 'uuid';

import Entity from "../entity/entity";

import { EntityConstructor, EntityId, EntityIdStrategy, EntityIndex, EntityPrefix } from '../entity/entity-types';
import { ArrayField, FieldDefinition, SchemaDefinition, StringField } from './schema-definitions';
import { SchemaOptions } from './schema-options';

let numberSerializer = (value: number): string => value.toString();
let stringSerializer = (value: string): string => value;
let booleanSerializer = (value: boolean): string => value ? '1' : '0';
let arraySerializer = (separator: string) => (value: string[]): string => value.join(separator);

let numberDeserializer = (value: string): number => Number.parseFloat(value);
let stringDeserializer = (value: string): string => value;
let booleanDeserializer = (value: string): boolean => value === '1';
let arrayDeserializer = (separator: string) => (value: string): string[] => value.split(separator);

export default class Schema<TEntity extends Entity> {
  readonly entityCtor: EntityConstructor<TEntity>;
  readonly definition: SchemaDefinition;
  private options?: SchemaOptions;

  constructor(ctor: EntityConstructor<TEntity>, schemaDef: SchemaDefinition, options?: SchemaOptions ) {

    this.entityCtor = ctor;
    this.definition = schemaDef;
    this.options = options;

    for (let field in schemaDef) {

      let fieldDef: FieldDefinition = schemaDef[field];
      let fieldAlias = fieldDef.alias ?? field;

      let selectedSerializer: (value: any) => string;
      let selectedDeserializer: (value: string) => any;

      if (fieldDef.type === 'number') {
        selectedSerializer = numberSerializer;
        selectedDeserializer = numberDeserializer;
      } else if (fieldDef.type === 'string') {
        selectedSerializer = stringSerializer;
        selectedDeserializer = stringDeserializer;
      } else if (fieldDef.type === 'boolean') {
        selectedSerializer = booleanSerializer;
        selectedDeserializer = booleanDeserializer;
      } else if (fieldDef.type === 'array') {
        selectedSerializer = arraySerializer(fieldDef.separator ?? '|');
        selectedDeserializer = arrayDeserializer(fieldDef.separator ?? '|');
      } else {
        // TODO: throw an error, or at least don't define the field
        return
      }

      Object.defineProperty(this.entityCtor.prototype, field, {
        get: function (): any {
          let value: string = this.entityData[fieldAlias] ?? null;
          return value === null ? null : selectedDeserializer(value);
        },
        set: function(value?: any): void {
          value = value ?? null;
          if (value === null) delete this.entityData[fieldAlias];
          else this.entityData[fieldAlias] = selectedSerializer(value);
        }
      });
    }
  }

  get prefix(): EntityPrefix {
    return this.options?.prefix ?? this.entityCtor.name;
  }

  get indexName(): EntityIndex {
    return this.options?.indexName ?? `${this.prefix}:index`;
  }

  get redisSchema(): string[] {

    let redisSchema: string[] = [];

    for (let field in this.definition) {

      let fieldDef: FieldDefinition = this.definition[field];
      let fieldType = fieldDef.type;
      let fieldAlias = fieldDef.alias ?? field;

      redisSchema.push(fieldAlias)
      if (fieldType === 'number') {
        redisSchema.push('NUMERIC');
      }

      if (fieldType === 'string' && (fieldDef as StringField).textSearch === true) {
        redisSchema.push('TEXT');
      }

      if (fieldType === 'string' && (fieldDef as StringField).textSearch !== true) {
        redisSchema.push('TAG');
        redisSchema.push('SEPARATOR');
        redisSchema.push((fieldDef as StringField).separator ?? '|');
      }

      if (fieldType === 'boolean') {
        redisSchema.push('TAG');
      }

      if (fieldType === 'array') {
        redisSchema.push('TAG');
        redisSchema.push('SEPARATOR');
        redisSchema.push((fieldDef as StringField).separator ?? '|');
      }
    }

    return redisSchema;
  }

  generateId(): EntityId {

    let defaultStrategy: EntityIdStrategy = () => {
      let bytes: number[] = [];
      return Buffer.from(v4(null, bytes)).toString('base64').slice(0, 22);
    }

    return (this.options?.idStrategy ?? defaultStrategy)();
  }
}
