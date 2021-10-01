import { v4 } from 'uuid';

import Entity from "../entity/entity";

import { EntityConstructor, EntityId, EntityIdStrategy, EntityIndex, EntityPrefix } from '../entity/entity-types';
import { JsonField, FieldDefinition, SchemaDefinition, StringField } from './schema-definitions';
import { EntityDataStructure, SchemaOptions } from './schema-options';

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

    this.validateOptions();
    this.defineProperties();
  }

  get prefix(): EntityPrefix {
    return this.options?.prefix ?? this.entityCtor.name;
  }

  get indexName(): EntityIndex {
    return this.options?.indexName ?? `${this.prefix}:index`;
  }

  get dataStructure(): EntityDataStructure {
    return this.options?.dataStructure ?? 'HASH';
  }

  get redisSchema(): string[] {

    let redisSchema: string[] = [];

    for (let field in this.definition) {
      let fieldDef: FieldDefinition = this.definition[field];
      let fieldType = fieldDef.type;
      let fieldAlias = fieldDef.alias ?? field;

      if (this.dataStructure === 'JSON') {
        let fieldPath = (fieldDef as JsonField).path;
        redisSchema.push(fieldPath, 'AS');
      }

      redisSchema.push(fieldAlias)

      if (fieldType === 'boolean') redisSchema.push('TAG');
      if (fieldType === 'number') redisSchema.push('NUMERIC');
      if (fieldType === 'array')
        redisSchema.push('TAG', 'SEPARATOR', (fieldDef as StringField).separator ?? '|');

      if (fieldType === 'string') {
        if ((fieldDef as StringField).textSearch)
          redisSchema.push('TEXT');
        else
          redisSchema.push('TAG', 'SEPARATOR', (fieldDef as StringField).separator ?? '|');
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

  private validateOptions() {
    if (!['HASH', 'JSON'].includes(this.dataStructure))
      throw `'${this.dataStructure}' in an invalid data structure. Valid data structures are 'HASH' and 'JSON'.`;

    if (this.options?.idStrategy && !(this.options.idStrategy instanceof Function))
      throw "ID strategy must be a function that takes no arguments and returns a string.";
  
    if (this.prefix === '') throw `Prefix must be a non-empty string.`;
    if (this.indexName === '') throw `Index name must be a non-empty string.`;
  }

  private defineProperties() {
    for (let field in this.definition) {
      let fieldDef: FieldDefinition = this.definition[field];
      let fieldAlias = fieldDef.alias ?? field;
      let { serializer, deserializer } = this.selectSerializers(field, fieldDef);

      Object.defineProperty(this.entityCtor.prototype, field, {
        get: function (): any {
          let value: string = this.entityData[fieldAlias] ?? null;
          return value === null ? null : deserializer(value);
        },
        set: function(value?: any): void {
          value = value ?? null;
          if (value === null) delete this.entityData[fieldAlias];
          else this.entityData[fieldAlias] = serializer(value);
        }
      });
    }
  }

  private selectSerializers(field: string, fieldDef: FieldDefinition) {
    let serializer: (value: any) => string;
    let deserializer: (value: string) => any;

    if (fieldDef.type === 'number') {
      serializer = numberSerializer;
      deserializer = numberDeserializer;
    } else if (fieldDef.type === 'string') {
      serializer = stringSerializer;
      deserializer = stringDeserializer;
    } else if (fieldDef.type === 'boolean') {
      serializer = booleanSerializer;
      deserializer = booleanDeserializer;
    } else if (fieldDef.type === 'array') {
      serializer = arraySerializer(fieldDef.separator ?? '|');
      deserializer = arrayDeserializer(fieldDef.separator ?? '|');
    } else {
      // @ts-ignore: JavaScript trap
      throw(`The field '${field}' is configured with a type of '${fieldDef.type}'. Valid types include 'array', 'boolean', 'number', and 'string'.`);
    }

    return { serializer, deserializer };
  }
}
