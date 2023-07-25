import { JSONPath } from 'jsonpath-plus'
import clone from 'just-clone'

import { Field, Schema } from "../schema"
import { RedisJsonData } from "../client"

import { convertEpochToDate, convertKnownValueToString, convertStringToPoint, isArray, isBoolean, isNull, isNumber, isPointString, isString, stringifyError } from "./transformer-common"
import { EntityData } from '../entity'
import { InvalidJsonValue, NullJsonValue } from '../error'


export function fromRedisJson(schema: Schema, json: RedisJsonData): EntityData {
  const data: EntityData = clone(json)
  convertFromRedisJsonKnown(schema, data)
  return data
}

function convertFromRedisJsonKnown(schema: Schema, data: EntityData) {
  schema.fields.forEach(field => {

    const path = field.jsonPath
    const results = JSONPath({ resultType: 'all', path, json: data })

    if (field.isArray) {
      convertKnownResultsFromJson(field, results)
      return
    }

    if (results.length === 1) {
      convertKnownResultFromJson(field, results[0])
      return
    }

    if (results.length > 1) throw new InvalidJsonValue(field)
  })
}

function convertKnownResultFromJson(field: Field, result: any): any {
  const { value, parent, parentProperty } = result
  parent[parentProperty] = convertKnownValueFromJson(field, value)
}

function convertKnownResultsFromJson(field: Field, results: any[]): any {
  results.forEach((result: any) => {
    const { value, parent, parentProperty } = result
    parent[parentProperty] = convertKnownArrayValueFromJson(field, value)
  })
}

function convertKnownValueFromJson(field: Field, value: any): any {
  if (isNull(value)) return value

  switch (field.type) {
    case 'boolean':
      if (isBoolean(value)) return value
      throw new InvalidJsonValue(field)
    case 'number':
      if (isNumber(value)) return value
      throw new InvalidJsonValue(field)
    case 'date':
      if (isNumber(value)) return convertEpochToDate(value)
      throw new InvalidJsonValue(field)
    case 'point':
      if (isPointString(value)) return convertStringToPoint(value)
      throw new InvalidJsonValue(field)
    case 'string':
    case 'text':
      if (isBoolean(value)) return value.toString()
      if (isNumber(value)) return value.toString()
      if (isString(value)) return value
      throw new InvalidJsonValue(field)
  }
}

function convertKnownArrayValueFromJson(field: Field, value: any) {

  if (isNull(value)) throw new NullJsonValue(field)

  switch (field.type) {
    case 'string[]':
      if (isBoolean(value)) return value.toString()
      if (isNumber(value)) return value.toString()
      if (isString(value)) return value
      throw new InvalidJsonValue(field)
    case 'number[]':
      if (isNumber(value)) return value
      throw new InvalidJsonValue(field)
  }
}
