import { v4 } from 'uuid';

import { Entity, RedisData, RedisId, EntityConstructor } from "./entity";

export interface SchemaDefinition {
  [key: string]: Field
}

export interface SchemaOptions {
  prefix?: string;
  idStrategy?: RedisIdStrategy;
}

export type RedisIdStrategy = () => RedisId;

export class Schema<TEntity extends Entity> {
  readonly entityCtor: EntityConstructor<TEntity>;
  private options?: SchemaOptions;

  constructor(ctor: EntityConstructor<TEntity>, schemaDef: SchemaDefinition, options?: SchemaOptions ) {

    this.entityCtor = ctor;
    this.options = options;

    for (let field in schemaDef) {
      let fieldDef = schemaDef[field];
      Object.defineProperty(this.entityCtor.prototype, field, {
        get: function () {
          let value = this.redisData[field] ?? null;
          if (value === null) return null;
          if (fieldDef instanceof RedisNumber) return Number.parseFloat(value);
          return value;
        },
        set: function(value) {
          if ((value ?? null) === null) {
            delete this.redisData[field];
          } else {
            if (fieldDef instanceof RedisNumber) this.redisData[field] = value.toString();
            else this.redisData[field] = value;
          }
        }
      });
    }
  }

  get prefix() : string {
    return this.options?.prefix ?? this.entityCtor.name;
  }

  generateId(): RedisId {

    let defaultStrategy: RedisIdStrategy = () => {
      let bytes: number[] = [];
      return Buffer.from(v4(null, bytes)).toString('base64').slice(0, 22);
    }

    return (this.options?.idStrategy ?? defaultStrategy)();
  }
}

export class Field {}

export class RedisText extends Field {}
export class RedisTag  extends Field{}
export class RedisNumber extends Field {}
export class RedisGeospatial extends Field {}
export class RedisBoolean extends Field {}
