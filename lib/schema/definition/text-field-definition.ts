import BaseFieldDefinition from "./base-field-definition";
import SortableFieldDefinition from "./sortable-field-definition";

/** A field representing searchable text. */
interface TextFieldDefinition extends BaseFieldDefinition, SortableFieldDefinition {
  /** Yep. It's searchable text. */
  type: 'text';
}

export default TextFieldDefinition;
