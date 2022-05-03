import Entity from "../../entity/entity";
import FieldDefinition from "../definition/field-definition";
import SchemaBuilder from "./schema-builder";

export default class HashSchemaBuilder<TEntity extends Entity> extends SchemaBuilder<TEntity> {

  protected buildEntry(field: string): Array<string> {
    const fieldDef: FieldDefinition = this.schema.definition[field];
    const fieldAlias = fieldDef.alias ?? field
    let fieldDetails: Array<string>;

    switch (fieldDef.type) {
      case 'date':
        fieldDetails = this.buildField('NUMERIC', undefined, fieldDef.sortable)
        break;
      case 'boolean':
        fieldDetails = this.buildField('TAG', undefined, fieldDef.sortable)
        break;
      case 'number':
        fieldDetails = this.buildField('NUMERIC', undefined, fieldDef.sortable)
        break;
      case 'point':
        fieldDetails = this.buildField('GEO', undefined, undefined)
        break;
      case 'string[]':
        fieldDetails = this.buildField('TAG', fieldDef.separator ?? '|', undefined)
        break;
      case 'string':
        fieldDetails = this.buildField('TAG', fieldDef.separator ?? '|', fieldDef.sortable)
        break;
      case 'text':
        fieldDetails = this.buildField('TEXT', undefined, fieldDef.sortable)
        break;
    };

    return [fieldAlias, ...fieldDetails];
  }
}
