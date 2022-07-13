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

export function buildRedisSchema<TEntity extends Entity>(schema: Schema<TEntity>): string[] {
  const buildEntry = entryBuilders[schema.dataStructure];
  return Object.entries(schema.definition)
    .map(([fieldName, fieldDef]) => buildEntry(fieldName, fieldDef, schema.indexedDefault))
    .flat();
}

const entryBuilders = {  HASH: buildHashEntry, JSON: buildJsonEntry };

function buildHashEntry(fieldName: string, fieldDef: FieldDefinition, indexedDefault: boolean): string[] {
  const fieldPath = fieldDef.alias ?? fieldName;

  switch (fieldDef.type) {
    case 'boolean':
      return [fieldPath, ...buildHashBoolean(fieldDef, indexedDefault)];
    case 'date':
      return [fieldPath, ...buildDateNumber(fieldDef, indexedDefault)];
    case 'number':
      return [fieldPath, ...buildDateNumber(fieldDef, indexedDefault)];
    case 'point':
      return [fieldPath, ...buildPoint(fieldDef, indexedDefault)];
    case 'string[]':
    case 'string':
      return [fieldPath, ...buildHashString(fieldDef, indexedDefault)];
    case 'text':
      return [fieldPath, ...buildText(fieldDef, indexedDefault)];
  }
}

function buildJsonEntry(fieldName: string, fieldDef: FieldDefinition, indexedDefault: boolean): string[] {
  const fieldPath = fieldDef.alias ?? fieldName;
  const jsonPath = `\$.${fieldPath}${fieldDef.type === 'string[]' ? '[*]' : ''}`;
  const fieldInfo = [jsonPath, 'AS', fieldPath]

  switch (fieldDef.type) {
    case 'boolean':
      return [...fieldInfo, ...buildJsonBoolean(fieldDef, indexedDefault)];
    case 'date':
      return [...fieldInfo, ...buildDateNumber(fieldDef, indexedDefault)];
    case 'number':
      return [...fieldInfo, ...buildDateNumber(fieldDef, indexedDefault)];
    case 'point':
      return [...fieldInfo, ...buildPoint(fieldDef, indexedDefault)];
    case 'string[]':
    case 'string':
      return [...fieldInfo, ...buildJsonString(fieldDef, indexedDefault)];
    case 'text':
      return [...fieldInfo, ...buildText(fieldDef, indexedDefault)];
  }
}

function buildHashBoolean(fieldDef: BooleanFieldDefinition, indexedDefault: boolean): string[] {
  return ['TAG', ...buildSortable(fieldDef), ...buildIndexed(fieldDef, indexedDefault)];
}

function buildJsonBoolean(fieldDef: BooleanFieldDefinition, indexedDefault: boolean): string[] {
  if (fieldDef.sortable)
    console.warn(`You have marked a boolean field as sortable but RediSearch doesn't support the SORTABLE argument on a TAG for JSON. Ignored.`);
  return ['TAG', ...buildIndexed(fieldDef, indexedDefault)];
}

function buildDateNumber(fieldDef: DateFieldDefinition | NumberFieldDefinition, indexedDefault: boolean): string[] {
  return ['NUMERIC', ...buildSortable(fieldDef), ...buildIndexed(fieldDef, indexedDefault)];
}

function buildPoint(fieldDef: PointFieldDefinition, indexedDefault: boolean): string[] {
  return ['GEO', ...buildIndexed(fieldDef, indexedDefault)];
}

function buildHashString(fieldDef: StringFieldDefinition | StringArrayFieldDefinition, indexedDefault: boolean): string[] {
  return ['TAG',
    ...buildCaseInsensitive(fieldDef),
    ...buildSeparable(fieldDef),
    ...buildSortable(fieldDef),
    ...buildNormalized(fieldDef),
    ...buildIndexed(fieldDef, indexedDefault)];
}

function buildJsonString(fieldDef: StringFieldDefinition | StringArrayFieldDefinition, indexedDefault: boolean): string[] {
  if (fieldDef.sortable)
    console.warn(`You have marked a ${fieldDef.type} field as sortable but RediSearch doesn't support the SORTABLE argument on a TAG for JSON. Ignored.`);
  return ['TAG',
    ...buildCaseInsensitive(fieldDef),
    ...buildSeparable(fieldDef),
    ...buildNormalized(fieldDef),
    ...buildIndexed(fieldDef, indexedDefault)];
}

function buildText(fieldDef: TextFieldDefinition, indexedDefault: boolean): string[] {
  return ['TEXT',
    ...buildStemming(fieldDef),
    ...buildPhonetic(fieldDef),
    ...buildSortable(fieldDef),
    ...buildNormalized(fieldDef),
    ...buildWeight(fieldDef),
    ...buildIndexed(fieldDef, indexedDefault)];
}

function buildCaseInsensitive(fieldDef: CaseSensitiveFieldDefinition) {
  return fieldDef.caseSensitive ? ['CASESENSITIVE'] : [];
}

function buildIndexed(fieldDef: BaseFieldDefinition, indexedDefault: boolean) {
  return fieldDef.indexed ?? indexedDefault ? [] : ['NOINDEX'];
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
