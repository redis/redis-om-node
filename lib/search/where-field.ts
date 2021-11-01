import Entity from "../entity/entity";
import Search from "./search";
import Where from "./where";

/**
 * Interface with all the methods from all the concrete
 * classes under {@link WhereField}.
 */
interface WhereField<TEntity> extends Where {

  /**
   * Adds an equals comparisson to the query.
   * @param value The value to be compared
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  eq(value: string | number | boolean): Search<TEntity>;

  /**
   * Adds an equals comparisson to the query.
   * @param value The value to be compared
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  equal(value: string | number | boolean): Search<TEntity>;

  /**
   * Adds an equals comparisson to the query.
   * @param value The value to be compared
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  equals(value: string | number | boolean): Search<TEntity>;

  /**
   * Adds an equals comparisson to the query.
   * @param value The value to be compared
   * @returns The {@link Search} that was called to create this {@link WhereField}.
   */
  equalTo(value: string | number | boolean): Search<TEntity>;

  match(value: string): Search<TEntity>;
  matches(value: string): Search<TEntity>;
  matchExact(value: string): Search<TEntity>;
  matchExactly(value: string): Search<TEntity>;
  matchesExactly(value: string): Search<TEntity>;

  readonly exact: WhereField<TEntity>;
  readonly exactly: WhereField<TEntity>;

  true(): Search<TEntity>;
  false(): Search<TEntity>;

  gt(value: number): Search<TEntity>;
  greaterThan(value: number): Search<TEntity>;

  gte(value: number): Search<TEntity>;
  greaterThanOrEqualTo(value: number): Search<TEntity>;

  lt(value: number): Search<TEntity>;
  lessThan(value: number): Search<TEntity>;

  lte(value: number): Search<TEntity>;
  lessThanOrEqualTo(value: number): Search<TEntity>;

  between(lower: number, upper: number): Search<TEntity>;

  contain(value: string): Search<TEntity>;
  contains(value: string): Search<TEntity>;

  containAllOf(...value: string[]): Search<TEntity>;
  containsAllOf(...value: string[]): Search<TEntity>;

  containOneOf(...value: string[]): Search<TEntity>;
  containsOneOf(...value: string[]): Search<TEntity>;
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
