import { PointOutOfRange, RedisOmError } from "../error"
import { Point } from "../entity"

export const isNull = (value: any): boolean => value === null
export const isDefined = (value: any): boolean => value !== undefined
export const isUndefined = (value: any): boolean => value === undefined
export const isNullish = (value: any): boolean => value === undefined || value === null
export const isNotNullish = (value: any): boolean => value !== undefined && value !== null
export const isBoolean = (value: any): boolean => typeof value === 'boolean'
export const isNumber = (value: any): boolean => typeof value === 'number'
export const isString = (value: any): boolean => typeof value === 'string'
export const isDate = (value: any): boolean => value instanceof Date
export const isDateString = (value: any): boolean => isString(value) && !isNaN(new Date(value).getTime())
export const isArray = (value: any): boolean => Array.isArray(value)
export const isObject = (value: any): boolean => value !== null && typeof value === 'object' && !isArray(value) && !isDate(value)

export const isPoint = (value: any): boolean =>
  isObject(value) &&
  Object.keys(value).length === 2 &&
  typeof value.latitude === 'number' &&
  typeof value.longitude === 'number'

export const isNumberString = (value: string): boolean => !isNaN(Number(value))
export const isPointString = (value: string): boolean => /^-?\d+(\.\d*)?,-?\d+(\.\d*)?$/.test(value)

// As per https://redis.io/commands/geoadd/ and local testing
// Valid latitudes are from -85.05112878 to 85.05112878 degrees (*NOT* -90 to +90)
const isValidPoint = (value: any) =>
  Math.abs(value.latitude) <= 85.05112878 &&
  Math.abs(value.longitude) <= 180

export const convertBooleanToString = (value: boolean) => value ? '1' : '0'

export const convertNumberToString = (value: number) => value.toString()
export const convertStringToNumber = (value: string): number => Number.parseFloat(value)

export const convertDateToEpoch = (value: Date) => (value.getTime() / 1000)
export const convertDateToString = (value: Date) => convertDateToEpoch(value).toString()
export const convertEpochDateToString = (value: number) => convertNumberToString(value)

export const convertIsoDateToEpoch = (value: string) => convertDateToEpoch(new Date(value))
export const convertIsoDateToString = (value: string) => convertDateToString(new Date(value))

export const convertEpochStringToDate = (value: string): Date => new Date(convertEpochToDate(convertStringToNumber(value)))
export const convertEpochToDate = (value: number): Date => new Date(value * 1000)

export const convertPointToString = (value: Point) => {
  if (isValidPoint(value)) return `${value.longitude},${value.latitude}`
  throw new PointOutOfRange(value)
}

export const convertStringToPoint = (value: string): Point => {
  const [ longitude, latitude ] = value.split(',').map(convertStringToNumber)
  return { longitude: longitude!, latitude: latitude! }
}

export function convertKnownValueToString(value: any) {
  if (isBoolean(value)) return value.toString()
  if (isNumber(value)) return value.toString()
  if (isString(value)) return value
  throw new RedisOmError(`Expected a string but received: ${stringifyError(value)}`)
}

export const stringifyError = (value: any) => JSON.stringify(value, null, 1)
