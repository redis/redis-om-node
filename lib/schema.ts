import { v4 } from 'uuid';

import { Entity, RedisId, EntityConstructor } from "./entity";

export interface SchemaDefinition {
  [key: string]: FieldDefinition
}

export interface Field {
  alias?: string;
}

export interface NumericField extends Field {
  type: 'number';
}

export interface StringField extends Field {
  type: 'string';
  textSearch?: boolean;
}

export interface BooleanField extends Field {
  type: 'boolean';
}

export type FieldDefinition = NumericField | StringField | BooleanField;

export interface SchemaOptions {
  prefix?: string;
  idStrategy?: RedisIdStrategy;
}

export type RedisIdStrategy = () => RedisId;

export class Schema<TEntity extends Entity> {
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
      
      let numberDeserializer = (value: string): number => Number.parseFloat(value);
      let stringDeserializer = (value: string): string => value;
      let booleanDeserializer = (value: string): boolean => value === '1';

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
      } else {
        // TODO: throw an error, or at least don't define the field
        return
      }

      Object.defineProperty(this.entityCtor.prototype, field, {
        get: function (): any {
          let value: string = this.redisData[fieldAlias] ?? null;
          return value === null ? null : selectedDeserializer(value);
        },
        set: function(value?: any): void {
          value = value ?? null;
          if (value === null) delete this.redisData[fieldAlias];
          else this.redisData[fieldAlias] = selectedSerializer(value);
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

  generateId(): RedisId {

    let defaultStrategy: RedisIdStrategy = () => {
      let bytes: number[] = [];
      return Buffer.from(v4(null, bytes)).toString('base64').slice(0, 22);
    }

    return (this.options?.idStrategy ?? defaultStrategy)();
  }
}
