import { RedisOmError } from './redis-om-error'

export class SearchError extends RedisOmError {}

export class SemanticSearchError extends SearchError {}

export class FieldNotInSchema extends SearchError {

  #field

  constructor(fieldName: string) {
    super(`The field '${fieldName}' is not part of the schema and thus cannot be used to search.`)
    this.#field = fieldName
  }

  get field() {
    return this.#field
  }

}
