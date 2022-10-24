import { Schema } from "../schema";
import { BaseFieldDefinition } from "./base-field-definition";
import { SchemaDefinition } from "./schema-definition";

/** A field representing a whole string. */
export interface ObjectFieldDefinition
  extends Pick<BaseFieldDefinition, "type" | "alias"> {
  /** Yep. It's a object. */
  type: "object";

  fields: SchemaDefinition;
}
