import { Entity } from "../entity/entity";
import {
  FieldDefinition,
  DateFieldDefinition,
  BooleanFieldDefinition,
  BaseFieldDefinition,
  CaseSensitiveFieldDefinition,
  StemmingFieldDefinition,
  PhoneticFieldDefinition,
  SeparableFieldDefinition,
  SortableFieldDefinition,
  NormalizedFieldDefinition,
  WeightFieldDefinition,
  NumberFieldDefinition,
  PointFieldDefinition,
  StringFieldDefinition,
  StringArrayFieldDefinition,
  TextFieldDefinition,
} from "./definition";
import { Schema } from "./schema";

export function buildRediSearchIndex<TEntity extends Entity>(schema: Schema<TEntity>): string[] {
  const buildEntry = entryBuilders[schema.dataStructure];
  return Object.entries(schema.definition)
    .map(([fieldName, fieldDef]) => buildEntry(fieldName, fieldDef))
    .flat();
}

const entryBuilders = {  HASH: buildHashEntry, JSON: buildJsonEntry };

function buildHashEntry(fieldName: string, fieldDef: FieldDefinition): string[] {
  const fieldPath = fieldDef.alias ?? fieldName;

  switch (fieldDef.type) {
    case 'boolean':
      return [fieldPath, ...buildHashBoolean(fieldDef)];
    case 'date':
      return [fieldPath, ...buildDateNumber(fieldDef)];
    case 'number':
      return [fieldPath, ...buildDateNumber(fieldDef)];
    case 'point':
      return [fieldPath, ...buildPoint(fieldDef)];
    case 'string[]':
    case 'string':
      return [fieldPath, ...buildHashString(fieldDef)];
    case 'text':
      return [fieldPath, ...buildText(fieldDef)];
  }
}

function buildJsonEntry(fieldName: string, fieldDef: FieldDefinition): string[] {
  const fieldPath = fieldDef.alias ?? fieldName;
  const jsonPath = `\$.${fieldPath}${fieldDef.type === 'string[]' ? '[*]' : ''}`;
  const fieldInfo = [jsonPath, 'AS', fieldPath]

  switch (fieldDef.type) {
    case 'boolean':
      return [...fieldInfo, ...buildJsonBoolean(fieldDef)];
    case 'date':
      return [...fieldInfo, ...buildDateNumber(fieldDef)];
    case 'number':
      return [...fieldInfo, ...buildDateNumber(fieldDef)];
    case 'point':
      return [...fieldInfo, ...buildPoint(fieldDef)];
    case 'string[]':
    case 'string':
      return [...fieldInfo, ...buildJsonString(fieldDef)];
    case 'text':
      return [...fieldInfo, ...buildText(fieldDef)];
  }
}

function buildHashBoolean(fieldDef: BooleanFieldDefinition): string[] {
  return ['TAG', ...buildSortable(fieldDef), ...buildIndexed(fieldDef)];
}

function buildJsonBoolean(fieldDef: BooleanFieldDefinition): string[] {
  if (fieldDef.sortable)
    console.warn(`You have marked a boolean field as sortable but RediSearch doesn't support the SORTABLE argument on a TAG for JSON. Ignored.`);
  return ['TAG', ...buildIndexed(fieldDef)];
}

function buildDateNumber(fieldDef: DateFieldDefinition | NumberFieldDefinition): string[] {
  return ['NUMERIC', ...buildSortable(fieldDef), ...buildIndexed(fieldDef)];
}

function buildPoint(fieldDef: PointFieldDefinition): string[] {
  return ['GEO', ...buildIndexed(fieldDef)];
}

function buildHashString(fieldDef: StringFieldDefinition | StringArrayFieldDefinition): string[] {
  return ['TAG',
    ...buildCaseInsensitive(fieldDef),
    ...buildSeparable(fieldDef),
    ...buildSortable(fieldDef),
    ...buildNormalized(fieldDef),
    ...buildIndexed(fieldDef)];
}

function buildJsonString(fieldDef: StringFieldDefinition | StringArrayFieldDefinition): string[] {
  if (fieldDef.sortable)
    console.warn(`You have marked a ${fieldDef.type} field as sortable but RediSearch doesn't support the SORTABLE argument on a TAG for JSON. Ignored.`);
  return ['TAG',
    ...buildCaseInsensitive(fieldDef),
    ...buildSeparable(fieldDef),
    ...buildNormalized(fieldDef),
    ...buildIndexed(fieldDef)];
}

function buildText(fieldDef: TextFieldDefinition): string[] {
  return ['TEXT',
    ...buildStemming(fieldDef),
    ...buildPhonetic(fieldDef),
    ...buildSortable(fieldDef),
    ...buildNormalized(fieldDef),
    ...buildWeight(fieldDef),
    ...buildIndexed(fieldDef)];
}

function buildCaseInsensitive(fieldDef: CaseSensitiveFieldDefinition) {
  return fieldDef.caseSensitive ? ['CASESENSITIVE'] : [];
}

function buildIndexed(fieldDef: BaseFieldDefinition) {
  return fieldDef.indexed ?? true ? [] : ['NOINDEX'];
}

function buildStemming(fieldDef: StemmingFieldDefinition) {
  return fieldDef.stemming ?? true ? [] : ['NOSTEM'];
}

function buildPhonetic(fieldDef: PhoneticFieldDefinition) {
  return fieldDef.matcher ? ['PHONETIC', fieldDef.matcher] : [];
}

function buildSeparable(fieldDef: SeparableFieldDefinition) {
  return ['SEPARATOR', fieldDef.separator || '|'];
}

function buildSortable(fieldDef: SortableFieldDefinition) {
  return fieldDef.sortable ? ['SORTABLE'] : [];
}

function buildNormalized(fieldDef: NormalizedFieldDefinition) {
  return fieldDef.normalized ?? true ? [] : ['UNF'];
}

function buildWeight(fieldDef: WeightFieldDefinition) {
  return fieldDef.weight ? ['WEIGHT', fieldDef.weight.toString()] : [];
}
