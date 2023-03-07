import { Search } from "./search"
import { WhereField } from "./where-field"

export abstract class WhereBoolean extends WhereField {
  protected value!: boolean

  eq(value: boolean): Search {
    this.value = value
    return this.search
  }

  equal(value: boolean): Search { return this.eq(value) }
  equals(value: boolean): Search { return this.eq(value) }
  equalTo(value: boolean): Search { return this.eq(value) }

  true(): Search { return this.eq(true) }
  false(): Search { return this.eq(false) }

  abstract toString(): string
}

export class WhereHashBoolean extends WhereBoolean {
  toString(): string {
    return this.buildQuery(`{${this.value ? '1' : '0'}}`)
  }
}

export class WhereJsonBoolean extends WhereBoolean {
  toString(): string {
    return this.buildQuery(`{${this.value}}`)
  }
}
