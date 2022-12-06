import { Search } from "./search"
import { WhereField } from "./where-field"

export class WhereDate extends WhereField {
  private lower: number = Number.NEGATIVE_INFINITY
  private upper: number = Number.POSITIVE_INFINITY
  private lowerExclusive: boolean = false
  private upperExclusive: boolean = false

  eq(value: Date | number | string): Search {
    const epoch = this.coerceDateToEpoch(value)
    this.lower = epoch
    this.upper = epoch
    return this.search
  }

  gt(value: Date | number | string): Search {
    const epoch = this.coerceDateToEpoch(value)
    this.lower = epoch
    this.lowerExclusive = true
    return this.search
  }

  gte(value: Date | number | string): Search {
    this.lower = this.coerceDateToEpoch(value)
    return this.search
  }

  lt(value: Date | number | string): Search {
    this.upper = this.coerceDateToEpoch(value)
    this.upperExclusive = true
    return this.search
  }

  lte(value: Date | number | string): Search {
    this.upper = this.coerceDateToEpoch(value)
    return this.search
  }

  between(lower: Date | number | string, upper: Date | number | string): Search {
    this.lower = this.coerceDateToEpoch(lower)
    this.upper = this.coerceDateToEpoch(upper)
    return this.search
  }

  equal(value: Date | number | string): Search { return this.eq(value) }
  equals(value: Date | number | string): Search { return this.eq(value) }
  equalTo(value: Date | number | string): Search { return this.eq(value) }

  greaterThan(value: Date | number | string): Search { return this.gt(value) }
  greaterThanOrEqualTo(value: Date | number | string): Search { return this.gte(value) }
  lessThan(value: Date | number | string): Search { return this.lt(value) }
  lessThanOrEqualTo(value: Date | number | string): Search { return this.lte(value) }

  on(value: Date | number | string): Search { return this.eq(value) }
  after(value: Date | number | string): Search { return this.gt(value) }
  before(value: Date | number | string): Search { return this.lt(value) }
  onOrAfter(value: Date | number | string): Search { return this.gte(value) }
  onOrBefore(value: Date | number | string): Search { return this.lte(value) }

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

  private coerceDateToEpoch(value: Date | number | string) {
    if (value instanceof Date) return value.getTime() / 1000
    if (typeof value === 'string') return new Date(value).getTime() / 1000
    return value
  }
}
