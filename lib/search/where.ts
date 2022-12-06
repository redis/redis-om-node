/**
 * Abstract base class used extensively with {@link Search}.
 */
export abstract class Where {
  /**
   * Converts this {@link Where} into a portion of a RediSearch query.
   */
  abstract toString(): string
}
