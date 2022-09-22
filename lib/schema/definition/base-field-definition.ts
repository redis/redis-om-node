import { SchemaFieldType } from "./schema-field-type";

/** Base interface for all fields. */
export interface BaseFieldDefinition {
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

  /**
   * The field name used to store this in a Redis Hash. Defaults to the
   * name used in the {@link SchemaDefinition}.
   */
  field?: string

  /**
   * The JSONPath expression this field references. Used only by search
   * and only for JSON documents. Defaults to the name used in the
   * {@link SchemaDefinition} prefixed with `$.`.
   */
  path?: string
}
