import { FieldDefinition } from "./definition";

export class Field {

  readonly name: string
  readonly definition: FieldDefinition

  constructor(name: string, definition: FieldDefinition) {
    this.name = name
    this.definition = definition
  }

  get type(): string {
    return this.definition.type
  }

  get hashField(): string {
    return this.definition.field ?? this.definition.alias ?? this.name
  }

  get jsonPath(): string {
    return this.definition.path ?? `$.${this.definition.alias ?? this.name}`
  }

  get separator(): string {
    return this.definition.separator ?? '|'
  }

}
