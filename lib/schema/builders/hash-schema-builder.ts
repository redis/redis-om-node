import Entity from "../../entity/entity";
import FieldDefinition from "../definition/field-definition";
import SchemaBuilder from "./schema-builder";

export default class HashSchemaBuilder<TEntity extends Entity> extends SchemaBuilder<TEntity> {

  protected buildEntry(field: string): Array<string> {
    const fieldDef: FieldDefinition = this.schema.definition[field];
    const fieldAlias = fieldDef.alias ?? field

    switch (fieldDef.type) {
      case 'date':
        return [
          fieldAlias, 'NUMERIC',
          ...this.buildNoIndex(fieldDef),
          ...this.buildSortable(fieldDef),
        ]
      case 'boolean':
        return [
          fieldAlias, 'TAG',
          ...this.buildSortable(fieldDef),
        ]
      case 'number':
        return [
          fieldAlias, 'NUMERIC',
          ...this.buildNoIndex(fieldDef),
          ...this.buildSortable(fieldDef),
        ]
      case 'point':
        return [
          fieldAlias, 'GEO',
        ]
      case 'string[]':
        return [
          fieldAlias, 'TAG',
          ...this.buildSeparable(fieldDef),
        ]
      case 'string':
        return [
          fieldAlias, 'TAG',
          ...this.buildCaseInsensitive(fieldDef),
          ...this.buildNoIndex(fieldDef),
          ...this.buildSeparable(fieldDef),
          ...this.buildSortable(fieldDef),
          ...this.buildUnNormalized(fieldDef),
        ]
      case 'text':
        return [
          fieldAlias, 'TEXT',
          ...this.buildNoIndex(fieldDef),
          ...this.buildNoStem(fieldDef),
          ...this.buildPhonetic(fieldDef),
          ...this.buildSortable(fieldDef),
          ...this.buildUnNormalized(fieldDef),
          ...this.buildWeight(fieldDef),
        ]
    };
  }
}
