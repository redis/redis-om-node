import { Search } from "./search"
import { WhereField } from "./where-field"

export class WhereStringArray extends WhereField {
  private value!: Array<string>

  contain(value: string): Search {
    this.value = [value]
    return this.search
  }

  contains(value: string): Search { return this.contain(value) }

  containsOneOf(...value: Array<string>): Search {
    this.value = value
    return this.search
  }

  containOneOf(...value: Array<string>): Search { return this.containsOneOf(...value) }

  toString(): string {
    const matchPunctuation = /[,.<>{}[\]"':;!@#$%^&()\-+=~| ]/g
    const escapedValue = this.value.map(s => s.replace(matchPunctuation, '\\$&')).join('|')
    return this.buildQuery(`{${escapedValue}}`)
  }
}
