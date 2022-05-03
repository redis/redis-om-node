/** Mixin for adding noindex to a field. */
interface NoIndexFieldDefinition {
  /** Enables turning off indexing of this field. */
  noindex?: boolean;
}

export default NoIndexFieldDefinition;
