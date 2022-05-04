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
        fieldDetails = this.buildField('NUMERIC', undefined, fieldDef.sortable, fieldDef.noindex, undefined, undefined, undefined)
        break;
      case 'boolean':
        fieldDetails = this.buildField('TAG', undefined, fieldDef.sortable, undefined, undefined, undefined, undefined)
        break;
      case 'number':
        fieldDetails = this.buildField('NUMERIC', undefined, fieldDef.sortable, undefined, undefined, undefined, undefined)
        break;
      case 'point':
        fieldDetails = this.buildField('GEO', undefined, undefined, undefined, undefined, undefined, undefined)
        break;
      case 'string[]':
        fieldDetails = this.buildField('TAG', fieldDef.separator ?? '|', undefined, undefined, undefined, undefined, undefined)
        break;
      case 'string':
        fieldDetails = this.buildField('TAG', fieldDef.separator ?? '|', fieldDef.sortable, undefined, fieldDef.casesensitive, undefined, undefined)
        break;
      case 'text':
        fieldDetails = this.buildField('TEXT', undefined, fieldDef.sortable, undefined, fieldDef.nostem, undefined, fieldDef.weight)
        break;
    };

    return [fieldAlias, ...fieldDetails];
  }
}
