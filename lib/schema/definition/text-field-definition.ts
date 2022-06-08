import BaseFieldDefinition from "./base-field-definition";
import StemmingFieldDefinition from "./stemming-field-definition";
import PhoneticFieldDefinition from "./phonetic-field-definition";
import SortableFieldDefinition from "./sortable-field-definition";
import NormalizedFieldDefinition from "./normalized-field-definition";
import WeightFieldDefinition from "./weight-field-definition";

/** A field representing searchable text. */
interface TextFieldDefinition extends BaseFieldDefinition, SortableFieldDefinition, StemmingFieldDefinition, PhoneticFieldDefinition, NormalizedFieldDefinition, WeightFieldDefinition {
  /** Yep. It's searchable text. */
  type: 'text';
}

export default TextFieldDefinition;
