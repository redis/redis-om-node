import { JSONPath } from 'jsonpath-plus'
import clone from 'just-clone'

import { FieldDefinition, Schema, SchemaDefinition } from "../schema";
import { RedisHashData, RedisJsonData } from "../client";
import { Point } from "../entity/point";

export function toRedisHash(schema: Schema<any>, data: object): RedisHashData {
  const hashData: RedisHashData = {}
  Object.entries(data).forEach(([key, value]) => {
    if (isNotNullish(value)) {
      const fieldDef = schema.definition[key]
      const hashField = fieldDef?.field ?? key
      hashData[hashField] = fieldDef ? convertKnownValueToString(fieldDef, value) : convertUnknownValueToString(value)
    }
  })
  return hashData
}

export function fromRedisHash(schema: Schema<any>, hashData: RedisHashData): object {
  const data: { [key: string]: any } = { ...hashData }
  Object.entries(schema.definition).forEach(([fieldName, fieldDef]) => {
    if (fieldDef.field) delete data[fieldDef.field]
    const value = hashData[fieldDef.field ?? fieldName]
    if (isNotNullish(value)) data[fieldName] = convertKnownValueFromString(fieldDef, value)
  })
  return data
}

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
      parent[parentProperty] = convertKnownValueToJson(fieldDef, value)
    }
  })

  return json
}

function convertRedisJsonUnknown(json: RedisJsonData) {
  Object.entries(json).forEach(([key, value]) => {
    if (isDefined(value)) {
      json[key] = convertUnknownValueToJson(value)
    } else {
      delete json[key]
    }
  })

  return json
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
      if (isBoolean(value)) return value.toString()
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

function convertKnownValueToJson(fieldDef: FieldDefinition, value: any): any {

  if (isNullish(value)) return value

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

function convertKnownValueFromString(fieldDef: FieldDefinition, value: string): any {
  switch (fieldDef.type) {
    case 'boolean':
      if (value === '1') return true;
      if (value === '0') return false;
      throw Error(`Expected a value of '1' or '0' from Redis for a boolean but received: ${stringifyError(value)}`)
    case 'number':
      if (isNumberString(value)) return convertStringToNumber(value)
      throw Error(`Expected a string containing a number from Redis but received: ${stringifyError(value)}`)
    case 'date':
      if (isNumberString(value)) return convertEpochStringToDate(value)
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
const isNotNullish = (value: any): boolean => !isNullish(value)
const isDefined = (value: any): boolean => !isUndefined(value)
const isUndefined = (value: any): boolean => value === undefined
const isBoolean = (value: any): boolean => typeof value === 'boolean'
const isNumber = (value: any): boolean => typeof value === 'number'
const isString = (value: any): boolean => typeof value === 'string'
const isDate = (value: any): boolean => value instanceof Date
const isArray = (value: any): boolean => Array.isArray(value)
const isObject = (value: any): boolean => value !== null && typeof value === 'object' && !isArray(value) && !isDate(value)

const isPoint = (value: any): boolean =>
  isObject(value) &&
  Object.keys(value).length === 2 &&
  typeof value.latitude === 'number' &&
  typeof value.longitude === 'number'

const isNumberString = (value: string): boolean => !isNaN(Number(value))
const isPointString = (value: string): boolean => /^-?\d+(\.\d*)?,-?\d+(\.\d*)?$/.test(value)

// As per https://redis.io/commands/geoadd/ and local testing
// Valid latitudes are from -85.05112878 to 85.05112878 degrees (*NOT* -90 to +90)
const isValidPoint = (value: any) =>
  Math.abs(value.latitude) <= 85.05112878 &&
  Math.abs(value.longitude) <= 180

const convertBooleanToString = (value: boolean) => value ? '1' : '0'

const convertNumberToString = (value: number) => value.toString()
const convertStringToNumber = (value: string): number => Number.parseFloat(value)

const convertDateToEpoch = (value: Date) => (value.getTime() / 1000)
const convertDateToString = (value: Date) => convertDateToEpoch(value).toString()
const convertEpochDateToString = (value: number) => convertNumberToString(value)
const convertIsoDateToString = (value: string) => {
  const date = new Date(value)
  if (isNaN(date.getTime())) throw Error(`Expected a date but received: ${stringifyError(value)}`)
  return convertDateToString(date)
}

const convertEpochToDate = (value: number): Date => new Date(value * 1000)
const convertEpochStringToDate = (value: string): Date => new Date(convertEpochToDate(convertStringToNumber(value)))

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
