/** Mixin for adding stemming to a field. */
export interface StemmingFieldDefinition {
  /**
   * Is word stemming applied to this field with Redis OM. Defaults
   * to true.
   */
  stemming?: boolean;
}
