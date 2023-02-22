import { JSONPath } from 'jsonpath-plus'
import clone from 'just-clone'

import { Field, Schema } from "../schema"
import { RedisJsonData } from "../client"

import { convertEpochToDate, convertKnownValueToString, convertStringToPoint, isArray, isBoolean, isNull, isNumber, isString, stringifyError } from "./transformer-common"
import { EntityData } from '../entity'
import { RedisOmError } from '../errors'


export function fromRedisJson(schema: Schema, json: RedisJsonData): EntityData {
  const data: EntityData = clone(json)
  convertFromRedisJsonKnown(schema, data)
  return data
}

function convertFromRedisJsonKnown(schema: Schema, data: EntityData) {
  schema.fields.forEach(field => {

    const path = field.jsonPath
    const results = JSONPath({ resultType: 'all', path, json: data })

    if (results.length === 1) {
      const [ { value, parent, parentProperty } ] = results
      parent[parentProperty] = convertKnownValueFromJson(field, value)
    } else if (results.length > 1) {
      if (field.type === 'string[]') {
        results.forEach((result: any) => {
          const { value, parent, parentProperty } = result
          if (isNull(value)) throw `Expected a string[] from RedisJSON but received an array or object containing null: ${stringifyError(parent)}`
          parent[parentProperty] = convertKnownValueToString(value)
        })
      }
    }
  })
}

function convertKnownValueFromJson(field: Field, value: any): any {
  if (isNull(value)) return value

  switch (field.type) {
    case 'boolean':
      if (isBoolean(value)) return value
      throw new RedisOmError(`Expected a value of true, false, or null from RedisJSON for a boolean but received: ${stringifyError(value)}`)
    case 'number':
      if (isNumber(value)) return value
      throw new RedisOmError(`Expected a number from RedisJSON but received: ${stringifyError(value)}`)
    case 'date':
      if (isNumber(value)) return convertEpochToDate(value)
      throw new RedisOmError(`Expected a number containing a epoch date from RedisJSON but received: ${stringifyError(value)}`)
    case 'point':
      return convertStringToPoint(value)
    case 'string':
    case 'text':
      if (isString(value)) return value
      if (isBoolean(value)) return value.toString()
      if (isNumber(value)) return value.toString()
      throw new RedisOmError(`Expected a string from RedisJSON but received: ${stringifyError(value)}`)
    case 'string[]':
      if (isArray(value)) return convertFromJsonArrayToStringArray(value)
      throw new RedisOmError(`Expected a string[] from RedisJSON but received: ${stringifyError(value)}`)
  }
}

const convertFromJsonArrayToStringArray = (array: any[]): string[] => array.map(value => {
  if (isNull(value)) throw new RedisOmError(`Expected a string[] from RedisJSON but received an array containing null: ${stringifyError(array)}`)
  return value.toString()
})
