import Entity from "../../entity/entity";
import * as logger from '../../shims/logger';
import FieldDefinition from "../definition/field-definition";
import SchemaBuilder from "./schema-builder";

export default class JsonSchemaBuilder<TEntity extends Entity> extends SchemaBuilder<TEntity> {

  protected buildEntry(field: string): Array<string> {
    const fieldDef: FieldDefinition = this.schema.definition[field];
    const fieldAlias = fieldDef.alias ?? field;
    const fieldPath = `\$.${fieldAlias}${fieldDef.type === 'string[]' ? '[*]' : ''}`;
    let fieldDetails: Array<string>;

    switch (fieldDef.type) {
      case 'date':
        fieldDetails = this.buildField('NUMERIC', undefined, fieldDef.sortable)
        break;
      case 'boolean':
        if (fieldDef.sortable)
          logger.warn(`You have marked the boolean field '${field}' as sortable but RediSearch doesn't support the SORTABLE argument on a TAG for JSON. Ignored.`);
        fieldDetails = this.buildField('TAG', undefined, undefined)
        break;
      case 'number':
        fieldDetails = this.buildField('NUMERIC', undefined, fieldDef.sortable)
        break;
      case 'point':
        fieldDetails = this.buildField('GEO', undefined, undefined)
        break;
      case 'string[]':
        fieldDetails = this.buildField('TAG', undefined, undefined)
        break;
      case 'string':
        if (fieldDef.sortable)
          logger.warn(`You have marked the string field '${field}' as sortable but RediSearch doesn't support the SORTABLE argument on a TAG for JSON. Ignored.`);
        fieldDetails = this.buildField('TAG', fieldDef.separator ?? '|', undefined)
        break;
      case 'text':
        fieldDetails = this.buildField('TEXT', undefined, fieldDef.sortable)
        break;
    }

    return [fieldPath, 'AS', fieldAlias, ...fieldDetails];
  }
}
