import Entity from "../entity/entity";
import { Search } from "./search";
import WhereField from "./where-field";

import RedisError from "../errors";

export default class WhereText<TEntity extends Entity> extends WhereField<TEntity> {
  private value!: string;
  private exactValue = false;

  match(value: string | number | boolean): Search<TEntity> {
    this.value = value.toString();
    return this.search;
  }

  matchExact(value: string | number | boolean): Search<TEntity> {
    this.exact.value = value.toString()
    return this.search;
  }

  matches(value: string | number | boolean): Search<TEntity> { return this.match(value); }
  matchExactly(value: string | number | boolean): Search<TEntity> { return this.matchExact(value); }
  matchesExactly(value: string | number | boolean): Search<TEntity> { return this.matchExact(value); }

  get exact() {
    this.exactValue = true
    return this;
  }

  get exactly() {
    return this.exact;
  }

  eq(_: string | number | boolean): Search<TEntity> { return this.throwEqualsExcpetion(); }
  equal(_: string | number | boolean): Search<TEntity> { return this.throwEqualsExcpetion(); }
  equals(_: string | number | boolean): Search<TEntity> { return this.throwEqualsExcpetion(); }
  equalTo(_: string | number | boolean): Search<TEntity> { return this.throwEqualsExcpetion(); }

  toString(): string {
    const matchPunctuation = /[,.<>{}[\]"':;!@#$%^&()\-+=~|]/g;
    const escapedValue = this.value.replace(matchPunctuation, '\\$&');

    if (this.exactValue) {
      return this.buildQuery(`"${escapedValue}"`);
    } else {
      return this.buildQuery(`'${escapedValue}'`);
    }
  }

  private throwEqualsExcpetion(): Search<TEntity> {
    throw new RedisError("Cannot call .equals on a field of type 'text', either use .match to perform full-text search or change the type to 'string' in the Schema.");
  }
}
