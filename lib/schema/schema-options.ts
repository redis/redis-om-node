import { EntityIdStrategy, EntityPrefix } from "../entity/entity-types";

export type SchemaOptions = {
  prefix?: EntityPrefix;
  idStrategy?: EntityIdStrategy;
}
