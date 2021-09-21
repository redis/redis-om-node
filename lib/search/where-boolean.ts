import Entity from "../entity/entity";
import Search from "./search";
import Where from "./where";

export default class WhereBoolean<TEntity extends Entity> extends Where<TEntity> {
  private value?: boolean;

  isTrue(): Search<TEntity> {
    this.value = true;
    return this.search;
  }

  isFalse(): Search<TEntity> {
    this.value = false;
    return this.search;
  }

  toString(): string {
    return `@${this.field}:{${this.value ? '1' : '0'}}`
  }
}
