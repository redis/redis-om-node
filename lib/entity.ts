import { v4 } from 'uuid';

export default abstract class Entity {
  readonly redisData: any;
  readonly redisId: string;

  constructor(id: string | null = null, data: any = {}) {
    this.redisId = id ?? this.generateId();
    this.redisData = data;
  }

  generateId(): string {
    let bytes: number[] = [];
    return Buffer.from(v4(null, bytes)).toString('base64').slice(0, 22);
  }
}
