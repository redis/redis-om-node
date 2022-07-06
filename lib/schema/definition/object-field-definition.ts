import { EmbeddedSchema } from "../schema";
import { BaseFieldDefinition } from "./base-field-definition";

/** A field representing an embedded ${@link Entity}. */
export interface ObjectFieldDefinition extends BaseFieldDefinition {
  /** Yep. It's an object. */
  type: 'object';
  /** */
  schema: EmbeddedSchema<any>
}

