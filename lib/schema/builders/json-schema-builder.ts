import { Entity } from "../../entity/entity";
import {
  BaseFieldDefinition,
  CaseSensitiveFieldDefinition,
  FieldDefinition,
  NormalizedFieldDefinition,
  PhoneticFieldDefinition,
  SchemaDefinition,
  SeparableFieldDefinition,
  SortableFieldDefinition,
  StemmingFieldDefinition,
  WeightFieldDefinition,
} from "../definition";
import { SchemaBuilder } from "./schema-builder";

export class JsonSchemaBuilder<
  TEntity extends Entity
> extends SchemaBuilder<TEntity> {
  protected buildEntry(field: string): Array<string> {
    const fieldDef: FieldDefinition = this.schema.definition[field];
    const fieldAlias = fieldDef.alias ?? field;
    const fieldPath = `\$.${fieldAlias}${
      fieldDef.type === "string[]" ? "[*]" : ""
    }`;
    const fieldInfo = [fieldPath, "AS", fieldAlias];
    return this.buildField(field, fieldDef, fieldInfo);
  }

  buildField(
    field: string ,
    fieldDef: FieldDefinition,
    fieldInfo: string[]
  ) {
    switch (fieldDef.type) {
      case "date":
        return [
          ...fieldInfo,
          "NUMERIC",
          ...this.buildSortable(fieldDef),
          ...this.buildIndexed(fieldDef),
        ];
      case "boolean":
        if (fieldDef.sortable)
          console.warn(
            `You have marked the boolean field '${field}' as sortable but RediSearch doesn't support the SORTABLE argument on a TAG for JSON. Ignored.`
          );
        return [...fieldInfo, "TAG", ...this.buildIndexed(fieldDef)];
      case "number":
        return [
          ...fieldInfo,
          "NUMERIC",
          ...this.buildSortable(fieldDef),
          ...this.buildIndexed(fieldDef),
        ];
      case "point":
        return [...fieldInfo, "GEO", ...this.buildIndexed(fieldDef)];
      case "string[]":
      case "string":
        if (fieldDef.sortable)
          console.warn(
            `You have marked the ${fieldDef.type} field '${field}' as sortable but RediSearch doesn't support the SORTABLE argument on a TAG for JSON. Ignored.`
          );
        return [
          ...fieldInfo,
          "TAG",
          ...this.buildCaseInsensitive(fieldDef),
          ...this.buildSeparable(fieldDef),
          ...this.buildNormalized(fieldDef),
          ...this.buildIndexed(fieldDef),
        ];
      case "text":
        return [
          ...fieldInfo,
          "TEXT",
          ...this.buildStemming(fieldDef),
          ...this.buildPhonetic(fieldDef),
          ...this.buildSortable(fieldDef),
          ...this.buildNormalized(fieldDef),
          ...this.buildWeight(fieldDef),
          ...this.buildIndexed(fieldDef),
        ];
      case "object":
        const subSchema: string[] = [];
        //@ts-ignore
        const subFieldDefinition = this.schema.definition[field].fields;
        Object.keys(subFieldDefinition).forEach((subField) => {
          const subFieldPath = `\$.${field}.${subField}${
            subFieldDefinition.type === "string[]" ? "[*]" : ""
          }`;
          const fieldInfo = [subFieldPath, "AS", `${field}.${subField}`];
          subSchema.push(
            ...this.buildField(
              subFieldPath,
              subFieldDefinition[subField],
              fieldInfo
            )
          );
        });
        return subSchema;
    }
  }
}
