export { Client, SearchDataStructure, RedisHashData, RedisJsonData } from "./client";

export { Point } from "./entity/point";
export { Entity } from "./entity/entity";
export { EntityData } from "./entity/entity-data";
export { EntityValue } from "./entity/entity-value";
export { EntityConstructor } from "./entity/entity-constructor";

export { Schema } from "./schema/schema";
export * from "./schema/definition";

export { SchemaOptions, DataStructure, IdStrategy, StopWordOptions } from "./schema/options";

export { Repository } from "./repository";

export { RedisError } from "./errors";
export { AbstractSearch, Search, RawSearch, SubSearchFunction, Where, WhereField} from "./search";
export { Circle, CircleFunction } from "./search/where-point";
