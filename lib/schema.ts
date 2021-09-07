import Entity from "./entity";

type EntityConstructor<T> = new (data: object) => T;

export interface SchemaOptions {
  prefix?: string
}

export class Schema<T> {
  readonly entityCtor: EntityConstructor<T>;
  private options?: SchemaOptions;

  constructor(ctor: EntityConstructor<T>, schema: any, options?: SchemaOptions ) {

    this.entityCtor = ctor;
    this.options = options;

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

export class RedisId {}
export class RedisTextField {}
export class RedisTagField {}
export class RedisNumericField {}
export class RedisUserField {}
