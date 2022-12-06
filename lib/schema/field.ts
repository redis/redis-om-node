import { CaseSensitiveFieldDefinition, FieldDefinition, FieldType, NormalizedFieldDefinition, PhoneticFieldDefinition, SeparableFieldDefinition, SortableFieldDefinition, StemmingFieldDefinition, WeightFieldDefinition } from "./definition"

/**
 * Describes a field in a {@link Schema).
 */
export class Field {

  private _name: string
  private _definition: FieldDefinition

  /**
   * Creates a Field.
   *
   * @param name The name of the Field.
   * @param definition The underlying {@link FieldDefinition}.
   */
  constructor(name: string, definition: FieldDefinition) {
    this._name = name
    this._definition = definition
  }

  /** The name of the field. */
  get name(): string {
    return this._name
  }

  /** The {@link FieldType | type} of the field. */
  get type(): FieldType {
    return this._definition.type
  }

  /** The field name used to store this {@link Field} in a Hash. */
  get hashField(): string {
    return this._definition.field ?? this._definition.alias ?? this.name
  }

  /** The JSONPath used to store this {@link Field} in a JSON document. */
  get jsonPath(): string {
    if (this._definition.path) return this._definition.path
    const alias = this._definition.alias ?? this.name
    return this.type === 'string[]' ? `$.${alias}[*]` : `$.${alias}`
  }

  /** The separator for string[] fields when stored in Hashes. */
  get separator(): string {
    return (this._definition as SeparableFieldDefinition).separator ?? '|'
  }

  /** Indicates that the field as sortable. */
  get sortable(): boolean {
    return (this._definition as SortableFieldDefinition).sortable ?? false
  }

  /** The case-sensitivity of the field. */
  get caseSensitive(): boolean {
    return (this._definition as CaseSensitiveFieldDefinition).caseSensitive ?? false
  }

  /** Indicates the field as being indexed—and thus queryable—by RediSearch. */
  get indexed(): boolean {
    return this._definition.indexed ?? true
  }

  /** Indicates that the field as indexed with stemming support. */
  get stemming(): boolean {
    return (this._definition as StemmingFieldDefinition).stemming ?? true
  }

  /** Inidicates that the field is normalized. */
  get normalized(): boolean {
    return (this._definition as NormalizedFieldDefinition).normalized ?? true
  }

  /** The search weight of the field. */
  get weight(): number | null {
    return (this._definition as WeightFieldDefinition).weight ?? null
  }

  /** The phonetic matcher for the field. */
  get matcher(): string | null {
    return (this._definition as PhoneticFieldDefinition).matcher ?? null
  }
}
