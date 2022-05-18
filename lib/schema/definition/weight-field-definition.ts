/** Mixin for adding weight for TEXT fields in RediSearch. */
interface WeightFieldDefinition {
  /** Enables setting the weight to apply to a text field */
   weight?: number;
}

export default WeightFieldDefinition;
