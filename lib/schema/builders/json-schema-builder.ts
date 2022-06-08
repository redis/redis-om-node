import Entity from "../../entity/entity";
import * as logger from '../../shims/logger';
import FieldDefinition from "../definition/field-definition";
import SchemaBuilder from "./schema-builder";

export default class JsonSchemaBuilder<TEntity extends Entity> extends SchemaBuilder<TEntity> {

  protected buildEntry(field: string): Array<string> {
    const fieldDef: FieldDefinition = this.schema.definition[field];
    const fieldAlias = fieldDef.alias ?? field;
    const fieldPath = `\$.${fieldAlias}${fieldDef.type === 'string[]' ? '[*]' : ''}`;
    const fieldInfo = [fieldPath, 'AS', fieldAlias]

    switch (fieldDef.type) {
      case 'date':
        return [
          ...fieldInfo, 'NUMERIC',
          ...this.buildSortable(fieldDef),
          ...this.buildIndexed(fieldDef),
        ]
      case 'boolean':
        if (fieldDef.sortable)
          logger.warn(`You have marked the boolean field '${field}' as sortable but RediSearch doesn't support the SORTABLE argument on a TAG for JSON. Ignored.`);
        return [
          ...fieldInfo, 'TAG',
          ...this.buildIndexed(fieldDef),
        ]
      case 'number':
        return [
          ...fieldInfo, 'NUMERIC',
          ...this.buildSortable(fieldDef),
          ...this.buildIndexed(fieldDef),
        ]
      case 'point':
        return [
          ...fieldInfo, 'GEO',
          ...this.buildIndexed(fieldDef),
        ]
      case 'string[]':
      case 'string':
        if (fieldDef.sortable)
          logger.warn(`You have marked the ${fieldDef.type} field '${field}' as sortable but RediSearch doesn't support the SORTABLE argument on a TAG for JSON. Ignored.`);
        return [
          ...fieldInfo, 'TAG',
          ...this.buildCaseInsensitive(fieldDef),
          ...this.buildSeparable(fieldDef),
          ...this.buildNormalized(fieldDef),
          ...this.buildIndexed(fieldDef),
        ]
      case 'text':
        return [
          ...fieldInfo, 'TEXT',
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
