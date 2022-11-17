import { JSONPath } from 'jsonpath-plus'
import clone from 'just-clone'

import { FieldDefinition, Schema, SchemaDefinition } from "../schema";
import { RedisJsonData } from "../client";

import { convertEpochToDate, convertKnownValueToString, convertStringToPoint, isArray, isBoolean, isNull, isNumber, isPointString, isString, stringifyError } from "./transformer-common"


export function fromRedisJson(schema: Schema<any>, json: RedisJsonData): object {
  const data: object = clone(json)
  convertFromRedisJsonKnown(schema.definition, data)
  return data
}

function convertFromRedisJsonKnown(schemaDef: SchemaDefinition, data: object) {
  Object.entries(schemaDef).forEach(([fieldName, fieldDef]) => {

    const path = fieldDef.path ?? `$.${fieldName}`
    const results = JSONPath({ resultType: 'all', path, json: data })

    if (results.length === 1) {
      const [ { value, parent, parentProperty } ] = results
      parent[parentProperty] = convertKnownValueFromJson(fieldDef, value)
    } else if (results.length > 1) {
      if (fieldDef.type === 'string[]') {
        results.forEach((result: any) => {
          const { value, parent, parentProperty } = result
          if (isNull(value)) throw `Expected a string[] from RedisJSON but received an array or object containing null: ${stringifyError(parent)}`
          parent[parentProperty] = convertKnownValueToString(value)
        })
      }
    }
  })
}

function convertKnownValueFromJson(fieldDef: FieldDefinition, value: any): any {
  if (isNull(value)) return value

  switch (fieldDef.type) {
    case 'boolean':
      if (isBoolean(value)) return value
      throw Error(`Expected a value of true, false, or null from RedisJSON for a boolean but received: ${stringifyError(value)}`)
    case 'number':
      if (isNumber(value)) return value
      throw Error(`Expected a number from RedisJSON but received: ${stringifyError(value)}`)
    case 'date':
      if (isNumber(value)) return convertEpochToDate(value)
      throw Error(`Expected a number containing a epoch date from RedisJSON but received: ${stringifyError(value)}`)
    case 'point':
      if (isPointString(value)) return convertStringToPoint(value)
      throw Error(`Expected a point string from RedisJSON but received: ${stringifyError(value)}`)
    case 'string':
    case 'text':
      if (isString(value)) return value
      if (isBoolean(value)) return value.toString()
      if (isNumber(value)) return value.toString()
      throw Error(`Expected a string from RedisJSON but received: ${stringifyError(value)}`)
    case 'string[]':
      if (isArray(value)) return convertFromJsonArrayToStringArray(value)
      throw Error(`Expected a string[] from RedisJSON but received: ${stringifyError(value)}`)
  }
}

const convertFromJsonArrayToStringArray = (array: any[]): string[] => array.map(value => {
  if (isNull(value)) throw `Expected a string[] from RedisJSON but received an array containing null: ${stringifyError(array)}`
  return value.toString()
})
