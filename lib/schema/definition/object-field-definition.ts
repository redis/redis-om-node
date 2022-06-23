import BaseFieldDefinition from "./base-field-definition";

/** A field representing a number. */
interface ObjectFieldDefinition extends BaseFieldDefinition {
  /** Yep. It's a number. */
  type: 'object';
  /** */
  schema: any
}

export default ObjectFieldDefinition;
