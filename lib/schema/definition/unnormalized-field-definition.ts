/** Mixin for adding unf to a field. */
interface UnNormalizedFieldDefinition {
  /**
   * Enables setting unnormalized form for this field.
   * This disables normalization (characters set to lowercase,
   * removal of diacritics)
  */
  unf?: boolean;
}

export default UnNormalizedFieldDefinition;
