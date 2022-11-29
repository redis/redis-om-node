import { CaseSensitiveFieldDefinition, FieldDefinition, FieldType, NormalizedFieldDefinition, PhoneticFieldDefinition, SeparableFieldDefinition, SortableFieldDefinition, StemmingFieldDefinition, WeightFieldDefinition } from "./definition";

export class Field {

  private _name: string
  private _definition: FieldDefinition

  constructor(name: string, definition: FieldDefinition) {
    this._name = name
    this._definition = definition
  }

  get name(): string {
    return this._name
  }

  get type(): FieldType {
    return this._definition.type
  }

  get hashField(): string {
    return this._definition.field ?? this._definition.alias ?? this.name
  }

  get jsonPath(): string {
    if (this._definition.path) return this._definition.path
    const alias = this._definition.alias ?? this.name
    return this.type === 'string[]' ? `$.${alias}[*]` : `$.${alias}`
  }

  get separator(): string {
    return (this._definition as SeparableFieldDefinition).separator ?? '|'
  }

  get sortable(): boolean {
    return (this._definition as SortableFieldDefinition).sortable ?? false
  }

  get caseSensitive(): boolean {
    return (this._definition as CaseSensitiveFieldDefinition).caseSensitive ?? false
  }

  get indexed(): boolean {
    return this._definition.indexed ?? true
  }

  get stemming(): boolean {
    return (this._definition as StemmingFieldDefinition).stemming ?? true
  }

  get normalized(): boolean {
    return (this._definition as NormalizedFieldDefinition).normalized ?? true
  }

  get weight(): number | null {
    return (this._definition as WeightFieldDefinition).weight ?? null
  }

  get matcher(): string | null {
    return (this._definition as PhoneticFieldDefinition).matcher ?? null
  }
}
