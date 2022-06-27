/** Mixin for adding stemming to a field. */
interface StemmingFieldDefinition {
  /**
   * Is word stemming applied to this field with Redis OM. Defaults
   * to true.
   */
  stemming?: boolean;
}

export default StemmingFieldDefinition;
