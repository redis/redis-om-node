import Entity from "../entity/entity";
import Search from "./search";
import WhereField from "./where-field";

export default class WhereDate<TEntity extends Entity> extends WhereField<TEntity> {
  private lower: number = Number.NEGATIVE_INFINITY;
  private upper: number = Number.POSITIVE_INFINITY;
  private lowerExclusive: boolean = false;
  private upperExclusive: boolean = false;

  eq(value: Date): Search<TEntity> {
    this.lower = value.getTime();
    this.upper = value.getTime();
    return this.search;
  }

  gt(value: Date): Search<TEntity> {
    this.lower = value.getTime();
    this.lowerExclusive = true;
    return this.search;
  }

  gte(value: Date): Search<TEntity> {
    this.lower = value.getTime();
    return this.search;
  }

  lt(value: Date): Search<TEntity> {
    this.upper = value.getTime();
    this.upperExclusive = true;
    return this.search;
  }

  lte(value: Date): Search<TEntity> {
    this.upper = value.getTime();
    return this.search;
  }

  between(lower: Date, upper: Date): Search<TEntity> {
    this.lower = lower.getTime();
    this.upper = upper.getTime();
    return this.search;
  }

  equal(value: Date): Search<TEntity> { return this.eq(value); }
  equals(value: Date): Search<TEntity> { return this.eq(value); }
  equalTo(value: Date): Search<TEntity> { return this.eq(value); }

  greaterThan(value: Date): Search<TEntity> { return this.gt(value); }
  greaterThanOrEqualTo(value: Date): Search<TEntity> { return this.gte(value); }
  lessThan(value: Date): Search<TEntity> { return this.lt(value); }
  lessThanOrEqualTo(value: Date): Search<TEntity> { return this.lte(value); }

  on(value: Date): Search<TEntity> { return this.eq(value); }
  after(value: Date): Search<TEntity> { return this.gt(value); }
  before(value: Date): Search<TEntity> { return this.lt(value); }
  onOrAfter(value: Date): Search<TEntity> { return this.gte(value); }
  onOrBefore(value: Date): Search<TEntity> { return this.lte(value); }

  toString(): string {
    let lower = this.makeLowerString();
    let upper = this.makeUpperString();
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
