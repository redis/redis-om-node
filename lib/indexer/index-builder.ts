import { Schema } from "../schema/schema"
import { Field } from "../schema/field"


export function buildRediSearchIndex(schema: Schema): string[] {
  const buildEntry = entryBuilders[schema.dataStructure]
  return schema.fields.map(buildEntry).flat()
}

const entryBuilders = {  HASH: buildHashEntry, JSON: buildJsonEntry }

function buildHashEntry(field: Field): string[] {
  const hashField = field.hashField

  switch (field.type) {
    case 'boolean':
      return [hashField, ...buildHashBoolean(field)]
    case 'date':
      return [hashField, ...buildDateNumber(field)]
    case 'number':
      return [hashField, ...buildDateNumber(field)]
    case 'point':
      return [hashField, ...buildPoint(field)]
    case 'string[]':
    case 'string':
      return [hashField, ...buildHashString(field)]
    case 'text':
      return [hashField, ...buildText(field)]
  }
}

function buildJsonEntry(field: Field): string[] {
  const jsonPath = field.jsonPath
  const fieldInfo = [jsonPath, 'AS', field.name]

  switch (field.type) {
    case 'boolean':
      return [...fieldInfo, ...buildJsonBoolean(field)]
    case 'date':
      return [...fieldInfo, ...buildDateNumber(field)]
    case 'number':
      return [...fieldInfo, ...buildDateNumber(field)]
    case 'point':
      return [...fieldInfo, ...buildPoint(field)]
    case 'string[]':
    case 'string':
      return [...fieldInfo, ...buildJsonString(field)]
    case 'text':
      return [...fieldInfo, ...buildText(field)]
  }
}

function buildHashBoolean(field: Field): string[] {
  return ['TAG', ...buildSortable(field), ...buildIndexed(field)]
}

function buildJsonBoolean(field: Field): string[] {
  if (field.sortable)
    console.warn(`You have marked a boolean field as sortable but RediSearch doesn't support the SORTABLE argument on a TAG for JSON. Ignored.`)
  return ['TAG', ...buildIndexed(field)]
}

function buildDateNumber(field: Field): string[] {
  return ['NUMERIC', ...buildSortable(field), ...buildIndexed(field)]
}

function buildPoint(field: Field): string[] {
  return ['GEO', ...buildIndexed(field)]
}

function buildHashString(field: Field): string[] {
  return ['TAG',
    ...buildCaseInsensitive(field),
    ...buildSeparable(field),
    ...buildSortable(field),
    ...buildNormalized(field),
    ...buildIndexed(field)]
}

function buildJsonString(field: Field): string[] {
  if (field.sortable)
    console.warn(`You have marked a ${field.type} field as sortable but RediSearch doesn't support the SORTABLE argument on a TAG for JSON. Ignored.`)
  return ['TAG',
    ...buildCaseInsensitive(field),
    ...buildSeparable(field),
    ...buildNormalized(field),
    ...buildIndexed(field)]
}

function buildText(field: Field): string[] {
  return ['TEXT',
    ...buildStemming(field),
    ...buildPhonetic(field),
    ...buildSortable(field),
    ...buildNormalized(field),
    ...buildWeight(field),
    ...buildIndexed(field)]
}

function buildCaseInsensitive(field: Field) {
  return field.caseSensitive ? ['CASESENSITIVE'] : []
}

function buildIndexed(field: Field) {
  return field.indexed ? [] : ['NOINDEX']
}

function buildStemming(field: Field) {
  return field.stemming ? [] : ['NOSTEM']
}

function buildPhonetic(field: Field) {
  return field.matcher ? ['PHONETIC', field.matcher] : []
}

function buildSeparable(field: Field) {
  return ['SEPARATOR', field.separator]
}

function buildSortable(field: Field) {
  return field.sortable ? ['SORTABLE'] : []
}

function buildNormalized(field: Field) {
  return field.normalized ? [] : ['UNF']
}

function buildWeight(field: Field) {
  return field.weight ? ['WEIGHT', field.weight.toString()] : []
}
