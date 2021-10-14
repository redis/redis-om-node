export type EntityData = { [key: string]: string | number | boolean | string[] };
export type EntityConstructor<TEntity> = new (id: string, data?: EntityData) => TEntity;
