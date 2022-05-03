/** Mixin for adding weight for TEXT fields in RediSearch. */
interface WeightFieldDefinition {
  /** Enables setting the weight to apply to a field */
   weight?: number;
}

export default WeightFieldDefinition;
