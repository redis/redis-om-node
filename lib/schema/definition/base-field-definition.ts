import SchemaFieldType from "./schema-field-type";

/** Base interface for all fields. */
interface BaseFieldDefinition {
  /** The type of the field (i.e. string, number, boolean, etc.) */
  type: SchemaFieldType;

  /**
   * The default field name in Redis is the key name defined in the
   * {@link SchemaDefinition}. Overrides the Redis key name if set.
   */
  alias?: string;

  /**
   * Is this field indexed and thus searchable with Redis OM. Defaults
   * to the schema indexedDefault value, currently true.
   */
  indexed?: boolean;
}

export default BaseFieldDefinition;
