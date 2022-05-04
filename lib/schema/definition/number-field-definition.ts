import BaseFieldDefinition from "./base-field-definition";
import NoIndexFieldDefinition from "./noindex-field-definition";
import SortableFieldDefinition from "./sortable-field-definition";

/** A field representing a number. */
interface NumberFieldDefinition extends BaseFieldDefinition, SortableFieldDefinition, NoIndexFieldDefinition {
  /** Yep. It's a number. */
  type: 'number';
}

export default NumberFieldDefinition;
