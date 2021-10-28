export type EntityData = { [key: string]: string | number | boolean | string[] };
export type EntityConstructor<TEntity> = new (id: string, data?: EntityData) => TEntity;

/** Abstract base class for all entities. */
export default abstract class Entity {
  /**
   * The generated entity ID.
   */
  readonly entityId: string;

  /** @internal */
  readonly entityData: EntityData;

  /** @internal */
  constructor(id: string, data: EntityData = {}) {
    this.entityId = id;
    this.entityData = data;
  }
}
