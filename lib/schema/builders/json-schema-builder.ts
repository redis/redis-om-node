import Entity from "../../entity/entity";
import SchemaBuilder from "./schema-builder";
import FieldDefinition from "../definition/field-definition";
import SeparableFieldDefinition from "../definition/separable-field-definition";
import SortableFieldDefinition from "../definition/sortable-field-definition";
import SchemaFieldType from "../definition/schema-field-type";

import * as logger from '../../shims/logger'

export default class JsonSchemaBuilder<TEntity extends Entity> extends SchemaBuilder<TEntity> {

  protected buildEntry(field: string): Array<string> {
    const fieldDef: FieldDefinition = this.schema.definition[field];
    const fieldType: SchemaFieldType = fieldDef.type;
    const fieldAlias = fieldDef.alias ?? field;
    const fieldPath = `\$.${fieldAlias}${fieldType === 'string[]' ? '[*]' : ''}`;
    let fieldDetails: Array<string>;

    switch (fieldType) {
      case 'date':
        fieldDetails = this.buildSortableNumeric(fieldDef as SortableFieldDefinition);
        break;
      case 'boolean':
        if ((fieldDef as SortableFieldDefinition).sortable)
          logger.warn(`You have marked the boolean field '${field}' as sortable but RediSearch doesn't support the SORTABLE argument on a TAG for JSON. Ignored.`);
        fieldDetails = this.buildTag();
        break;
      case 'number':
        fieldDetails = this.buildSortableNumeric(fieldDef as SortableFieldDefinition);
        break;
      case 'point':
        fieldDetails = this.buildGeo();
        break;
      case 'string[]':
        fieldDetails = this.buildTag();
        break;
      case 'string':
        if ((fieldDef as SortableFieldDefinition).sortable)
          logger.warn(`You have marked the string field '${field}' as sortable but RediSearch doesn't support the SORTABLE argument on a TAG for JSON. Ignored.`);
        fieldDetails = this.buildSeparableTag(fieldDef as SeparableFieldDefinition)
        break;
      case 'text':
        fieldDetails = this.buildSortableText(fieldDef as SortableFieldDefinition)
        break;
    }

    return [fieldPath, 'AS', fieldAlias, ...fieldDetails];
  }
}
