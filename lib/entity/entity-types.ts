export type EntityPrefix = string;
export type EntityId = string;
export type EntityKey = string;
export type EntityData = {
  [key: string]: string
}

export type EntityConstructor<TEntity> = new (id: EntityId, data?: EntityData) => TEntity;

export type EntityIdStrategy = () => EntityId;
