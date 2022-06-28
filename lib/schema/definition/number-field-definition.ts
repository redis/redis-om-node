import { BaseFieldDefinition } from "./base-field-definition";
import { SortableFieldDefinition } from "./sortable-field-definition";

/** A field representing a number. */
export interface NumberFieldDefinition extends BaseFieldDefinition, SortableFieldDefinition {
  /** Yep. It's a number. */
  type: 'number';
}
