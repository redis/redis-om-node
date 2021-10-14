import { SearchDataStructure } from "../client";
import { IdStrategy } from "./schema-definitions";

export type SchemaOptions = {
  prefix?: string;
  indexName?: string;
  dataStructure?: SearchDataStructure;
  idStrategy?: IdStrategy;
}
