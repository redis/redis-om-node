import { v4 } from 'uuid';

export type RedisId = string;
export type RedisData = {
  [key: string]: string
}

export default abstract class Entity {
  readonly redisId: RedisId;
  readonly redisData: RedisData;

  constructor(id: RedisId | null = null, data: RedisData = {}) {
    this.redisId = id ?? this.generateId();
    this.redisData = data;
  }

  private generateId(): RedisId {
    let bytes: number[] = [];
    return Buffer.from(v4(null, bytes)).toString('base64').slice(0, 22);
  }
}
