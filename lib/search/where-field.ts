import Entity from "../entity/entity";
import Search from "./search";
import Where from "./where";

interface WhereField<TEntity> extends Where {
  
  eq(value: string | number | boolean): Search<TEntity>;
  equal(value: string | number | boolean): Search<TEntity>;
  equals(value: string | number | boolean): Search<TEntity>;
  equalTo(value: string | number | boolean): Search<TEntity>;
  
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

abstract class WhereField<TEntity extends Entity> {
  private negated: boolean = false;

  protected search: Search<TEntity>;
  protected field: String;

  constructor(search: Search<TEntity>, field: string) {
    this.search = search;
    this.field = field;
  }

  get is() {
    return this;
  }

  get does() {
    return this;
  }

  get not() {
    this.negate();
    return this;
  }

  abstract toString(): string;

  protected negate() {
    this.negated = !this.negated;
  }

  protected buildQuery(valuePortion: string): string {
    let negationPortion = this.negated ? '-' : '';
    let fieldPortion = this.field;
    return `(${negationPortion}@${fieldPortion}:${valuePortion})`;
  }
}

export default WhereField;
