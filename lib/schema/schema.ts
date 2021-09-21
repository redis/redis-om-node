import { v4 } from 'uuid';

import Entity from "../entity/entity";

import { EntityId, EntityConstructor } from '../entity/entity-types';
import { FieldDefinition, SchemaDefinition } from './schema-definitions';
import { RedisIdStrategy, SchemaOptions } from './schema-options';

export default class Schema<TEntity extends Entity> {
  readonly entityCtor: EntityConstructor<TEntity>;
  readonly definition: SchemaDefinition
  private options?: SchemaOptions;

  constructor(ctor: EntityConstructor<TEntity>, schemaDef: SchemaDefinition, options?: SchemaOptions ) {

    this.entityCtor = ctor;
    this.definition = schemaDef;
    this.options = options;

    for (let field in schemaDef) {

      let fieldDef: FieldDefinition = schemaDef[field];
      let fieldType = fieldDef.type;
      let fieldAlias = fieldDef.alias ?? field;

      let numberSerializer = (value: number): string => value.toString();
      let stringSerializer = (value: string): string => value;
      let booleanSerializer = (value: boolean): string => value ? '1' : '0';
      let arraySerializer = (value: string[]): string => value.join(',');
      
      let numberDeserializer = (value: string): number => Number.parseFloat(value);
      let stringDeserializer = (value: string): string => value;
      let booleanDeserializer = (value: string): boolean => value === '1';
      let arrayDeserializer = (value: string): string[] => value.split(',');

      let selectedSerializer: (value: any) => string;
      let selectedDeserializer: (value: string) => any;

      if (fieldType === 'number') {
        selectedSerializer = numberSerializer;
        selectedDeserializer = numberDeserializer;
      } else if (fieldType === 'string') {
        selectedSerializer = stringSerializer;
        selectedDeserializer = stringDeserializer;
      } else if (fieldType === 'boolean') {
        selectedSerializer = booleanSerializer;
        selectedDeserializer = booleanDeserializer;
      } else if (fieldType === 'array') {
        selectedSerializer = arraySerializer;
        selectedDeserializer = arrayDeserializer;
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

  get prefix(): string {
    return this.options?.prefix ?? this.entityCtor.name;
  }

  get indexName(): string {
    return `${this.prefix}:index`;
  }

  generateId(): EntityId {

    let defaultStrategy: RedisIdStrategy = () => {
      let bytes: number[] = [];
      return Buffer.from(v4(null, bytes)).toString('base64').slice(0, 22);
    }

    return (this.options?.idStrategy ?? defaultStrategy)();
  }
}
