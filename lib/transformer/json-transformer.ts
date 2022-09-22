import { JSONPath } from 'jsonpath-plus'
import clone from 'just-clone'

import { FieldDefinition, Schema, SchemaDefinition } from "../schema";
import { RedisJsonData } from "../client";

import { convertDateToEpoch, isBoolean, isDate, isDefined, isNull, isNumber, isObject, isUndefined, stringifyError } from "./transformer-common"


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
    const result = JSONPath({ resultType: 'all', path, json })

    if (result.length === 1) {
      const [ { value, parent, parentProperty } ] = result
      if (isDefined(value)) parent[parentProperty] = convertKnownValueToJson(fieldDef, value)
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
    default:
      return value
  }
}

function convertUnknownValueToJson(value: any): any {
  if (isObject(value)) return convertRedisJsonUnknown(value)
  if (isDate(value)) return convertDateToEpoch(value)
  return value
}
