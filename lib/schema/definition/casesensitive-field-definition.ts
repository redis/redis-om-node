/** Mixin for adding casesensitive to a TAG field. */
interface CaseSensitiveFieldDefinition {
  /**
   * Is the original case of this field indexed with Redis OM. Defaults
   * to false.
   */
  casesensitive?: boolean;
}

export default CaseSensitiveFieldDefinition;
