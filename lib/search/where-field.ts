import { Entity } from "../entity"
import { Field } from "../schema"
import { Search } from "./search"
import { Where } from "./where"
import { CircleFunction } from "./where-point"

/**
 * Interface with all the methods from all the concrete
 * classes under {@link WhereField}.
 */
export interface WhereField<T extends Entity = Record<string, any>> extends Where {

  /**
   * Adds an equals comparison to the query.
   *
   * NOTE: this function is not available for strings where full-text
   * search is enabled. In that scenario, use `.match`.
   * @param value The value to be compared
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  eq(value: string | number | boolean | Date): Search<T>

  /**
   * Adds an equals comparison to the query.
   *
   * NOTE: this function is not available for strings where full-text
   * search is enabled. In that scenario, use `.match`.
   * @param value The value to be compared
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  equal(value: string | number | boolean | Date): Search<T>

  /**
   * Adds an equals comparison to the query.
   *
   * NOTE: this function is not available for strings where full-text
   * search is enabled. In that scenario, use `.match`.
   * @param value The value to be compared
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  equals(value: string | number | boolean | Date): Search<T>

  /**
   * Adds an equals comparison to the query.
   *
   * NOTE: this function is not available for strings where full-text
   * search is enabled. In that scenario, use `.match`.
   * @param value The value to be compared
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  equalTo(value: string | number | boolean | Date): Search<T>

  /**
   * Adds a full-text search comparison to the query.
   * @param value The word or phrase sought.
   * @param options
   * @param options.fuzzyMatching Whether to use fuzzy matching to find the sought word or phrase. Defaults to `false`.
   * @param options.levenshteinDistance The levenshtein distance to use for fuzzy matching. Supported values are `1`, `2`, and `3`. Defaults to `1`.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  match(value: string | number | boolean, options?: { fuzzyMatching?: boolean; levenshteinDistance?: 1 | 2 | 3 }): Search<T>

  /**
   * Adds a full-text search comparison to the query.
   * @param value The word or phrase sought.
   * @param options
   * @param options.fuzzyMatching Whether to use fuzzy matching to find the sought word or phrase. Defaults to `false`.
   * @param options.levenshteinDistance The levenshtein distance to use for fuzzy matching. Supported values are `1`, `2`, and `3`. Defaults to `1`.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  matches(value: string | number | boolean, options?: { fuzzyMatching?: boolean; levenshteinDistance?: 1 | 2 | 3 }): Search<T>

  /**
   * Adds a full-text search comparison to the query that matches an exact word or phrase.
   * @param value The word or phrase sought.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  matchExact(value: string | number | boolean): Search<T>

  /**
   * Adds a full-text search comparison to the query that matches an exact word or phrase.
   * @param value The word or phrase sought.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  matchExactly(value: string | number | boolean): Search<T>

  /**
   * Adds a full-text search comparison to the query that matches an exact word or phrase.
   * @param value The word or phrase sought.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  matchesExactly(value: string | number | boolean): Search<T>

  /**
   * Makes a call to {@link WhereField.match} a {@link WhereField.matchExact} call. Calling
   * this multiple times will have no effect.
   * @returns this.
   */
  readonly exact: WhereField<T>

  /**
   * Makes a call to {@link WhereField.match} a {@link WhereField.matchExact} call. Calling
   * this multiple times will have no effect.
   * @returns this.
   */
  readonly exactly: WhereField<T>

