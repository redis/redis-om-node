/** The Symbol used to access the entity ID of an {@link Entity}. */
export const EntityId = Symbol.for('entityId')

/** The Symbol used to access the keyname of an {@link Entity}. */
export const EntityKeyName = Symbol.for('entityKeyName')

/** Defines the objects returned from calls to {@link Repository | repositories }. */
export type Entity = EntityMetaData & EntityData

/** Metadata for an {@link Entity}. */
export type EntityMetaData = {
  /** The unique ID of the {@link Entity}. Access using the {@link EntityId} Symbol. */
  [EntityId]?: string,
  /** The key the {@link Entity} is stored under inside of Redis. Access using the {@link EntityKeyName} Symbol. */
  [EntityKeyName]?: string,
}

/** The free-form data associated with an {@link Entity}. */
export type EntityData = {
  [key: string] : any
}

/** Defines a point on the globe using longitude and latitude. */
export type Point = {
  /** The longitude of the point. */
  longitude: number,
  /** The latitude of the point. */
  latitude: number
}
