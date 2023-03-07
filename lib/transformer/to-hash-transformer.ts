import { Field, Schema } from "../schema"
import { RedisHashData } from "../client"
import { convertBooleanToString, convertDateToString, convertEpochDateToString, convertIsoDateToString, convertNumberToString, convertPointToString, isArray, isBoolean, isDate, isDateString, isNotNullish, isNumber, isObject, isPoint, isString, stringifyError } from "./transformer-common"
import { EntityData } from "../entity"
import { InvalidHashInput, NestedHashInput, RedisOmError, ArrayHashInput } from "../error"

export function toRedisHash(schema: Schema, data: EntityData): RedisHashData {
  const hashData: RedisHashData = {}
  Object.entries(data).forEach(([key, value]) => {
    if (isNotNullish(value)) {
      const field = schema.fieldByName(key)
      const hashField = field ? field.hashField : key
      hashData[hashField] = field ? convertKnownValueToString(field, value) : convertUnknownValueToString(key, value)
    }
  })
  return hashData
}

function convertKnownValueToString(field: Field, value: any): string {
  switch (field.type) {
    case 'boolean':
      if (isBoolean(value)) return convertBooleanToString(value)
      throw new InvalidHashInput(field)
    case 'number':
      if (isNumber(value)) return convertNumberToString(value)
      throw new InvalidHashInput(field)
    case 'date':
      if (isNumber(value)) return convertEpochDateToString(value)
      if (isDate(value)) return convertDateToString(value)
      if (isDateString(value)) return convertIsoDateToString(value)
      throw new InvalidHashInput(field)
    case 'point':
      if (isPoint(value)) return convertPointToString(value)
      throw new InvalidHashInput(field)
    case 'string':
    case 'text':
      if (isBoolean(value)) return value.toString()
      if (isNumber(value)) return value.toString()
      if (isString(value)) return value
      throw new InvalidHashInput(field)
    case 'string[]':
      if (isArray(value)) return convertStringArrayToString(value, field.separator)
      throw new InvalidHashInput(field)
    default:
      throw new RedisOmError(`Expected a valid field type but received: ${field.type}`)
  }
}

function convertUnknownValueToString(key: string, value: any): string {
  if (isBoolean(value)) return convertBooleanToString(value)
  if (isNumber(value)) return convertNumberToString(value)
  if (isDate(value)) return convertDateToString(value)
  if (isPoint(value)) return convertPointToString(value)
  if (isArray(value)) throw new ArrayHashInput(key)
  if (isObject(value)) throw new NestedHashInput(key)
  return value.toString()
}

const convertStringArrayToString = (value: string[], separator: string): string => value.join(separator)
