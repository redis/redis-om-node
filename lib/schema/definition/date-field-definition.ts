import BaseFieldDefinition from "./base-field-definition";
import NoIndexFieldDefinition from "./noindex-field-definition";
import SortableFieldDefinition from "./sortable-field-definition";

/** A field representing a date/time. */
interface DateFieldDefinition extends BaseFieldDefinition, SortableFieldDefinition, NoIndexFieldDefinition {
  /** Yep. It's a date. */
  type: 'date';
}

export default DateFieldDefinition;
