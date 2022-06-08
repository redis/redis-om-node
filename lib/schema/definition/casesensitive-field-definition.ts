/** Mixin for adding caseSensitive to a TAG field. */
interface CaseSensitiveFieldDefinition {
  /**
   * Is the original case of this field indexed with Redis OM. Defaults
   * to false.
   */
  caseSensitive?: boolean;
}

export default CaseSensitiveFieldDefinition;
