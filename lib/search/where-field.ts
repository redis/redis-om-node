import Entity from "../entity/entity";
import Search from "./search";
import Where from "./where";
import { CircleFunction } from "./where-geo";

/**
 * Interface with all the methods from all the concrete
 * classes under {@link WhereField}.
 */
interface WhereField<TEntity> extends Where {

  /**
   * Adds an equals comparison to the query.
   * 
   * NOTE: this function is not available for strings where full-text
   * search is enabled. In that scenario, use `.match`.
   * @param value The value to be compared
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  eq(value: string | number | boolean): Search<TEntity>;

  /**
   * Adds an equals comparison to the query.
   * 
   * NOTE: this function is not available for strings where full-text
   * search is enabled. In that scenario, use `.match`.
   * @param value The value to be compared
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  equal(value: string | number | boolean): Search<TEntity>;

  /**
   * Adds an equals comparison to the query.
   *
   * NOTE: this function is not available for strings where full-text
   * search is enabled. In that scenario, use `.match`.
   * @param value The value to be compared
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  equals(value: string | number | boolean): Search<TEntity>;

  /**
   * Adds an equals comparison to the query.
   *
   * NOTE: this function is not available for strings where full-text
   * search is enabled. In that scenario, use `.match`.
   * @param value The value to be compared
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  equalTo(value: string | number | boolean): Search<TEntity>;

  /**
   * Adds a full-text search comparison to the query.
   * @param value The word or phrase sought.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  match(value: string): Search<TEntity>;

  /**
   * Adds a full-text search comparison to the query.
   * @param value The word or phrase sought.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  matches(value: string): Search<TEntity>;

  /**
   * Adds a full-text search comparison to the query that matches an exact word or phrase.
   * @param value The word or phrase sought.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  matchExact(value: string): Search<TEntity>;

  /**
   * Adds a full-text search comparison to the query that matches an exact word or phrase.
   * @param value The word or phrase sought.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  matchExactly(value: string): Search<TEntity>;

  /**
   * Adds a full-text search comparison to the query that matches an exact word or phrase.
   * @param value The word or phrase sought.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  matchesExactly(value: string): Search<TEntity>;

  /**
   * Makes a call to {@link WhereField.match} a {@link WhereField.matchExact} call. Calling
   * this multiple times will have no effect.
   * @returns this.
   */
  readonly exact: WhereField<TEntity>;

  /**
   * Makes a call to {@link WhereField.match} a {@link WhereField.matchExact} call. Calling
   * this multiple times will have no effect.
   * @returns this.
   */
  readonly exactly: WhereField<TEntity>;

  /**
   * Adds a boolean match with a value of `true` to the query.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  true(): Search<TEntity>;

  /**
   * Adds a boolean match with a value of `false` to the query.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  false(): Search<TEntity>;

  /**
   * Adds a greater than comparison against a field to the search query.
   * @param value The number to compare against.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  gt(value: number): Search<TEntity>;

  /**
   * Adds a greater than comparison against a field to the search query.
   * @param value The number to compare against.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  greaterThan(value: number): Search<TEntity>;

  /**
   * Adds a greater than or equal to comparison against a field to the search query.
   * @param value The number to compare against.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  gte(value: number): Search<TEntity>;

  /**
   * Adds a greater than or equal to comparison against a field to the search query.
   * @param value The number to compare against.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  greaterThanOrEqualTo(value: number): Search<TEntity>;

  /**
   * Adds a less than comparison against a field to the search query.
   * @param value The number to compare against.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  lt(value: number): Search<TEntity>;

  /**
   * Adds a less than comparison against a field to the search query.
   * @param value The number to compare against.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  lessThan(value: number): Search<TEntity>;

  /**
   * Adds a less than or equal to comparison against a field to the search query.
   * @param value The number to compare against.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  lte(value: number): Search<TEntity>;

  /**
   * Adds a less than or equal to comparison against a field to the search query.
   * @param value The number to compare against.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  lessThanOrEqualTo(value: number): Search<TEntity>;

  /**
   * Adds an inclusive range comparison against a field to the search query.
   * @param lower The lower bound of the range.
   * @param upper The upper bound of the range.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  between(lower: number, upper: number): Search<TEntity>;

  /**
   * Adds a whole-string match for a value within an array to the search query.
   * @param value The string to be matched.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  contain(value: string): Search<TEntity>;

  /**
   * Adds a whole-string match for a value within an array to the search query.
   * @param value The string to be matched.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  contains(value: string): Search<TEntity>;

  /**
   * Adds a whole-string match against an array to the query. If any of the provided
   * strings in `value` is matched in the array, this matched.
   * @param value An array of strings that you want to match one of.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  containOneOf(...value: string[]): Search<TEntity>;

  /**
   * Adds a whole-string match against an array to the query. If any of the provided
   * strings in `value` is matched in the array, this matched.
   * @param value An array of strings that you want to match one of.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  containsOneOf(...value: string[]): Search<TEntity>;

  /**
   * Adds a search for geopoints that fall within a defined circle.
   * @param circleFn A function that returns a {@link Circle} instance defining the search area.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  inCircle(circleFn: CircleFunction): Search<TEntity>;
}

/**
 * Abstract base class that all fields you want to filter
 * with extend. When you call {@link Search.where}, a
 * subclass of this is returned.
 */
 abstract class WhereField<TEntity extends Entity> {
  private negated: boolean = false;

  /** @internal */
  protected search: Search<TEntity>;

  /** @internal */
  protected field: String;

  /** @internal */
  constructor(search: Search<TEntity>, field: string) {
    this.search = search;
    this.field = field;
  }

  /**
   * Returns the current instance. Syntactic sugar to make your code more fluent.
   * @returns this
   */
  get is() {
    return this;
  }

  /**
   * Returns the current instance. Syntactic sugar to make your code more fluent.
   * @returns this
   */
  get does() {
    return this;
  }

  /**
   * Negates the query on the field, cause it to match when the condition is
   * *not* met. Calling this multiple times will negate the negation.
   * @returns this
   */
  get not() {
    this.negate();
    return this;
  }

  abstract toString(): string;

  /** @internal */
  protected negate() {
    this.negated = !this.negated;
  }

  /** @internal */
  protected buildQuery(valuePortion: string): string {
    let negationPortion = this.negated ? '-' : '';
    let fieldPortion = this.field;
    return `(${negationPortion}@${fieldPortion}:${valuePortion})`;
  }
}

export default WhereField;
