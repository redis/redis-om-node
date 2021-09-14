import Entity from "./entity";

type EntityConstructor<TEntity> = new (id: string, data: any) => TEntity;

export interface SchemaOptions {
  prefix?: string
}

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
            this.redisData[field] = value;
          }
        }
      });
    }
  }

  get prefix() : string {
    return this.options?.prefix ?? this.entityCtor.name;
  }
}

export interface SchemaDefinition {
  [key: string]: Field
}

export class Field {}

export class RedisText extends Field {}
export class RedisTag  extends Field{}
export class RedisNumber extends Field {}
export class RedisGeospatial extends Field {}
export class RedisBoolean extends Field {}
