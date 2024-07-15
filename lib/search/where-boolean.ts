import { Entity } from "../entity"
import { Search } from "./search"
import { WhereField } from "./where-field"

export abstract class WhereBoolean<T extends Entity> extends WhereField<T> {
  protected value!: boolean

  eq(value: boolean): Search<T> {
    this.value = value
    return this.search
  }

  equal(value: boolean): Search<T> { return this.eq(value) }
  equals(value: boolean): Search<T> { return this.eq(value) }
  equalTo(value: boolean): Search<T> { return this.eq(value) }

  true(): Search<T> { return this.eq(true) }
  false(): Search<T> { return this.eq(false) }

  abstract toString(): string
}

export class WhereHashBoolean<T extends Entity> extends WhereBoolean<T> {
  toString(): string {
    return this.buildQuery(`{${this.value ? '1' : '0'}}`)
  }
}

export class WhereJsonBoolean<T extends Entity> extends WhereBoolean<T> {
  toString(): string {
    return this.buildQuery(`{${this.value}}`)
  }
}
