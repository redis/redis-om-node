/** Valid field types for a {@link FieldDefinition}. */
export type FieldType = 'boolean' | 'date' | 'number' | 'point' | 'string' | 'string[]' | 'text'

/** All configuration properties that any field might have, regardless of type. */
export type AllFieldDefinition = {

  /** The type of the field (i.e. string, number, boolean, etc.) */
  type: FieldType

  /**
   * The default field name in Redis is the property name defined in the
   * {@link SchemaDefinition}. Overrides the field name for a Hash to this
   * value or in the case of JSON documents, sets the JSONPath to this
   * value preceded by `$.`. Overridden by {@link field} and/or {@link path}
   * settings.
   * @deprecated
   */
  alias?: string

  /**
   * Is this field indexed and thus searchable with Redis OM. Defaults
   * to true.
   */
  indexed?: boolean

  /**
   * The field name used to store this in a Redis Hash. Defaults to the
   * name used in the {@link SchemaDefinition} or the {@link alias}
   * property.
   */
  field?: string

  /**
   * The JSONPath expression this field references. Used only by search
   * and only for JSON documents. Defaults to the name used in the
   * {@link SchemaDefinition} or the {@link alias} property prefixed
   * with `$.` .
   */
  path?: string

  /** Enables sorting by this field. */
  sortable?: boolean

  /** Is the original case of this field indexed with Redis OM. Defaults to false. */
  caseSensitive?: boolean

  /** Is this (sortable) field normalized when indexed. Defaults to true. */
  normalized?: boolean

  /**
   * Due to how RediSearch works, strings and arrays are sometimes stored the same in Redis, as a
   * simple string. This is the separator used to split those strings when it is an array. If your
   * StringField contains this separator, this can cause problems. You can change it here to avoid
   * those problems. Defaults to `|`.
   */
  separator?: string

  /**
   * Enables setting the phonetic matcher to use, supported matchers are:
   * dm:en - Double Metaphone for English
   * dm:fr - Double Metaphone for French
   * dm:pt - Double Metaphone for Portuguese
   * dm:es - Double Metaphone for Spanish
   */
  matcher?: 'dm:en' | 'dm:fr' | 'dm:pt' | 'dm:es'

  /** Is word stemming applied to this field with Redis OM. Defaults to true. */
  stemming?: boolean

  /** Enables setting the weight to apply to a text field */
  weight?: number
}

/** The configuration properties that all fields have in common. */
export type CommonFieldDefinition = Pick<AllFieldDefinition, "type" | "alias" | "indexed" | "field" | "path">

/** A field representing a boolean. */
export type BooleanFieldDefinition = { type: 'boolean' }
  & CommonFieldDefinition
  & Pick<AllFieldDefinition, "sortable">

/** A field representing a date/time. */
export type DateFieldDefinition = { type: 'date' }
  & CommonFieldDefinition
  & Pick<AllFieldDefinition, "sortable">

/** A field representing a number. */
export type NumberFieldDefinition = { type: 'number' }
  & CommonFieldDefinition
  & Pick<AllFieldDefinition, "sortable">

/** A field representing a point on the globe. */
export type PointFieldDefinition = { type: 'point' }
  & CommonFieldDefinition

/** A field representing an array of strings. */
export type StringArrayFieldDefinition = { type: 'string[]' }
  & CommonFieldDefinition
  & Pick<AllFieldDefinition, "sortable" | "caseSensitive" | "normalized" | "separator">

/** A field representing a whole string. */
export type StringFieldDefinition = { type: 'string' }
  & CommonFieldDefinition
  & Pick<AllFieldDefinition, "sortable" | "caseSensitive" | "normalized" | "separator">

/** A field representing searchable text. */
export type TextFieldDefinition = { type: 'text' }
  & CommonFieldDefinition
  & Pick<AllFieldDefinition, "sortable" | "normalized" | "matcher" | "stemming" | "weight" >

/** Contains instructions telling how to map a property on an {@link Entity} to Redis. */
export type FieldDefinition =
  BooleanFieldDefinition | DateFieldDefinition | NumberFieldDefinition |
  PointFieldDefinition | StringArrayFieldDefinition | StringFieldDefinition |
  TextFieldDefinition

/** Group of {@link FieldDefinition}s that define the schema for an {@link Entity}. */
export type SchemaDefinition = Record<string, FieldDefinition>
