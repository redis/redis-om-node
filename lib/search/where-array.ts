import Entity from "../entity/entity";
import Search from "./search";
import WhereField from "./where-field";

export default class WhereArray<TEntity extends Entity> extends WhereField<TEntity> {
  private value?: string[];

  contains(value: string): Search<TEntity> {
    this.value = [value];
    return this.search;
  }

  containsOneOf(...value: string[]): Search<TEntity> {
    this.value = value;
    return this.search;
  }

  toString(): string {
    let matchPunctuation = /[,.<>{}[\]"':;!@#$%^&*()\-+=~| ]/g;
    let escapedValue = this.value?.map(s => s.replace(matchPunctuation, '\\$&')).join('|');

    return `@${this.field}:{${escapedValue}}`
  }
}
