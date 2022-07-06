import { Entity } from "../../entity/entity";
import { FieldDefinition } from "../definition";
import { SchemaBuilder } from "./schema-builder";

export class HashSchemaBuilder<TEntity extends Entity> extends SchemaBuilder<TEntity> {

  protected buildEntry(field: string, parentField?: string): Array<string> {
    const fieldDef: FieldDefinition = this.schema.definition[field];
    const fieldAlias = fieldDef.alias ?? field
    const fieldPath = parentField ? `${parentField}.${fieldAlias}` : fieldAlias

    switch (fieldDef.type) {
      case 'date':
        return [
          fieldPath, 'NUMERIC',
          ...this.buildSortable(fieldDef),
          ...this.buildIndexed(fieldDef),
        ]
      case 'boolean':
        return [
          fieldPath, 'TAG',
          ...this.buildSortable(fieldDef),
          ...this.buildIndexed(fieldDef),
        ]
      case 'number':
        return [
          fieldPath, 'NUMERIC',
          ...this.buildSortable(fieldDef),
          ...this.buildIndexed(fieldDef),
        ]
      case 'object':
        // TODO: remove this ignore
        // @ts-ignore
        return new HashSchemaBuilder(fieldDef.schema).redisSchema
      case 'point':
        return [
          fieldPath, 'GEO',
          ...this.buildIndexed(fieldDef),
        ]
      case 'string[]':
      case 'string':
        return [
          fieldPath, 'TAG',
          ...this.buildCaseInsensitive(fieldDef),
          ...this.buildSeparable(fieldDef),
          ...this.buildSortable(fieldDef),
          ...this.buildNormalized(fieldDef),
          ...this.buildIndexed(fieldDef),
        ]
      case 'text':
        return [
          fieldPath, 'TEXT',
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
