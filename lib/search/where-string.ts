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
    return `@${this.field}:{${this.value}}`
  }
}
