/** Base interface for all fields. */
export interface Field {
  /**
   * The default field name in Redis is the key name defined in the 
   * {@link SchemaDefinition}. Overrides the Redis key name if set.
   */
  alias?: string;
}

/** A field representing a number. */
export interface NumericField extends Field {
  /** Yep. It's a number. */
  type: 'number';
}

/** A field representing a string. */
export interface StringField extends Field {
  /** Yep. It's a string. */
  type: 'string';

  /** Enables full-text search on this field when set to `true`. Defaults to `false`. */
  textSearch?: boolean;

  /**
   * Due to how RediSearch works, non-full-text strings and arrays are sometimes stored the same
   * in Redis, as a simple string. This is the separator used to split those strings when it is an
   * array. If your StringField contains this separator, this can cause problems. You can change it
   * here to avoid those problems. Defaults to `|`.
   */
  separator?: string;
}

/** A field representing a boolean. */
export interface BooleanField extends Field {
  /** Yep. It's a boolean. */
  type: 'boolean';
}

/** A field representing an array of strings. */
export interface ArrayField extends Field {
  /** Yep. It's an array. */
  type: 'array';

  /**
   * Due to how RediSearch works, non-full-text strings and arrays are sometimes stored the same
   * in Redis, as a simple string. This is the separator used to split those strings when it is an
   * array. If your ArrayField contains this separator, this can cause problems. You can change it
   * here to avoid those problems. Defaults to `|`.
   */
   separator?: string;
}

/** Contains instructions telling how to map a property on an {@link Entity} to Redis. */
export type FieldDefinition = NumericField | StringField | BooleanField | ArrayField;

/**
* Group of {@link FieldDefinition}s that define the schema for an {@link Entity}.
 */
export type SchemaDefinition = {
  /**
   * The key determines the propery name that is added to the {@link Entity}. The property
   * contains a {@link FieldDefinition} that tell Redis OM how to map the property to Redis.
   */
  [key: string]: FieldDefinition
}

/** A function that generates random {@link Entity.entityId | Entity IDs}. */
export type IdStrategy = () => string;
