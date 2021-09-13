import Entity from "./entity";

type EntityConstructor<T> = new (data: object) => T;

export interface SchemaOptions {
  prefix?: string
}

export class Schema<TEntity extends Entity> {
  readonly entityCtor: EntityConstructor<TEntity>;
  private options?: SchemaOptions;

  constructor(ctor: EntityConstructor<TEntity>, schema: SchemaDefinition, options?: SchemaOptions ) {

    this.entityCtor = ctor;
    this.options = options;

    // TODO: copy methods into data or data into methods?
    // TODO: what happens if there's properties in the data that aren't in the schema?
    // TODO: should the entity track changes?

    for (let key in schema) {
      let value = schema[key];
      Object.defineProperty(this.entityCtor.prototype, key, {
        get: function () {
          if (value instanceof RedisNumericField) return Number.parseFloat(this.data[key]);
          return this.data[key];
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
