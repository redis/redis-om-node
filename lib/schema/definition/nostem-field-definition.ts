/** Mixin for adding nostem to a field. */
interface NoStemFieldDefinition {
  /** Enables turning off stemming of this field. */
  nostem?: boolean;
}

export default NoStemFieldDefinition;
