export type Entity = EntityId & EntityData

export type EntityId = {
  entityId?: string,
  keyName?: string,
}

export type EntityData = {
  [key: string] : EntityValue
}

export type EntityValue = string | number | boolean | Point | Date | any[] | EntityData | null | undefined;

/** Defines a point on the globe using longitude and latitude. */
export type Point = {
  /** The longitude of the point. */
  longitude: number,
  /** The latitude of the point. */
  latitude: number
}
