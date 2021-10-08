import Entity from "../entity/entity";
import Search from "./search";
import WhereField from "./where-field";

export default class WhereString<TEntity extends Entity> extends WhereField<TEntity> {
  private value!: string;

  eq(value: string): Search<TEntity> {
    this.value = value;
    return this.search;
  }

  equal(value: string): Search<TEntity> { return this.eq(value); }
  equals(value: string): Search<TEntity> { return this.eq(value); }
  equalTo(value: string): Search<TEntity> { return this.eq(value); }

  toString(): string {
    let matchPunctuation = /[,.<>{}[\]"':;!@#$%^&*()\-+=~| ]/g;
    let escapedValue = this.value.replace(matchPunctuation, '\\$&');
    return this.buildQuery(`{${escapedValue}}`);
  }
}
