import BaseFieldDefinition from "./base-field-definition";
import CaseSensitiveFieldDefinition from "./casesensitive-field-definition";
import NormalizedFieldDefinition from "./normalized-field-definition";
import SeparableFieldDefinition from "./separable-field-definition";
import SortableFieldDefinition from "./sortable-field-definition";

/** A field representing a whole string. */
interface StringFieldDefinition extends BaseFieldDefinition, SeparableFieldDefinition, SortableFieldDefinition, CaseSensitiveFieldDefinition, NormalizedFieldDefinition {
  /** Yep. It's a string. */
  type: 'string';
}

export default StringFieldDefinition;
