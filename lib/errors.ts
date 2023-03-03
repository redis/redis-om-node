import { Point } from "./entity"
import { Field } from "./schema"

export class RedisOmError extends Error {}

export class InvalidSchema extends RedisOmError {}

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


export class SearchError extends RedisOmError {}

export class SemanticSearchError extends SearchError {}

export class FieldNotInSchema extends SearchError {

  #fieldName

  constructor(fieldName: string) {
    super(`The field '${fieldName}' is not part of the schema and thus cannot be used to search.`)
    this.#fieldName = fieldName
  }

  get fieldName() {
    return this.#fieldName
  }

}

export class PointOutOfRange extends RedisOmError {

  #latitude
  #longitude

  constructor(point: Point) {
    super("Points must be between ±85.05112878 latitude and ±180 longitude")
    this.#longitude = point.longitude
    this.#latitude = point.latitude
  }

  get point() {
    return { longitude: this.#longitude, latitude: this.#latitude }
  }
}