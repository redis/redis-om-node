import { Entity } from "../entity"
import { Search } from "./search"
import { WhereField } from "./where-field"

export class WhereNumber<T extends Entity> extends WhereField<T> {
  private lower: number = Number.NEGATIVE_INFINITY
  private upper: number = Number.POSITIVE_INFINITY
  private lowerExclusive: boolean = false
  private upperExclusive: boolean = false

  eq(value: number): Search<T> {
    this.lower = value
    this.upper = value
    return this.search
  }

  gt(value: number): Search<T> {
    this.lower = value
    this.lowerExclusive = true
    return this.search
  }

  gte(value: number): Search<T> {
    this.lower = value
    return this.search
  }

  lt(value: number): Search<T> {
    this.upper = value
    this.upperExclusive = true
    return this.search
  }

  lte(value: number): Search<T> {
    this.upper = value
    return this.search
  }

  between(lower: number, upper: number): Search<T> {
    this.lower = lower
    this.upper = upper
    return this.search
  }

  equal(value: number): Search<T> { return this.eq(value) }
  equals(value: number): Search<T> { return this.eq(value) }
  equalTo(value: number): Search<T> { return this.eq(value) }

  greaterThan(value: number): Search<T> { return this.gt(value) }
  greaterThanOrEqualTo(value: number): Search<T> { return this.gte(value) }
  lessThan(value: number): Search<T> { return this.lt(value) }
  lessThanOrEqualTo(value: number): Search<T> { return this.lte(value) }

  toString(): string {
    const lower = this.makeLowerString()
    const upper = this.makeUpperString()
    return this.buildQuery(`[${lower} ${upper}]`)
  }

  private makeLowerString() {
    if (this.lower === Number.NEGATIVE_INFINITY) return '-inf'
    if (this.lowerExclusive) return `(${this.lower}`
    return this.lower.toString()
  }

  private makeUpperString() {
    if (this.upper === Number.POSITIVE_INFINITY) return '+inf'
    if (this.upperExclusive) return `(${this.upper}`
    return this.upper.toString()
  }
}
