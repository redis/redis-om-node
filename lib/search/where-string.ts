import Entity from "../entity/entity";
import Search from "./search";
import WhereField from "./where-field";

export default class WhereString<TEntity extends Entity> extends WhereField<TEntity> {
  private value?: string;

  is(value: string): Search<TEntity> {
    this.value = value;
    return this.search;
  }

  toString(): string {
    let matchPunctuation = /[,.<>{}[\]"':;!@#$%^&*()\-+=~| ]/g;
    let escapedValue = this.value?.replace(matchPunctuation, '\\$&');
    return `@${this.field}:{${escapedValue}}`;
  }
}
