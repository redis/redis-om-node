import { JSONPath } from 'jsonpath-plus'
import clone from 'just-clone'

import { Field, Schema } from "../schema"
import { RedisJsonData } from "../client"

import { convertDateToEpoch, convertIsoDateToEpoch, convertKnownValueToString, convertPointToString, isArray, isBoolean, isDate, isDefined, isNull, isNumber, isObject, isPoint, isString, isUndefined, stringifyError } from "./transformer-common"
import { EntityData } from '../entity'

export function toRedisJson(schema: Schema, data: EntityData): RedisJsonData {
  let json: RedisJsonData = clone(data)
  convertToRedisJsonKnown(schema, json)
  return convertToRedisJsonUnknown(json)
}

function convertToRedisJsonKnown(schema: Schema, json: RedisJsonData) {
  schema.fields.forEach(field => {

    const results = JSONPath({ resultType: 'all', path: field.jsonPath, json })

    if (field.type === 'string[]') {
      convertKnownResultsToJson(field, results)
      return
    }

    if (results.length === 0) return

    if (results.length === 1) {
      convertKnownResultToJson(field, results[0])
      return
    }

    throw new Error(`Expected path to point to a single value but found many: "${field.jsonPath}"`)
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

function convertKnownResultToJson(field: Field, result: any): any {
  const { value, parent, parentProperty } = result
  if (isDefined(value)) parent[parentProperty] = convertKnownValueToJson(field, value)
}

function convertKnownResultsToJson(field: Field, results: any[]): any {
  results.forEach((result: any) => {
    const { value, parent, parentProperty } = result
    if (isNull(value)) throw `Expected a string[] but received an array or object containing null: ${stringifyError(parent)}`
    if (isUndefined(value) && isArray(parent)) throw `Expected a string[] but received an array containing undefined: ${stringifyError(parent)}`
    if (isDefined(value)) parent[parentProperty] = convertKnownValueToString(value)
  })
}

function convertKnownValueToJson(field: Field, value: any): any {

  if (isNull(value)) return value

  switch (field.type) {
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
