import { BaseFieldDefinition } from "./base-field-definition";
import { SortableFieldDefinition } from "./sortable-field-definition";

/** A field representing a boolean. */
export interface BooleanFieldDefinition extends BaseFieldDefinition, SortableFieldDefinition {
  /** Yep. It's a boolean. */
  type: 'boolean';
}
