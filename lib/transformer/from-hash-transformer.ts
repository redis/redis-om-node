import { Field, Schema } from "../schema"
import { RedisHashData } from "../client"
import { convertEpochStringToDate, convertStringToNumber, convertStringToPoint, isNotNullish, isNumberString, stringifyError } from "./transformer-common"
import { EntityData } from "../entity"

export function fromRedisHash(schema: Schema, hashData: RedisHashData): EntityData {
  const data: { [key: string]: any } = { ...hashData }
  schema.fields.forEach(field => {
    if (field.hashField) delete data[field.hashField]
    const value = hashData[field.hashField]
    if (isNotNullish(value)) data[field.name] = convertKnownValueFromString(field, value!)
  })
  return data
}

function convertKnownValueFromString(field: Field, value: string): any {
  switch (field.type) {
    case 'boolean':
      if (value === '1') return true
      if (value === '0') return false
      throw Error(`Expected a value of '1' or '0' from Redis for a boolean but received: ${stringifyError(value)}`)
    case 'number':
      if (isNumberString(value)) return convertStringToNumber(value)
      throw Error(`Expected a string containing a number from Redis but received: ${stringifyError(value)}`)
    case 'date':
      if (isNumberString(value)) return convertEpochStringToDate(value)
      throw Error(`Expected an string containing a epoch date from Redis but received: ${stringifyError(value)}`)
    case 'point':
      return convertStringToPoint(value)
    case 'string':
    case 'text':
      return value
    case 'string[]':
      return convertStringToStringArray(value, field.separator)
  }
}

const convertStringToStringArray = (value: string, separator: string): string[] => value.split(separator)
