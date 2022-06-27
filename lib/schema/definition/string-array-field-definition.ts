import BaseFieldDefinition from "./base-field-definition";
import CaseSensitiveFieldDefinition from "./casesensitive-field-definition";
import NormalizedFieldDefinition from "./normalized-field-definition";
import SeparableFieldDefinition from "./separable-field-definition";
import SortableFieldDefinition from "./sortable-field-definition";

/** A field representing an array of strings. */
interface StringArrayFieldDefinition extends BaseFieldDefinition, SeparableFieldDefinition, SortableFieldDefinition, CaseSensitiveFieldDefinition, NormalizedFieldDefinition {
  /** Yep. It's a string array. */
  type: 'string[]';
}

export default StringArrayFieldDefinition;
