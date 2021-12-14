import Entity from "../entity/entity";
import Search from "./search";
import WhereField from "./where-field";

export default class WhereText<TEntity extends Entity> extends WhereField<TEntity> {
  private value!: string;
  private exactValue = false;

  match(value: string): Search<TEntity> {
    this.value = value;
    return this.search;
  }

  matchExact(value: string): Search<TEntity> {
    this.exact.value = value
    return this.search;
  }

  matches(value: string): Search<TEntity> { return this.match(value); }
  matchExactly(value: string): Search<TEntity> { return this.matchExact(value); }
  matchesExactly(value: string): Search<TEntity> { return this.matchExact(value); }

  get exact() {
    this.exactValue = true
    this.search.noStopWords()
    return this;
  }

  get exactly() {
    return this.exact;
  }

  toString(): string {
    let matchPunctuation = /[,.<>{}[\]"':;!@#$%^&*()\-+=~|]/g;
    let escapedValue = this.value.replace(matchPunctuation, '\\$&');

    if (this.exactValue) {
      return this.buildQuery(`"${escapedValue}"`);
    } else {
      return this.buildQuery(`'${escapedValue}'`);
    }
  }
}
