import { Entity } from "../entity"
import { Search } from "./search"
import { WhereField } from "./where-field"

export class WhereStringArray<T extends Entity> extends WhereField<T> {
  private value!: Array<string>

  contain(value: string): Search<T> {
    this.value = [value]
    return this.search
  }

  contains(value: string): Search<T> { return this.contain(value) }

  containsOneOf(...value: Array<string>): Search<T> {
    this.value = value
    return this.search
  }

  containOneOf(...value: Array<string>): Search<T> { return this.containsOneOf(...value) }

  toString(): string {
    const escapedValue = this.value.map(s => this.escapePunctuationAndSpaces(s)).join('|')
    return this.buildQuery(`{${escapedValue}}`)
  }
}
