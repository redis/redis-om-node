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

    // TODO: copy methods into data or data into methods?
    // TODO: what happens if there's properties in the data that aren't in the schema?
    // TODO: should the entity track changes?

    for (let field in schemaDef) {
      let fieldDef = schemaDef[field];
      Object.defineProperty(this.entityCtor.prototype, field, {
        get: function () {
          if (fieldDef instanceof RedisNumericField) return Number.parseFloat(this.redisData[field]);
          return this.redisData[field];
        },
        set: function(value) {
          if (value === null || value === undefined) {
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
  [key: string]: RedisField
}

export interface RedisField {}
export class RedisId implements RedisField {}
export class RedisTextField implements RedisField {}
export class RedisTagField  implements RedisField{}
export class RedisNumericField implements RedisField {}
export class RedisUserField implements RedisField {}
