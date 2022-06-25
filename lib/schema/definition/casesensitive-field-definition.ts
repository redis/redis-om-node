/** Mixin for adding caseSensitive to a TAG field. */
export interface CaseSensitiveFieldDefinition {
  /**
   * Is the original case of this field indexed with Redis OM. Defaults
   * to false.
   */
  caseSensitive?: boolean;
}
