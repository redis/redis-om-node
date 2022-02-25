import Entity from "../entity/entity";
import { Search } from "./search";
import WhereField from "./where-field";

export abstract class WhereBoolean<TEntity extends Entity> extends WhereField<TEntity> {
  protected value!: boolean;

  eq(value: boolean): Search<TEntity> {
    this.value = value;
    return this.search;
  }

  equal(value: boolean): Search<TEntity> { return this.eq(value); }
  equals(value: boolean): Search<TEntity> { return this.eq(value); }
  equalTo(value: boolean): Search<TEntity> { return this.eq(value); }

  true(): Search<TEntity> { return this.eq(true); }
  false(): Search<TEntity> { return this.eq(false); }

  abstract toString(): string;
}

export class WhereHashBoolean<TEntity extends Entity> extends WhereBoolean<TEntity> {
  toString(): string {
    return this.buildQuery(`{${this.value ? '1' : '0'}}`);
  }
}

export class WhereJsonBoolean<TEntity extends Entity> extends WhereBoolean<TEntity> {
  toString(): string {
    return this.buildQuery(`{${this.value}}`);
  }
}
