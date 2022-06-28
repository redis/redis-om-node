import { BaseFieldDefinition } from "./base-field-definition";
import { SortableFieldDefinition } from "./sortable-field-definition";

/** A field representing a date/time. */
export interface DateFieldDefinition extends BaseFieldDefinition, SortableFieldDefinition {
  /** Yep. It's a date. */
  type: 'date';
}
