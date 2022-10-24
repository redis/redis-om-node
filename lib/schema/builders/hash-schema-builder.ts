import { Entity } from "../../entity/entity";
import { FieldDefinition } from "../definition";
import { SchemaBuilder } from "./schema-builder";

export class HashSchemaBuilder<TEntity extends Entity> extends SchemaBuilder<TEntity> {

  protected buildEntry(field: string): Array<string> {
    const fieldDef: FieldDefinition = this.schema.definition[field];
    const fieldAlias = fieldDef.alias ?? field

    return this.buildField(field, fieldDef, fieldAlias);
  }

  buildField(field: string,fieldDef: FieldDefinition, fieldAlias: string) {
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
        case "object":
          const subSchema: string[] = [];
        //@ts-ignore
        const subFieldsDefinition = this.schema.definition[field].fields;
        Object.keys(subFieldsDefinition).forEach((subField) => {
          //@ts-ignore
          const subFieldDef: FieldDefinition = this.schema.definition[field].fields[subField];
          const subFieldKey = `${field}.${subField}`; 
          subSchema.push(
            ...this.buildField(
              subFieldKey,
              subFieldDef,
              subField
            )
          );
        });
        return subSchema;
    };
  }
}