  /**
   * Adds a boolean match with a value of `true` to the query.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  true(): Search<T>

  /**
   * Adds a boolean match with a value of `false` to the query.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  false(): Search<T>

  /**
   * Adds a greater than comparison against a field to the search query.
   * @param value The value to compare against.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  gt(value: string | number | Date): Search<T>

  /**
   * Adds a greater than comparison against a field to the search query.
   * @param value The value to compare against.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  greaterThan(value: string | number | Date): Search<T>

  /**
   * Adds a greater than or equal to comparison against a field to the search query.
   * @param value The value to compare against.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  gte(value: string | number | Date): Search<T>

  /**
   * Adds a greater than or equal to comparison against a field to the search query.
   * @param value The value to compare against.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  greaterThanOrEqualTo(value: string | number | Date): Search<T>

  /**
   * Adds a less than comparison against a field to the search query.
   * @param value The value to compare against.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  lt(value: string | number | Date): Search<T>

  /**
   * Adds a less than comparison against a field to the search query.
   * @param value The value to compare against.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  lessThan(value: string | number | Date): Search<T>

  /**
   * Adds a less than or equal to comparison against a field to the search query.
   * @param value The value to compare against.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  lte(value: string | number | Date): Search<T>

  /**
   * Adds a less than or equal to comparison against a field to the search query.
   * @param value The value to compare against.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  lessThanOrEqualTo(value: string | number | Date): Search<T>

  /**
   * Adds an inclusive range comparison against a field to the search query.
   * @param lower The lower bound of the range.
   * @param upper The upper bound of the range.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  between(lower: string | number | Date, upper: string | number | Date): Search<T>

  /**
   * Adds a whole-string match for a value within a string array to the search query.
   * @param value The string to be matched.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  contain(value: string): Search<T>

  /**
   * Adds a whole-string match for a value within a string array to the search query.
   * @param value The string to be matched.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  contains(value: string): Search<T>

  /**
   * Adds a whole-string match against a string array to the query. If any of the provided
   * strings in `value` is matched in the array, this matched.
   * @param value An array of strings that you want to match one of.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  containOneOf(...value: Array<string>): Search<T>

  /**
   * Adds a whole-string match against a string array to the query. If any of the provided
   * strings in `value` is matched in the array, this matched.
   * @param value An array of strings that you want to match one of.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  containsOneOf(...value: Array<string>): Search<T>

  /**
   * Adds a search for points that fall within a defined circle.
   * @param circleFn A function that returns a {@link Circle} instance defining the search area.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  inCircle(circleFn: CircleFunction): Search<T>

  /**
   * Adds a search for points that fall within a defined radius.
   * @param circleFn A function that returns a {@link Circle} instance defining the search area.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  inRadius(circleFn: CircleFunction): Search<T>

  /**
   * Add a search for an exact UTC datetime to the query.
   * @param value The datetime to match.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  on(value: string | number | Date): Search<T>

  /**
   * Add a search that matches all datetimes *before* the provided UTC datetime to the query.
   * @param value The datetime to compare against.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  before(value: string | number | Date): Search<T>

  /**
   * Add a search that matches all datetimes *after* the provided UTC datetime to the query.
   * @param value The datetime to compare against.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  after(value: string | number | Date): Search<T>

  /**
   * Add a search that matches all datetimes *on or before* the provided UTC datetime to the query.
   * @param value The datetime to compare against.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  onOrBefore(value: string | number | Date): Search<T>

  /**
   * Add a search that matches all datetimes *on or after* the provided UTC datetime to the query.
   * @param value The datetime to compare against.
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  onOrAfter(value: string | number | Date): Search<T>
}

/**
 * Abstract base class that all fields you want to filter
 * with extend. When you call {@link Search.where}, a
 * subclass of this is returned.
 */
export abstract class WhereField<T extends Entity> {
  private negated: boolean = false

  /** @internal */
  protected search: Search<T>

  /** @internal */
  protected field: Field

  /** @internal */
  constructor(search: Search<T>, field: Field) {
    this.search = search
    this.field = field
  }

  /**
   * Returns the current instance. Syntactic sugar to make your code more fluent.
   * @returns this
   */
  get is() {
    return this
  }

  /**
   * Returns the current instance. Syntactic sugar to make your code more fluent.
   * @returns this
   */
  get does() {
    return this
  }

  /**
   * Negates the query on the field, cause it to match when the condition is
   * *not* met. Calling this multiple times will negate the negation.
   * @returns this
   */
  get not() {
    this.negate()
    return this
  }

  abstract toString(): string

  /** @internal */
  protected negate() {
    this.negated = !this.negated
  }

  /** @internal */
  protected buildQuery(valuePortion: string): string {
    const negationPortion = this.negated ? '-' : ''
    const fieldPortion = this.escapePunctuationAndSpaces(this.field.name)
    return `(${negationPortion}@${fieldPortion}:${valuePortion})`
  }

  /** @internal */
  protected escapePunctuation(value: string): string {
    const matchPunctuation = /[,.?<>{}[\]"':;!@#$%^&()\-+=~|/\\]/g
    return value.replace(matchPunctuation, '\\$&')
  }

  /** @internal */
  protected escapePunctuationAndSpaces(value: string): string {
    const matchPunctuation = /[,.?<>{}[\]"':;!@#$%^&()\-+=~|/\\ ]/g
    return value.replace(matchPunctuation, '\\$&')
  }
}
