import { AllFieldDefinition, FieldDefinition, FieldType } from './definitions'

/**
 * Describes a field in a {@link Schema}.
 */
export class Field {

  #name: string
  #definition: AllFieldDefinition

  /**
   * Creates a Field.
   *
   * @param name The name of the Field.
   * @param definition The underlying {@link FieldDefinition}.
   */
  constructor(name: string, definition: FieldDefinition) {
    this.#name = name
    this.#definition = definition
  }

  /** The name of the field. */
  get name(): string {
    return this.#name
  }

  /** The {@link FieldType | type} of the field. */
  get type(): FieldType {
    return this.#definition.type
  }

  /** The field name used to store this {@link Field} in a Hash. */
  get hashField(): string {
    return this.#definition.field ?? this.#definition.alias ?? this.name
  }

  /** The JSONPath used to store this {@link Field} in a JSON document. */
  get jsonPath(): string {
    if (this.#definition.path) return this.#definition.path
    const alias = this.#definition.alias ?? this.name
    return this.type === 'string[]' ? `$.${alias}[*]` : `$.${alias}`
  }

  /** The separator for string[] fields when stored in Hashes. */
  get separator(): string {
    return this.#definition.separator ?? '|'
  }

  /** Indicates that the field as sortable. */
  get sortable(): boolean {
    return this.#definition.sortable ?? false
  }

  /** The case-sensitivity of the field. */
  get caseSensitive(): boolean {
    return this.#definition.caseSensitive ?? false
  }

  /** Indicates the field as being indexed—and thus queryable—by RediSearch. */
  get indexed(): boolean {
    return this.#definition.indexed ?? true
  }

  /** Indicates that the field as indexed with stemming support. */
  get stemming(): boolean {
    return this.#definition.stemming ?? true
  }

  /** Indicates that the field is normalized. Ignored if sortable is false. */
  get normalized(): boolean {
    return this.#definition.normalized ?? true
  }

  /** The search weight of the field. */
  get weight(): number | null {
    return this.#definition.weight ?? null
  }

  /** The phonetic matcher for the field. */
  get matcher(): string | null {
    return this.#definition.matcher ?? null
  }
}
