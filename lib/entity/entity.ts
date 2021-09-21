import { RedisData, RedisId } from "./entity-types";

export default abstract class Entity {
  readonly redisId: RedisId;
  readonly redisData: RedisData;

  constructor(id: RedisId, data: RedisData = {}) {
    this.redisId = id;
    this.redisData = data;
  }
}
