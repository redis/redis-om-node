import { EntityData } from "./entity-types";

export default abstract class Entity {
  readonly entityId: string;
  readonly entityData: EntityData;

  constructor(id: string, data: EntityData = {}) {
    this.entityId = id;
    this.entityData = data;
  }
}
