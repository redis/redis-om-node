export type RedisId = string;
export type RedisData = {
  [key: string]: string
}

export type EntityConstructor<TEntity> = new (id: RedisId, data?: RedisData) => TEntity;

export abstract class Entity {
  readonly redisId: RedisId;
  readonly redisData: RedisData;

  constructor(id: RedisId, data: RedisData = {}) {
    this.redisId = id;
    this.redisData = data;
  }
}
