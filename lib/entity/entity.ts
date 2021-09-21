import { EntityData, EntityId } from "./entity-types";

export default abstract class Entity {
  readonly redisId: EntityId;
  readonly redisData: EntityData;

  constructor(id: EntityId, data: EntityData = {}) {
    this.redisId = id;
    this.redisData = data;
  }
}
