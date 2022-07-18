import { FieldDefinition, Schema } from "../schema";
import { RedisHashData, RedisJsonData } from "../client";
import { Point } from "../entity/point";

export function toRedisHash(schema: Schema<any>, data: object): RedisHashData {
  const hashData: RedisHashData = {}
  Object.entries(data).forEach(([key, value]) => {
    if (!isNullish(value)) {
      const fieldDef = schema.definition[key]
      hashData[key] = fieldDef ? convertKnownValueToString(fieldDef, value) : convertUnknownValueToString(value)
    }
  })
  return hashData
}

function convertKnownValueToString(fieldDef: FieldDefinition, value: any): string {
  switch (fieldDef.type) {
    case 'boolean':
      if (isBoolean(value)) return convertBoolean(value)
      throw Error("something")
    case 'number':
      if (isNumber(value)) return convertNumber(value)
      throw Error("something")
    case 'date':
      if (isDate(value)) return convertDate(value)
      throw Error("something")
    case 'point':
      if (isPoint(value)) return convertPoint(value)
      throw Error("something")
    case 'string':
    case 'text':
      if (isBoolean(value)) return value ? 'true' : 'false'
      if (isNumber(value)) return value.toString()
      if (isString(value)) return value
      throw Error("something")
    case 'string[]':
      throw Error("something")
  }
}

function convertUnknownValueToString(value: any): string {
  if (isBoolean(value)) return convertBoolean(value)
  if (isNumber(value)) return convertNumber(value)
  if (isDate(value)) return convertDate(value)
  if (isPoint(value)) return convertPoint(value)
  if (isArray(value)) throw Error("You can not store an array in a Redis Hash without defining it in the Schema.")
  if (isObject(value)) throw Error("You can not store a nested object in a Redis Hash.")
  return value.toString()
}

const isNullish = (value: any) => value === undefined || value === null
const isBoolean = (value: any) => typeof value === 'boolean'
const isNumber = (value: any) => typeof value === 'number'
const isString = (value: any) => typeof value === 'string'
const isDate = (value: any) => value instanceof Date
const isArray = (value: any) => Array.isArray(value)
const isObject = (value: any) => typeof value === 'object'

const isPoint = (value: any) =>
  isObject(value) &&
  Object.keys(value).length === 2 &&
  typeof value.latitude === 'number' &&
  typeof value.longitude === 'number'

// As per https://redis.io/commands/geoadd/ and local testing
// Valid latitudes are from -85.05112878 to 85.05112878 degrees (*NOT* -90 to +90)
const isValidPoint = (value: any) =>
  Math.abs(value.latitude) <= 85.05112878 &&
  Math.abs(value.longitude) <= 180

const convertBoolean = (value: boolean) => value ? '1' : '0'
const convertNumber = (value: number) => value.toString()
const convertDate = (value: Date) => (value.getTime() / 1000).toString()
const convertPoint = (value: Point) => {
  if (isValidPoint(value)) return `${value.longitude},${value.latitude}`
  throw Error("Points must be between ±85.05112878 latitude and ±180 longitude")
}

export function fromRedisHash(schema: Schema<any>, redisData: RedisHashData): object {
  return {}
}

export function toRedisJson(schema: Schema<any>, data: object): RedisJsonData {
  return {}
}

export function fromRedisJson(schema: Schema<any>, redisData: RedisJsonData): object {
  return {}
}
