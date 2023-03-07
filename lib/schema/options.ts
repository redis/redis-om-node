/** The type of data structure in Redis to map objects to. */
export type DataStructure = 'HASH' | 'JSON';

/** A function that generates random entityIds. */
export type IdStrategy = () => Promise<string>;

/** Valid values for how to use stop words for a given {@link Schema}. */
export type StopWordOptions = 'OFF' | 'DEFAULT' | 'CUSTOM';

/** Configuration options for a {@link Schema}. */
export type SchemaOptions = {

  /**
   * The name used by RediSearch to store the index for this {@link Schema}. Defaults
   * to prefix followed by `:index`. So, for a prefix of `Foo`, it would use `Foo:index`.
   */
  indexName?: string

  /**
   * The name used by Redis OM to store the hash of the index for this {@link Schema}.
   * Defaults to prefix followed by `:index:hash`. So, for a prefix of `Foo`, it would
   * use `Foo:index:hash`.
   */
  indexHashName?: string

  /** The data structure used to store the {@link Entity} in Redis. Can be set
   * to either `JSON` or `HASH`. Defaults to JSON.
   */
  dataStructure?: DataStructure

  /**
   * A function that generates a random entityId. Defaults to a function that generates
   * [ULIDs](https://github.com/ulid/spec). Combined with prefix to generate a Redis key.
   * If prefix is `Foo` and idStratgey returns `12345` then the generated key would be
   * `Foo:12345`.
   */
  idStrategy?: IdStrategy

  /**
   * Configures the usage of stop words. Valid values are `OFF`, `DEFAULT`, and `CUSTOM`.
   * Setting this to `OFF` disables all stop words. Setting this to `DEFAULT` uses the
   * stop words intrinsic to RediSearch. Setting this to `CUSTOM` tells RediSearch to
   * use the stop words in `stopWords`.
   */
  useStopWords?: StopWordOptions

  /**
   * Stop words to be used by this schema. If `useStopWords` is
   * anything other than `CUSTOM`, this option is ignored.
   */
  stopWords?: Array<string>
}
