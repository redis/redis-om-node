import BaseFieldDefinition from "./base-field-definition";
import SeparableFieldDefinition from "./separable-field-definition";
import SortableFieldDefinition from "./sortable-field-definition";

/** A field representing a whole string. */
interface StringFieldDefinition extends BaseFieldDefinition, SortableFieldDefinition, SeparableFieldDefinition {
  /** Yep. It's a string. */
  type: 'string';
}

export default StringFieldDefinition;
