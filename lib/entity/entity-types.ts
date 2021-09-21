export type RedisId = string;
export type RedisData = {
  [key: string]: string
}

export type EntityConstructor<TEntity> = new (id: RedisId, data?: RedisData) => TEntity;
