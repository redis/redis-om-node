/**
 * A JavaScript object containing the underlying data of an {@link Entity}.
 */
export type EntityData = { [key: string]: string | number | boolean | string[] };

/** 
 * A constructor that creates an {@link Entity} of type TEntity.
 * @template TEntity The {@link Entity} type.
 */
export type EntityConstructor<TEntity> = new (id: string, data?: EntityData) => TEntity;

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

  /** 
   * Creates an new Entity.
   * @internal
   */
  constructor(id: string, data: EntityData = {}) {
    this.entityId = id;
    this.entityData = data;
  }
}
