/** Mixin for adding weight for TEXT fields in RediSearch. */
export interface WeightFieldDefinition {
  /** Enables setting the weight to apply to a text field */
   weight?: number;
}
