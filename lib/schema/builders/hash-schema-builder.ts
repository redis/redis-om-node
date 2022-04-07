import Entity from "../../entity/entity";
import SchemaBuilder from "./schema-builder";
import FieldDefinition from "../definition/field-definition";
import SeparableFieldDefinition from "../definition/separable-field-definition";
import SortableFieldDefinition from "../definition/sortable-field-definition";

export default class HashSchemaBuilder<TEntity extends Entity> extends SchemaBuilder<TEntity> {

  protected buildEntry(field: string): string[] {
    const fieldDef: FieldDefinition = this.schema.definition[field];
    const fieldType = fieldDef.type;
    const fieldAlias = fieldDef.alias ?? field
    let fieldDetails: string[];

    switch (fieldType) {
      case 'date':
        fieldDetails = this.buildSortableNumeric(fieldDef as SortableFieldDefinition);
        break;
      case 'boolean':
        fieldDetails = this.buildSortableTag(fieldDef as SortableFieldDefinition);
        break;
      case 'number':
        fieldDetails = this.buildSortableNumeric(fieldDef as SortableFieldDefinition);
        break;
      case 'point':
        fieldDetails = this.buildGeo();
        break;
      case 'string[]':
        fieldDetails = this.buildSeparableTag(fieldDef as SeparableFieldDefinition);
        break;
      case 'string':
        fieldDetails = this.buildSeparableAndSortableTag(fieldDef as SortableFieldDefinition & SeparableFieldDefinition);
        break;
      case 'text':
        fieldDetails = this.buildSortableText(fieldDef as SortableFieldDefinition);
        break;
    };

    return [fieldAlias, ...fieldDetails];
  }
}
