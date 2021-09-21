import { EntityId } from "../entity/entity-types";

export type SchemaOptions = {
  prefix?: string;
  idStrategy?: RedisIdStrategy;
}

export type RedisIdStrategy = () => EntityId;
