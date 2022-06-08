/** Mixin for adding unf to a field. */
interface NormalizedFieldDefinition {
  /**
   * Is this (sortable) field normalized when indexed. Defaults
   * to true.
   */
  normalized?: boolean;
}

export default NormalizedFieldDefinition;
