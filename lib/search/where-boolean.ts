import Entity from "../entity/entity";
import Search from "./search";
import WhereField from "./where-field";

export default class WhereBoolean<TEntity extends Entity> extends WhereField<TEntity> {
  private value?: boolean;

  eq(value: boolean): Search<TEntity> {
    this.value = value;
    return this.search;
  }

  equal(value: boolean): Search<TEntity> { return this.eq(value); }
  equals(value: boolean): Search<TEntity> { return this.eq(value); }
  equalTo(value: boolean): Search<TEntity> { return this.eq(value); }

  true(): Search<TEntity> { return this.eq(true); }
  false(): Search<TEntity> { return this.eq(false); }

  toString(): string {
    return this.buildQuery(`{${this.value ? '1' : '0'}}`);
  }
}
