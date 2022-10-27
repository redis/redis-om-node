import { JSONPath } from 'jsonpath-plus'
import clone from 'just-clone'

import { FieldDefinition, Schema, SchemaDefinition } from "../schema";
import { RedisJsonData } from "../client";

import { convertDateToEpoch, convertIsoDateToEpoch, convertPointToString, isArray, isBoolean, isDate, isDefined, isNull, isNullish, isNumber, isObject, isPoint, isString, isUndefined, stringifyError } from "./transformer-common"


export function toRedisJson(schema: Schema<any>, data: object): RedisJsonData {
  const json: RedisJsonData = clone(data)
  convertRedisJsonKnown(schema.definition, json)
  return convertRedisJsonUnknown(json)
}

export function fromRedisJson(schema: Schema<any>, redisData: RedisJsonData): object {
  return {}
}

function convertRedisJsonKnown(schemaDef: SchemaDefinition, json: RedisJsonData) {
  Object.entries(schemaDef).forEach(([fieldName, fieldDef]) => {

    const path = fieldDef.path ?? `$.${fieldName}`
    const results = JSONPath({ resultType: 'all', path, json })

    if (results.length === 1) {
      const [ { value, parent, parentProperty } ] = results
      if (isDefined(value)) parent[parentProperty] = convertKnownValueToJson(fieldDef, value)
    } else if (results.length > 1) {
      if (fieldDef.type === 'string[]') {
        results.forEach((result: any) => {
          const { value, parent, parentProperty } = result
          if (isNull(value)) throw `Expected a string[] but received an array or object containing null: ${JSON.stringify(parent)}`
          if (isUndefined(value) && isArray(parent)) throw `Expected a string[] but received an array containing undefined: ${JSON.stringify(parent)}`
          if (isDefined(value)) parent[parentProperty] = convertKnownValueToString(value)
        })
      } else {
        throw new Error(`Expected path to point to a single value but found many: "${path}"`)
      }
    }
  })

  return json
}

function convertRedisJsonUnknown(json: RedisJsonData) {
  Object.entries(json).forEach(([key, value]) => {
    if (isUndefined(value)) {
      delete json[key]
    } else {
      json[key] = convertUnknownValueToJson(value)
    }
  })

  return json
}

function convertKnownValueToJson(fieldDef: FieldDefinition, value: any): any {

  if (isNull(value)) return value

  switch (fieldDef.type) {
    case 'boolean':
      if (isBoolean(value)) return value
      throw Error(`Expected a boolean but received: ${stringifyError(value)}`)
    case 'number':
      if (isNumber(value)) return value
      throw Error(`Expected a number but received: ${stringifyError(value)}`)
    case 'date':
      if (isDate(value)) return convertDateToEpoch(value)
      if (isString(value)) return convertIsoDateToEpoch(value)
      if (isNumber(value)) return value
      throw Error(`Expected a date but received: ${stringifyError(value)}`)
    case 'point':
      if (isPoint(value)) return convertPointToString(value)
      throw Error(`Expected a point but received: ${stringifyError(value)}`)
    case 'string':
    case 'text':
      return convertKnownValueToString(value)
    case 'string[]':
      if (isArray(value)) return convertArrayToStringArray(value)
      throw Error(`Expected a string[] but received: ${stringifyError(value)}`)
  }
}

function convertUnknownValueToJson(value: any): any {
  if (isObject(value)) return convertRedisJsonUnknown(value)
  if (isDate(value)) return convertDateToEpoch(value)
  return value
}

function convertKnownValueToString(value: any) {
  if (isBoolean(value)) return value.toString()
  if (isNumber(value)) return value.toString()
  if (isString(value)) return value
  throw Error(`Expected a string but received: ${stringifyError(value)}`)
}

const convertArrayToStringArray = (array: any[]): string[] => array.map(value => {
  if (isNull(value)) throw `Expected a string[] but received an array containing null: ${JSON.stringify(array)}`
  if (isUndefined(value)) throw `Expected a string[] but received an array containing undefined: ${JSON.stringify(array)}`
  return value.toString()
})
