import { RediSearchSchema, SchemaFieldTypes } from 'redis'

import { Schema } from '../schema/schema'
import { Field } from '../schema/field'

const entryBuilders = { HASH: addHashEntry, JSON: addJsonEntry }

export function buildRediSearchSchema(schema: Schema): RediSearchSchema {
  const addEntry = entryBuilders[schema.dataStructure]
  return schema.fields.reduce(addEntry, {})
}

function addHashEntry(schema: RediSearchSchema, field: Field): RediSearchSchema {
  const hashField = field.hashField

  switch (field.type) {
    case 'boolean':
      schema[hashField] = buildHashBoolean(field)
      break
    case 'date':
      schema[hashField] = buildDateNumber(field)
      break
    case 'number':
      schema[hashField] = buildDateNumber(field)
      break
    case 'point':
      schema[hashField] = buildPoint(field)
      break
    case 'string[]':
    case 'string':
      schema[hashField] = buildHashString(field)
      break
    case 'text':
      schema[hashField] = buildText(field)
      break
  }

  return schema
}

function addJsonEntry(schema: RediSearchSchema, field: Field): RediSearchSchema {
  const jsonPath = field.jsonPath

  switch (field.type) {
    case 'boolean':
      schema[jsonPath] = buildJsonBoolean(field)
      break
    case 'date':
      schema[jsonPath] = buildDateNumber(field)
      break
    case 'number':
      schema[jsonPath] = buildDateNumber(field)
      break
    case 'point':
      schema[jsonPath] = buildPoint(field)
      break
    case 'string[]':
    case 'string':
      schema[jsonPath] = buildJsonString(field)
      break
    case 'text':
      schema[jsonPath] = buildText(field)
      break
  }

  return schema
}

function buildHashBoolean(field: Field): any {
  const schemaField = { type: SchemaFieldTypes.TAG, AS: field.name }
  addSortable(schemaField, field)
  addIndexed(schemaField, field)
  return schemaField
}

function buildJsonBoolean(field: Field): any {
  if (field.sortable)
    console.warn(`You have marked a boolean field as sortable but RediSearch doesn't support the SORTABLE argument on a TAG for JSON. Ignored.`)
  const schemaField = { type: SchemaFieldTypes.TAG, AS: field.name }
  addIndexed(schemaField, field)
  return schemaField
}

function buildDateNumber(field: Field): any {
  const schemaField = { type: SchemaFieldTypes.NUMERIC, AS: field.name }
  addSortable(schemaField, field)
  addIndexed(schemaField, field)
  return schemaField
}

function buildPoint(field: Field): any {
  const schemaField = { type: SchemaFieldTypes.GEO, AS: field.name }
  addIndexed(schemaField, field)
  return schemaField
}

function buildHashString(field: Field): any {
  const schemaField = { type: SchemaFieldTypes.TAG, AS: field.name }
  addCaseInsensitive(schemaField, field),
  addSeparable(schemaField, field),
  addSortable(schemaField, field)
  addIndexed(schemaField, field)
  return schemaField
}

function buildJsonString(field: Field): any {
  if (field.sortable)
    console.warn(`You have marked a ${field.type} field as sortable but RediSearch doesn't support the SORTABLE argument on a TAG for JSON. Ignored.`)
  const schemaField = { type: SchemaFieldTypes.TAG, AS: field.name }
  addCaseInsensitive(schemaField, field),
  addSeparable(schemaField, field),
  addIndexed(schemaField, field)
  return schemaField
}

function buildText(field: Field): any {
  const schemaField = { type: SchemaFieldTypes.TEXT, AS: field.name }
  addSortable(schemaField, field)
  addStemming(schemaField, field)
  addIndexed(schemaField, field)
  addPhonetic(schemaField, field)
  addWeight(schemaField, field)
  return schemaField
}

function addCaseInsensitive(schemaField: any, field: Field) {
  if (field.caseSensitive) schemaField.CASESENSITIVE = true
}

function addIndexed(schemaField: any, field: Field) {
  if (!field.indexed) schemaField.NOINDEX = true
}

function addStemming(schemaField: any, field: Field) {
  if (!field.stemming) schemaField.NOSTEM = true
}

function addPhonetic(schemaField: any, field: Field) {
  if (field.matcher) schemaField.PHONETIC = field.matcher
}

function addSeparable(schemaField: any, field: Field) {
  schemaField.SEPARATOR = field.separator
}

function addSortable(schemaField: any, field: Field) {
  if (field.normalized) {
    if (field.sortable) schemaField.SORTABLE = true
  } else {
    schemaField.SORTABLE = 'UNF'
  }
}

function addWeight(schemaField: any, field: Field) {
  if (field.weight) schemaField.WEIGHT = field.weight
}
