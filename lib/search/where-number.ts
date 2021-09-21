import Entity from "../entity/entity";
import Search from "./search";
import Where from "./where";

export default class WhereNumber<TEntity extends Entity> extends Where<TEntity> {
  private bottom: number = Number.NEGATIVE_INFINITY;
  private top: number = Number.POSITIVE_INFINITY;
  private exclusive: boolean = false;

  equals(value: number): Search<TEntity> {
    this.bottom = value;
    this.top = value;
    return this.search;
  }

  greaterThan(value: number): Search<TEntity> {
    this.bottom = value;
    this.exclusive = true;
    return this.search;
  }

  greaterThanEqual(value: number): Search<TEntity> {
    this.bottom = value;
    return this.search;
  }

  lessThan(value: number): Search<TEntity> {
    this.top = value;
    this.exclusive = true;
    return this.search;
  }

  lessThanEqual(value: number): Search<TEntity> {
    this.top = value;
    return this.search;
  }

  inRange(bottom: number, top: number): Search<TEntity> {
    this.bottom = bottom;
    this.top = top;
    return this.search;
  }

  inRangeExclusive(bottom: number, top: number): Search<TEntity> {
    this.bottom = bottom;
    this.top = top;
    this.exclusive = true;
    return this.search;
  }

  toString(): string {
    let bottom = this.makeBottomString();
    let top = this.makeTopString();
    return `@${this.field}:[${bottom} ${top}]`
  }

  private makeBottomString() {
    if (this.bottom === Number.NEGATIVE_INFINITY) return '-inf';
    if (this.exclusive) return `(${this.bottom}`;
    return this.bottom.toString()
  }

  private makeTopString() {
    if (this.top === Number.POSITIVE_INFINITY) return '+inf';
    if (this.exclusive) return `(${this.top}`;
    return this.top.toString()
  }
}
