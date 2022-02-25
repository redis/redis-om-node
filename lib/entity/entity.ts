import { Point, SchemaDefinition } from "../schema/schema-definitions";
import Schema from "../schema/schema";

/**
 * Valid values for properties of an {@link Entity}.
 */
export type EntityValue = number | boolean | string | Point | Date | string[];

/**
 * A JavaScript object containing the underlying data of an {@link Entity}.
 */
export type EntityData = Record<string, EntityValue>;

/** 
 * A constructor that creates an {@link Entity} of type TEntity.
 * @template TEntity The {@link Entity} type.
 */
export type EntityConstructor<TEntity> = new (
  schema: Schema<any>,
  id: string,
  data?: EntityData) => TEntity;

/**
 * An Entity is the class from which objects that Redis OM maps to are made. You need
 * to subclass Entity in your application:
 * 
 * ```typescript
 * class Foo extends Entity {}
 * ```
 */
export default abstract class Entity {
  /** The generated entity ID. */
  readonly entityId: string;

  /** 
   * The underlying data to be written to Redis.
   * @internal
   */
  readonly entityData: EntityData;

  private schemaDef: SchemaDefinition;
  private prefix: string;

  /** 
   * Creates an new Entity.
   * @internal
   */
  constructor(schema: Schema<any>, id: string, data: EntityData = {}) {
    this.schemaDef = schema.definition;
    this.prefix = schema.prefix;
    this.entityId = id;
    this.entityData = data;
  }

  get keyName(): string {
    return `${this.prefix}:${this.entityId}`;
  }

  toJSON() {
    let json: Record<string, any> = { entityId: this.entityId }
    for (let key in this.schemaDef) {
      json[key] = (this as Record<string, any>)[key];
    }
    return json;
  }
}
