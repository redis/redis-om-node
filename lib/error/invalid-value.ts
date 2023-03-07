import { RedisOmError } from './redis-om-error'
import { Field } from '../schema'

export class InvalidValue extends RedisOmError {}

export class NullJsonValue extends InvalidValue {

  #field

  constructor(field: Field) {
    const message = `Null or undefined found in field '${field.name}' of type '${field.type}' from JSON path "${field.jsonPath}" in Redis.`
    super(message)
    this.#field = field
  }

  get fieldName() { return this.#field.name }
  get fieldType() { return this.#field.type }
  get jsonPath() { return this.#field.jsonPath }
}

export class InvalidJsonValue extends InvalidValue {

  #field

  constructor(field: Field) {
    const message = `Unexpected value for field '${field.name}' of type '${field.type}' from JSON path "${field.jsonPath}" in Redis.`
    super(message)
    this.#field = field
  }

  get fieldName() { return this.#field.name }
  get fieldType() { return this.#field.type }
  get jsonPath() { return this.#field.jsonPath }
}

export class InvalidHashValue extends InvalidValue {

  #field

  constructor(field: Field) {
    const message = `Unexpected value for field '${field.name}' of type '${field.type}' from Hash field "${field.hashField}" read from Redis.`
    super(message)
    this.#field = field
  }

  get fieldName() { return this.#field.name }
  get fieldType() { return this.#field.type }
  get hashField() { return this.#field.hashField }
}
