import { RedisId } from "../entity/entity-types";

export type SchemaOptions = {
  prefix?: string;
  idStrategy?: RedisIdStrategy;
}

export type RedisIdStrategy = () => RedisId;
