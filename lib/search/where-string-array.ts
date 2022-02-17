import Entity from "../entity/entity";
import { Search } from "./search";
import WhereField from "./where-field";

export default class WhereStringArray<TEntity extends Entity> extends WhereField<TEntity> {
  private value!: string[];

  contain(value: string): Search<TEntity> {
    this.value = [value];
    return this.search;
  }

  contains(value: string): Search<TEntity> { return this.contain(value); }

  containsOneOf(...value: string[]): Search<TEntity> {
    this.value = value;
    return this.search;
  }

  containOneOf(...value: string[]): Search<TEntity> { return this.containsOneOf(...value); }

  toString(): string {
    let matchPunctuation = /[,.<>{}[\]"':;!@#$%^&*()\-+=~| ]/g;
    let escapedValue = this.value.map(s => s.replace(matchPunctuation, '\\$&')).join('|');
    return this.buildQuery(`{${escapedValue}}`);
  }
}
