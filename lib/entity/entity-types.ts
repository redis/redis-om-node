export type EntityPrefix = string;
export type EntityId = string;
export type EntityKey = string;
export type EntityIndex = string;
export type EntityData = { [key: string]: string | number | boolean | null };
export type EntityConstructor<TEntity> = new (id: EntityId, data?: EntityData) => TEntity;
export type EntityIdStrategy = () => EntityId;
