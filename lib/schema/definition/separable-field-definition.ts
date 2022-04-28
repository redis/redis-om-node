/** Mixin for adding parsing for TAG fields in RediSearch. */
interface SeparableFieldDefinition {
  /**
   * Due to how RediSearch works, strings and arrays are sometimes stored the same in Redis, as a
   * simple string. This is the separator used to split those strings when it is an array. If your
   * StringField contains this separator, this can cause problems. You can change it here to avoid
   * those problems. Defaults to `|`.
   */
   separator?: string;
}

export default SeparableFieldDefinition;
