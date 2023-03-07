import { Field, Schema } from "../schema"
import { RedisHashData } from "../client"
import { convertEpochStringToDate, convertStringToNumber, convertStringToPoint, isNotNullish, isNumberString, isPointString, stringifyError } from "./transformer-common"
import { EntityData } from "../entity"
import { InvalidHashValue } from "../error"

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
      throw new InvalidHashValue(field)
    case 'number':
      if (isNumberString(value)) return convertStringToNumber(value)
      throw new InvalidHashValue(field)
    case 'date':
      if (isNumberString(value)) return convertEpochStringToDate(value)
      throw new InvalidHashValue(field)
    case 'point':
      if (isPointString(value)) return convertStringToPoint(value)
      throw new InvalidHashValue(field)
    case 'string':
    case 'text':
      return value
    case 'string[]':
      return convertStringToStringArray(value, field.separator)
  }
}

const convertStringToStringArray = (value: string, separator: string): string[] => value.split(separator)
