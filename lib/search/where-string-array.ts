import Entity from "../entity/entity";
import { Search } from "./search";
import WhereField from "./where-field";

export default class WhereStringArray<TEntity extends Entity> extends WhereField<TEntity> {
  private value!: Array<string>;

  contain(value: string): Search<TEntity> {
    this.value = [value];
    return this.search;
  }

  contains(value: string): Search<TEntity> { return this.contain(value); }

  containsOneOf(...value: Array<string>): Search<TEntity> {
    this.value = value;
    return this.search;
  }

  containOneOf(...value: Array<string>): Search<TEntity> { return this.containsOneOf(...value); }

  toString(): string {
    const matchPunctuation = /[,.<>{}[\]"':;!@#$%^&*()\-+=~| ]/g;
    const escapedValue = this.value.map(s => s.replace(matchPunctuation, '\\$&')).join('|');
    return this.buildQuery(`{${escapedValue}}`);
  }
}
