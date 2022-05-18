import BaseFieldDefinition from "./base-field-definition";
import NoStemFieldDefinition from "./nostem-field-definition";
import PhoneticFieldDefinition from "./phonetic-field-definition";
import SortableFieldDefinition from "./sortable-field-definition";
import UnNormalizedFieldDefinition from "./unnormalized-field-definition";
import WeightFieldDefinition from "./weight-field-definition";

/** A field representing searchable text. */
interface TextFieldDefinition extends BaseFieldDefinition, SortableFieldDefinition, NoStemFieldDefinition, PhoneticFieldDefinition, UnNormalizedFieldDefinition, WeightFieldDefinition {
  /** Yep. It's searchable text. */
  type: 'text';
}

export default TextFieldDefinition;
