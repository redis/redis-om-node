import { Search } from "./search"
import { WhereField } from "./where-field"

import { SemanticSearchError } from "../error"

export class WhereText extends WhereField {
  private value!: string
  private exactValue = false

  match(value: string | number | boolean): Search {
    this.value = value.toString()
    return this.search
  }

  matchExact(value: string | number | boolean): Search {
    this.exact.value = value.toString()
    return this.search
  }

  matches(value: string | number | boolean): Search { return this.match(value) }
  matchExactly(value: string | number | boolean): Search { return this.matchExact(value) }
  matchesExactly(value: string | number | boolean): Search { return this.matchExact(value) }

  get exact() {
    this.exactValue = true
    return this
  }

  get exactly() {
    return this.exact
  }

  eq(_: string | number | boolean): Search { return this.throwEqualsExcpetion() }
  equal(_: string | number | boolean): Search { return this.throwEqualsExcpetion() }
  equals(_: string | number | boolean): Search { return this.throwEqualsExcpetion() }
  equalTo(_: string | number | boolean): Search { return this.throwEqualsExcpetion() }

  toString(): string {
    const matchPunctuation = /[,.<>{}[\]"':;!@#$%^&()\-+=~|]/g
    const escapedValue = this.value.replace(matchPunctuation, '\\$&')

    if (this.exactValue) {
      return this.buildQuery(`"${escapedValue}"`)
    } else {
      return this.buildQuery(`'${escapedValue}'`)
    }
  }

  private throwEqualsExcpetion(): Search {
    throw new SemanticSearchError("Cannot call .equals on a field of type 'text', either use .match to perform full-text search or change the type to 'string' in the Schema.")
  }
}
