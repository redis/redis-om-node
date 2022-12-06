import { Field, Schema } from "../schema"
import { RedisHashData } from "../client"
import { convertBooleanToString, convertDateToString, convertEpochDateToString, convertIsoDateToString, convertNumberToString, convertPointToString, isArray, isBoolean, isDate, isNotNullish, isNumber, isObject, isPoint, isString, stringifyError } from "./transformer-common"
import { EntityData } from "../entity"

export function toRedisHash(schema: Schema, data: EntityData): RedisHashData {
  const hashData: RedisHashData = {}
  Object.entries(data).forEach(([key, value]) => {
    if (isNotNullish(value)) {
      const field = schema.fieldByName(key)
      const hashField = field ? field.hashField : key
      hashData[hashField] = field ? convertKnownValueToString(field, value) : convertUnknownValueToString(value)
    }
  })
  return hashData
}

function convertKnownValueToString(field: Field, value: any): string {
  switch (field.type) {
    case 'boolean':
      if (isBoolean(value)) return convertBooleanToString(value)
      throw Error(`Expected a boolean but received: ${stringifyError(value)}`)
    case 'number':
      if (isNumber(value)) return convertNumberToString(value)
      throw Error(`Expected a number but received: ${stringifyError(value)}`)
    case 'date':
      if (isDate(value)) return convertDateToString(value)
      if (isNumber(value)) return convertEpochDateToString(value)
      if (isString(value)) return convertIsoDateToString(value)
      throw Error(`Expected a date but received: ${stringifyError(value)}`)
    case 'point':
      if (isPoint(value)) return convertPointToString(value)
      throw Error(`Expected a point but received: ${stringifyError(value)}`)
    case 'string':
    case 'text':
      if (isBoolean(value)) return value.toString()
      if (isNumber(value)) return value.toString()
      if (isString(value)) return value
      throw Error(`Expected a string but received: ${stringifyError(value)}`)
    case 'string[]':
      if (isArray(value)) return convertStringArrayToString(value, field.separator)
      throw Error(`Expected a string[] but received: ${stringifyError(value)}`)
    default:
      throw Error(`Expected a valid field type but received: ${field.type}`)
  }
}

function convertUnknownValueToString(value: any): string {
  if (isBoolean(value)) return convertBooleanToString(value)
  if (isNumber(value)) return convertNumberToString(value)
  if (isDate(value)) return convertDateToString(value)
  if (isPoint(value)) return convertPointToString(value)
  if (isArray(value)) throw Error("You can not store an array in a Redis Hash without defining it in the Schema.")
  if (isObject(value)) throw Error("You can not store a nested object in a Redis Hash.")
  return value.toString()
}

const convertStringArrayToString = (value: string[], separator: string): string => value.join(separator)
