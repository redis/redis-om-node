import { JSONPath } from 'jsonpath-plus'
import clone from 'just-clone'

import { Schema, SchemaDefinition } from "../schema";
import { RedisJsonData } from "../client";

import { convertDateToEpoch, convertIsoDateToEpoch, convertKnownValueToString, convertPointToString, isArray, isBoolean, isDate, isDefined, isNull, isNumber, isObject, isPoint, isString, isUndefined, stringifyError } from "./transformer-common"

export function toRedisJson(schema: Schema<any>, data: object): RedisJsonData {
  let json: RedisJsonData = clone(data)
  convertToRedisJsonKnown(schema.definition, json)
  return convertToRedisJsonUnknown(json)
}

function convertToRedisJsonKnown(schemaDef: SchemaDefinition, json: RedisJsonData) {
  Object.entries(schemaDef).forEach(([fieldName, fieldDef]) => {

    const type = fieldDef.type
    const path = fieldDef.path ?? `$.${fieldName}`
    const results = JSONPath({ resultType: 'all', path, json })

    if (results.length === 1) {
      convertKnownResultToJson(type, results[0])
    } else if (results.length > 1) {
      convertKnownResultsToJson(type, path, results)
    }
  })
}

function convertToRedisJsonUnknown(json: RedisJsonData) {
  Object.entries(json).forEach(([key, value]) => {
    if (isUndefined(value)) {
      delete json[key]
    } else if (isObject(value)) {
      json[key] = convertToRedisJsonUnknown(value)
    } else {
      json[key] = convertUnknownValueToJson(value)
    }
  })
  return json
}

function convertKnownResultToJson(fieldType: string, result: any): any {
  const { value, parent, parentProperty } = result
  if (isDefined(value)) parent[parentProperty] = convertKnownValueToJson(fieldType, value)
}

function convertKnownResultsToJson(fieldType: string, path: string, results: any[]): any {
  if (fieldType === 'string[]') {
    results.forEach((result: any) => {
      const { value, parent, parentProperty } = result
      if (isNull(value)) throw `Expected a string[] but received an array or object containing null: ${stringifyError(parent)}`
      if (isUndefined(value) && isArray(parent)) throw `Expected a string[] but received an array containing undefined: ${stringifyError(parent)}`
      if (isDefined(value)) parent[parentProperty] = convertKnownValueToString(value)
    })
  } else {
    throw new Error(`Expected path to point to a single value but found many: "${path}"`)
  }
}

function convertKnownValueToJson(fieldType: string, value: any): any {

  if (isNull(value)) return value

  switch (fieldType) {
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
  if (isDate(value)) return convertDateToEpoch(value)
  return value
}

const convertArrayToStringArray = (array: any[]): string[] => array.map(value => {
  if (isNull(value)) throw `Expected a string[] but received an array containing null: ${stringifyError(array)}`
  if (isUndefined(value)) throw `Expected a string[] but received an array containing undefined: ${stringifyError(array)}`
  return value.toString()
})
