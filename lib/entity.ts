import { v4 } from 'uuid';

export type RedisId = string;
export type RedisData = {
  [key: string]: string
}

export type EntityConstructor<TEntity> = new (id: RedisId, data?: RedisData) => TEntity;

export abstract class Entity {
  readonly redisId: RedisId;
  readonly redisData: RedisData;

  constructor(id: RedisId, data: RedisData = {}) {
    this.redisId = id ?? this.generateId();
    this.redisData = data;
  }

  private generateId(): RedisId {
    let bytes: number[] = [];
    return Buffer.from(v4(null, bytes)).toString('base64').slice(0, 22);
  }
}
