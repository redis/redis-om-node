import { Search } from "./search"
import { WhereField } from "./where-field"
import { SemanticSearchError } from "../error"

export class WhereString extends WhereField {
  private value!: string

  eq(value: string | number | boolean): Search {
    this.value = value.toString()
    return this.search
  }

  equal(value: string | number | boolean): Search { return this.eq(value) }
  equals(value: string | number | boolean): Search { return this.eq(value) }
  equalTo(value: string | number | boolean): Search { return this.eq(value) }

  match(_: string | number | boolean): Search { return this.throwMatchExcpetion() }
  matches(_: string | number | boolean): Search { return this.throwMatchExcpetion() }
  matchExact(_: string | number | boolean): Search { return this.throwMatchExcpetion() }
  matchExactly(_: string | number | boolean): Search { return this.throwMatchExcpetion() }
  matchesExactly(_: string | number | boolean): Search { return this.throwMatchExcpetion() }

  get exact() { return this.throwMatchExcpetionReturningThis() }
  get exactly() { return this.throwMatchExcpetionReturningThis() }

  toString(): string {
    const matchPunctuation = /[,.<>{}[\]"':;!@#$%^&()\-+=~|/\\ ]/g
    const escapedValue = this.value.replace(matchPunctuation, '\\$&')
    return this.buildQuery(`{${escapedValue}}`)
  }

  private throwMatchExcpetion(): Search {
    throw new SemanticSearchError("Cannot perform full-text search operations like .match on field of type 'string'. If full-text search is needed on this field, change the type to 'text' in the Schema.")
  }

  private throwMatchExcpetionReturningThis(): WhereString {
    throw new SemanticSearchError("Cannot perform full-text search operations like .match on field of type 'string'. If full-text search is needed on this field, change the type to 'text' in the Schema.")
  }
}
