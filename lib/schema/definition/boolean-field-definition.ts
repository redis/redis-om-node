import BaseFieldDefinition from "./base-field-definition";
import NoIndexFieldDefinition from "./noindex-field-definition";
import SortableFieldDefinition from "./sortable-field-definition";

/** A field representing a boolean. */
interface BooleanFieldDefinition extends BaseFieldDefinition, NoIndexFieldDefinition, SortableFieldDefinition {
  /** Yep. It's a boolean. */
  type: 'boolean';
}

export default BooleanFieldDefinition;
