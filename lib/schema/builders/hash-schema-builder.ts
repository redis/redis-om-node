import { Entity } from "../../entity/entity";
import { FieldDefinition } from "../definition";
import { SchemaBuilder } from "./schema-builder";

export class HashSchemaBuilder<TEntity extends Entity> extends SchemaBuilder<TEntity> {

  protected buildEntry(field: string): Array<string> {
    const fieldDef: FieldDefinition = this.schema.definition[field];
    const fieldAlias = fieldDef.alias ?? field
    const fieldAliasPathed = this.parentField ? `${this.parentField}.${fieldAlias}` : fieldAlias

    switch (fieldDef.type) {
      case 'date':
        return [
          fieldAliasPathed, 'NUMERIC',
          ...this.buildSortable(fieldDef),
          ...this.buildIndexed(fieldDef),
        ]
      case 'boolean':
        return [
          fieldAliasPathed, 'TAG',
          ...this.buildSortable(fieldDef),
          ...this.buildIndexed(fieldDef),
        ]
      case 'number':
        return [
          fieldAliasPathed, 'NUMERIC',
          ...this.buildSortable(fieldDef),
          ...this.buildIndexed(fieldDef),
        ]
      case 'object':
        // TODO: remove this ignore
        // @ts-ignore
        return new HashSchemaBuilder(fieldDef.schema, fieldAliasPathed).redisSchema
      case 'point':
        return [
          fieldAliasPathed, 'GEO',
          ...this.buildIndexed(fieldDef),
        ]
      case 'string[]':
      case 'string':
        return [
          fieldAliasPathed, 'TAG',
          ...this.buildCaseInsensitive(fieldDef),
          ...this.buildSeparable(fieldDef),
          ...this.buildSortable(fieldDef),
          ...this.buildNormalized(fieldDef),
          ...this.buildIndexed(fieldDef),
        ]
      case 'text':
        return [
          fieldAliasPathed, 'TEXT',
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
