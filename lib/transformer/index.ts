import { FieldDefinition, Schema } from "../schema";
import { RedisHashData, RedisJsonData } from "../client";
import { Point } from "../entity/point";

export function toRedisHash(schema: Schema<any>, data: object): RedisHashData {
  const hashData: RedisHashData = {}
  Object.entries(data).forEach(([key, value]) => {
    if (!isNullish(value)) {
      const fieldDef = schema.definition[key]
      const alias = fieldDef?.alias ?? key
      hashData[alias] = fieldDef ? convertKnownValueToString(fieldDef, value) : convertUnknownValueToString(value)
    }
  })
  return hashData
}

export function fromRedisHash(schema: Schema<any>, hashData: RedisHashData): object {
  const data: { [key: string]: any } = { ...hashData }
  Object.entries(schema.definition).forEach(([fieldName, fieldDef]) => {
    if (fieldDef.alias) delete data[fieldDef.alias]
    const value = hashData[fieldDef.alias ?? fieldName]
    if (!isNullish(value)) data[fieldName] = convertKnownValueFromString(fieldDef, value)
  })
  return data
}

export function toRedisJson(schema: Schema<any>, data: object): RedisJsonData {
  return {}
}

export function fromRedisJson(schema: Schema<any>, redisData: RedisJsonData): object {
  return {}
}

function convertKnownValueToString(fieldDef: FieldDefinition, value: any): string {
  switch (fieldDef.type) {
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
      if (isBoolean(value)) return value ? 'true' : 'false'
      if (isNumber(value)) return value.toString()
      if (isString(value)) return value
      throw Error(`Expected a string but received: ${stringifyError(value)}`)
    case 'string[]':
      if (isArray(value)) return convertStringArrayToString(value, fieldDef.separator)
      throw Error(`Expected a string[] but received: ${stringifyError(value)}`)
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

function convertKnownValueFromString(fieldDef: FieldDefinition, value: string): any {
  switch (fieldDef.type) {
    case 'boolean':
      if (isBooleanString(value)) return value === '1'
      throw Error(`Expected a value of '1' or '0' from Redis for a boolean but received: ${stringifyError(value)}`)
    case 'number':
      if (isNumberString(value)) return convertStringToNumber(value)
      throw Error(`Expected a string containing a number from Redis but received: ${stringifyError(value)}`)
    case 'date':
      if (isNumberString(value)) return convertStringToDate(value)
      throw Error(`Expected an string containing a epoch date from Redis but received: ${stringifyError(value)}`)
    case 'point':
      if (isPointString(value)) return convertStringToPoint(value)
      throw Error(`Expected a point string from Redis but received: ${stringifyError(value)}`)
    case 'string':
    case 'text':
      return value
    case 'string[]':
      return convertStringToStringArray(value, fieldDef.separator)
  }
}

const isNullish = (value: any): boolean => value === undefined || value === null
const isBoolean = (value: any): boolean => typeof value === 'boolean'
const isNumber = (value: any): boolean => typeof value === 'number'
const isString = (value: any): boolean => typeof value === 'string'
const isDate = (value: any): boolean => value instanceof Date
const isArray = (value: any): boolean => Array.isArray(value)
const isObject = (value: any): boolean => typeof value === 'object'

const isPoint = (value: any): boolean =>
  isObject(value) &&
  Object.keys(value).length === 2 &&
  typeof value.latitude === 'number' &&
  typeof value.longitude === 'number'

const isBooleanString = (value: string): boolean => value === '1' || value === '0'
const isNumberString = (value: string): boolean => !Number.isNaN(Number(value))
const isPointString = (value: string): boolean => !!value.match(/^-?\d+(\.\d*)?,-?\d+(\.\d*)?$/)

// As per https://redis.io/commands/geoadd/ and local testing
// Valid latitudes are from -85.05112878 to 85.05112878 degrees (*NOT* -90 to +90)
const isValidPoint = (value: any) =>
  Math.abs(value.latitude) <= 85.05112878 &&
  Math.abs(value.longitude) <= 180

const convertBooleanToString = (value: boolean) => value ? '1' : '0'

const convertNumberToString = (value: number) => value.toString()
const convertStringToNumber = (value: string): number => Number.parseFloat(value)

const convertDateToString = (value: Date) => (value.getTime() / 1000).toString()
const convertEpochDateToString = (value: number) => convertNumberToString(value)
const convertIsoDateToString = (value: string) => {
  const date = new Date(value)
  if (isNaN(date.getTime())) throw Error(`Expected a date but received: ${stringifyError(value)}`)
  return convertDateToString(date)
}

const convertStringToDate = (value: string): Date => new Date(convertStringToNumber(value) * 1000)

const convertPointToString = (value: Point) => {
  if (isValidPoint(value)) return `${value.longitude},${value.latitude}`
  throw Error("Points must be between ±85.05112878 latitude and ±180 longitude")
}

const convertStringToPoint = (value: string): Point => {
  const [longitude, latitude] = value.split(',').map(convertStringToNumber)
  return { longitude, latitude }
}

const convertStringArrayToString = (value: string[], separator?: string): string => value.join(separator ?? '|')
const convertStringToStringArray = (value: string, separator?: string): string[] => value.split(separator ?? '|')

const stringifyError = (value: any) => JSON.stringify(value, null, 1)
