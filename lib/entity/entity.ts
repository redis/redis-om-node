import { EntityData, EntityId } from "./entity-types";

export default abstract class Entity {
  readonly entityId: EntityId;
  readonly entityData: EntityData;

  constructor(id: EntityId, data: EntityData = {}) {
    this.entityId = id;
    this.entityData = data;
  }
}
