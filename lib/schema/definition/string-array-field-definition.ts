import BaseFieldDefinition from "./base-field-definition";
import SeparableFieldDefinition from "./separable-field-definition";

/** A field representing an array of strings. */
interface StringArrayFieldDefinition extends BaseFieldDefinition, SeparableFieldDefinition {
  /** Yep. It's a string array. */
  type: 'string[]';
}

export default StringArrayFieldDefinition;
