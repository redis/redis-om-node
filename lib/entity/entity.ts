/** Defines the objects returned from calls to {@link Repository | repositories }. */
export type Entity = EntityId & EntityData

/** Specific data that uniquely identifies an {@link Entity}. */
export type EntityId = {
  /** The unique ID of the {@link Entity}. */
  entityId?: string,
  /** The key the {@link Entity} is stored under inside of Redis. */
  keyName?: string,
}

/** The free-form data associated with an {@link Entity}. */
export type EntityData = {
  [key: string] : EntityValue
}

/** Valid values that {@link EntityData} might conitain. */
export type EntityValue = string | number | boolean | Point | Date | any[] | EntityData | null | undefined

/** Defines a point on the globe using longitude and latitude. */
export type Point = {
  /** The longitude of the point. */
  longitude: number,
  /** The latitude of the point. */
  latitude: number
}
