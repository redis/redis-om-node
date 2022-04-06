/** Base interface for all fields. */
export interface Field {
  /** The type of the field (i.e. string, number, boolean, etc.) */
  type: string;

  /**
   * The default field name in Redis is the key name defined in the
   * {@link SchemaDefinition}. Overrides the Redis key name if set.
   */
  alias?: string;
}

/** Mixin for adding sortability to a field. */
export interface Sortable {
  /** Enables sorting by this field. */
  sortable?: boolean;
}

/** Mixin for adding parsing for TAG fields in RediSearch. */
export interface Separable {
  /**
   * Due to how RediSearch works, strings and arrays are sometimes stored the same in Redis, as a
   * simple string. This is the separator used to split those strings when it is an array. If your
   * StringField contains this separator, this can cause problems. You can change it here to avoid
   * those problems. Defaults to `|`.
   */
   separator?: string;
}

/** A field representing a number. */
export interface NumberField extends Field, Sortable {
  /** Yep. It's a number. */
  type: 'number';
}

/** A field representing a whole string. */
export interface StringField extends Field, Sortable, Separable {
  /** Yep. It's a string. */
  type: 'string';
}

/** A field representing searchable text. */
export interface TextField extends Field, Sortable {
  /** Yep. It's searchable text. */
  type: 'text';
}

/** A field representing a boolean. */
export interface BooleanField extends Field, Sortable {
  /** Yep. It's a boolean. */
  type: 'boolean';
}

/** A field representing a point on the globe. */
export interface PointField extends Field {
  /** Yep. It's a point. */
  type: 'point';
}

/** A field representing a date/time. */
export interface DateField extends Field, Sortable {
  /** Yep. It's a date. */
  type: 'date';
}

/** A field representing an array of strings. */
export interface StringArrayField extends Field, Separable {
  /** Yep. It's a string array. */
  type: 'string[]';
}

/** Contains instructions telling how to map a property on an {@link Entity} to Redis. */
export type FieldDefinition = StringField | TextField | NumberField | BooleanField | PointField | DateField | StringArrayField;

/**
* Group of {@link FieldDefinition}s that define the schema for an {@link Entity}.
 */
export type SchemaDefinition = Record<string, FieldDefinition>;
