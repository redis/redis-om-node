import { Entity } from "../entity"
import { Search } from "./search"
import { WhereField } from "./where-field"

import { SemanticSearchError } from "../error"

export class WhereText<T extends Entity> extends WhereField<T> {
  private value!: string
  private exactValue = false
  private fuzzyMatching!: boolean
  private levenshteinDistance!: number

  match(
    value: string | number | boolean,
    options: { fuzzyMatching?: boolean; levenshteinDistance?: 1 | 2 | 3 } = {
      fuzzyMatching: false,
      levenshteinDistance: 1,
    }
  ): Search<T> {
    this.value = value.toString()
    this.fuzzyMatching = options.fuzzyMatching ?? false
    this.levenshteinDistance = options.levenshteinDistance ?? 1
    return this.search
  }

  matchExact(value: string | number | boolean): Search<T> {
    this.exact.value = value.toString()
    return this.search
  }

  matches(
    value: string | number | boolean,
    options: { fuzzyMatching?: boolean; levenshteinDistance?: 1 | 2 | 3 } = {
      fuzzyMatching: false,
      levenshteinDistance: 1,
    }
  ): Search<T> { return this.match(value, options) }
  matchExactly(value: string | number | boolean): Search<T> { return this.matchExact(value) }
  matchesExactly(value: string | number | boolean): Search<T> { return this.matchExact(value) }

  get exact() {
    this.exactValue = true
    return this
  }

  get exactly() {
    return this.exact
  }

  eq(_: string | number | boolean): Search<T> { return this.throwEqualsExcpetion() }
  equal(_: string | number | boolean): Search<T> { return this.throwEqualsExcpetion() }
  equals(_: string | number | boolean): Search<T> { return this.throwEqualsExcpetion() }
  equalTo(_: string | number | boolean): Search<T> { return this.throwEqualsExcpetion() }

  toString(): string {
    const escapedValue = this.escapePunctuation(this.value)

    if (this.exactValue) {
      return this.buildQuery(`"${escapedValue}"`)
    } else if (this.fuzzyMatching) {
      return this.buildQuery(`${"%".repeat(this.levenshteinDistance)}${escapedValue}${"%".repeat(this.levenshteinDistance)}`);
    } else {
      return this.buildQuery(`'${escapedValue}'`)
    }
  }

  private throwEqualsExcpetion(): Search<T> {
    throw new SemanticSearchError("Cannot call .equals on a field of type 'text', either use .match to perform full-text search or change the type to 'string' in the Schema.")
  }
}
