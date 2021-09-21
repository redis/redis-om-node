import Entity from "../entity/entity";
import Search from "./search";
import Where from "./where";

export default class WhereString<TEntity extends Entity> extends Where<TEntity> {
  private value?: string;

  is(value: string): Search<TEntity> {
    this.value = value;
    return this.search;
  }

  toString(): string {
    let matchPunctuation = /[,.<>{}[\]"':;!@#$%^&*()\-+=~ ]/g;
    let escapedValue = this.value?.replace(matchPunctuation, '\\$&');
    return `@${this.field}:{${escapedValue}}`;
  }
}
