import { EntityIdStrategy, EntityIndex, EntityPrefix } from "../entity/entity-types";

export type EntityDataStructure = "HASH" | "JSON";

export type SchemaOptions = {
  prefix?: EntityPrefix;
  idStrategy?: EntityIdStrategy;
  indexName?: EntityIndex;
  dataStructure?: EntityDataStructure;
}
