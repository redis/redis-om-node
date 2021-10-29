/**
 * Abstract base class used extensively with {@link Search}.
 */
export abstract class Where {
  /**
   * Converts this {@link Where} into a partion of a RediSearch query.
   */
  abstract toString(): string;
}

export default Where;
