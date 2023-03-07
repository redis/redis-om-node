import { JSONPath } from 'jsonpath-plus'
import clone from 'just-clone'

import { Field, Schema } from "../schema"
import { RedisJsonData } from "../client"

import { convertDateToEpoch, convertIsoDateToEpoch, convertKnownValueToString, convertPointToString, isArray, isBoolean, isDate, isDateString, isDefined, isNull, isNumber, isObject, isPoint, isString, isUndefined, stringifyError } from "./transformer-common"
import { EntityData } from '../entity'
import { InvalidJsonInput, NullJsonInput } from '../error'

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

    throw new InvalidJsonInput(field)
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
    if (isNull(value)) throw new NullJsonInput(field)
    if (isUndefined(value) && isArray(parent)) throw new NullJsonInput(field)
    if (isDefined(value)) parent[parentProperty] = convertKnownValueToString(value)
  })
}

function convertKnownValueToJson(field: Field, value: any): any {

  if (isNull(value)) return value

  switch (field.type) {
    case 'boolean':
      if (isBoolean(value)) return value
      throw new InvalidJsonInput(field)
    case 'number':
      if (isNumber(value)) return value
      throw new InvalidJsonInput(field)
    case 'date':
      if (isNumber(value)) return value
      if (isDate(value)) return convertDateToEpoch(value)
      if (isDateString(value)) return convertIsoDateToEpoch(value)
      throw new InvalidJsonInput(field)
    case 'point':
      if (isPoint(value)) return convertPointToString(value)
      throw new InvalidJsonInput(field)
    case 'string':
    case 'text':
      if (isBoolean(value)) return value.toString()
      if (isNumber(value)) return value.toString()
      if (isString(value)) return value
      throw new InvalidJsonInput(field)
  }
}

function convertUnknownValueToJson(value: any): any {
  if (isDate(value)) return convertDateToEpoch(value)
  return value
}
