import Entity from "../entity/entity";
import { Search } from "./search";
import WhereField from "./where-field";

export default class WhereNumber<TEntity extends Entity> extends WhereField<TEntity> {
  private lower: number = Number.NEGATIVE_INFINITY;
  private upper: number = Number.POSITIVE_INFINITY;
  private lowerExclusive: boolean = false;
  private upperExclusive: boolean = false;

  eq(value: number): Search<TEntity> {
    this.lower = value;
    this.upper = value;
    return this.search;
  }

  gt(value: number): Search<TEntity> {
    this.lower = value;
    this.lowerExclusive = true;
    return this.search;
  }

  gte(value: number): Search<TEntity> {
    this.lower = value;
    return this.search;
  }

  lt(value: number): Search<TEntity> {
    this.upper = value;
    this.upperExclusive = true;
    return this.search;
  }

  lte(value: number): Search<TEntity> {
    this.upper = value;
    return this.search;
  }

  between(lower: number, upper: number): Search<TEntity> {
    this.lower = lower;
    this.upper = upper;
    return this.search;
  }

  equal(value: number): Search<TEntity> { return this.eq(value); }
  equals(value: number): Search<TEntity> { return this.eq(value); }
  equalTo(value: number): Search<TEntity> { return this.eq(value); }

  greaterThan(value: number): Search<TEntity> { return this.gt(value); }
  greaterThanOrEqualTo(value: number): Search<TEntity> { return this.gte(value); }
  lessThan(value: number): Search<TEntity> { return this.lt(value); }
  lessThanOrEqualTo(value: number): Search<TEntity> { return this.lte(value); }

  toString(): string {
    const lower = this.makeLowerString();
    const upper = this.makeUpperString();
    return this.buildQuery(`[${lower} ${upper}]`);
  }

  private makeLowerString() {
    if (this.lower === Number.NEGATIVE_INFINITY) return '-inf';
    if (this.lowerExclusive) return `(${this.lower}`;
    return this.lower.toString()
  }

  private makeUpperString() {
    if (this.upper === Number.POSITIVE_INFINITY) return '+inf';
    if (this.upperExclusive) return `(${this.upper}`;
    return this.upper.toString()
  }
}
