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
          ...this.buildSortable(fieldDef),
          ...this.buildIndexed(fieldDef),
        ]
      case 'boolean':
        return [
          fieldAlias, 'TAG',
          ...this.buildSortable(fieldDef),
          ...this.buildIndexed(fieldDef),
        ]
      case 'number':
        return [
          fieldAlias, 'NUMERIC',
          ...this.buildSortable(fieldDef),
          ...this.buildIndexed(fieldDef),
        ]
      case 'point':
        return [
          fieldAlias, 'GEO',
          ...this.buildIndexed(fieldDef),
        ]
      case 'string[]':
      case 'string':
        return [
          fieldAlias, 'TAG',
          ...this.buildCaseInsensitive(fieldDef),
          ...this.buildSeparable(fieldDef),
          ...this.buildSortable(fieldDef),
          ...this.buildNormalized(fieldDef),
          ...this.buildIndexed(fieldDef),
        ]
      case 'text':
        return [
          fieldAlias, 'TEXT',
          ...this.buildStemming(fieldDef),
          ...this.buildPhonetic(fieldDef),
          ...this.buildSortable(fieldDef),
          ...this.buildNormalized(fieldDef),
          ...this.buildWeight(fieldDef),
          ...this.buildIndexed(fieldDef),
        ]
    };
  }
}
