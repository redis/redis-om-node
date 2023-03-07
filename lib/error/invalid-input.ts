import { RedisOmError } from './redis-om-error'
import { Field } from '../schema'

export class InvalidInput extends RedisOmError {}

export class NullJsonInput extends InvalidInput {

  #field

  constructor(field: Field) {
    const message = `Null or undefined found in field '${field.name}' of type '${field.type}' in JSON at "${field.jsonPath}".`
    super(message)
    this.#field = field
  }

  get fieldName() { return this.#field.name }
  get fieldType() { return this.#field.type }
  get jsonPath() { return this.#field.jsonPath }
}

export class InvalidJsonInput extends InvalidInput {

  #field

  constructor(field: Field) {
    const message = `Unexpected value for field '${field.name}' of type '${field.type}' in JSON at "${field.jsonPath}".`
    super(message)
    this.#field = field
  }

  get fieldName() { return this.#field.name }
  get fieldType() { return this.#field.type }
  get jsonPath() { return this.#field.jsonPath }
}

export class InvalidHashInput extends InvalidInput {

  #field

  constructor(field: Field) {
    const message = `Unexpected value for field '${field.name}' of type '${field.type}' in Hash.`
    super(message)
    this.#field = field
  }

  get fieldName() { return this.#field.name }
  get fieldType() { return this.#field.type }
}

export class NestedHashInput extends InvalidInput {

  #property

  constructor(property: string) {
    const message = `Unexpected object in Hash at property '${property}'. You can not store a nested object in a Redis Hash.`
    super(message)
    this.#property = property
  }

  get field() { return this.#property }
}

export class ArrayHashInput extends InvalidInput {

  #property

  constructor(property: string) {
    const message = `Unexpected array in Hash at property '${property}'. You can not store an array in a Redis Hash without defining it in the Schema.`
    super(message)
    this.#property = property
  }

  get field() { return this.#property }
}
