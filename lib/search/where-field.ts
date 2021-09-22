import Entity from "../entity/entity";
import Search from "./search";
import Where from "./where";

interface WhereField<TEntity> extends Where {
  isTrue(): Search<TEntity>;
  isFalse(): Search<TEntity>;
  is(value: string): Search<TEntity>;
  equals(value: number): Search<TEntity>;
  greaterThan(value: number): Search<TEntity>;
  greaterThanEqual(value: number): Search<TEntity>;
  lessThan(value: number): Search<TEntity>;
  lessThanEqual(value: number): Search<TEntity>;
  inRange(bottom: number, top: number): Search<TEntity>;
  inRangeExclusive(bottom: number, top: number): Search<TEntity>;
  contains(value: string): Search<TEntity>;
  containsOneOf(...value: string[]): Search<TEntity>;
}

abstract class WhereField<TEntity extends Entity> {
  protected search: Search<TEntity>;
  protected field: String;

  constructor(search: Search<TEntity>, field: string) {
    this.search = search;
    this.field = field;
  }

  abstract toString(): string;
}

export default WhereField;
