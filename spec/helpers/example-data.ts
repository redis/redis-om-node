import { Point } from "$lib/entity"

export const A_STRING = 'foo'
export const ANOTHER_STRING = 'bar'
export const A_THIRD_STRING = 'baz'

export const SOME_TEXT = "The quick brown fox jumped over the lazy dog."
export const SOME_OTHER_TEXT = "The five boxing wizards jump quickly."
export const SOME_MORE_TEXT = "How vexingly quick daft zebras jump!"

export const A_NUMBER = 42
export const A_NUMBER_STRING = A_NUMBER.toString()

export const ANOTHER_NUMBER = 23
export const ANOTHER_NUMBER_STRING = ANOTHER_NUMBER.toString()

export const A_THIRD_NUMBER = 13
export const A_THIRD_NUMBER_STRING = A_THIRD_NUMBER.toString()

export const A_DATE: Date = new Date('1997-07-04T16:56:55.456Z')
export const A_DATE_ISO: string = A_DATE.toISOString()
export const A_DATE_EPOCH: number = A_DATE.getTime() / 1000
export const A_DATE_EPOCH_STRING: string = A_DATE_EPOCH.toString()

export const ANOTHER_DATE: Date = new Date('1969-07-20T20:17:40.000Z')
export const ANOTHER_DATE_ISO: string = ANOTHER_DATE.toISOString()
export const ANOTHER_DATE_EPOCH: number = ANOTHER_DATE.getTime() / 1000
export const ANOTHER_DATE_EPOCH_STRING: string = ANOTHER_DATE_EPOCH.toString()

export const A_THIRD_DATE: Date = new Date('2015-07-14T11:49:57.000Z')
export const A_THIRD_DATE_ISO: string = A_THIRD_DATE.toISOString()
export const A_THIRD_DATE_EPOCH: number = A_THIRD_DATE.getTime() / 1000
export const A_THIRD_DATE_EPOCH_STRING: string = A_THIRD_DATE_EPOCH.toString()

export const A_POINT: Point = { longitude: 12.34, latitude: 56.78 }
export const A_POINT_JSON: string = JSON.stringify(A_POINT)
export const A_POINT_STRING: string = `${A_POINT.longitude},${A_POINT.latitude}`
export const A_POINT_PRETTY_JSON: string = JSON.stringify(A_POINT, null, 1)

export const ANOTHER_POINT: Point = { longitude: -23.45, latitude: 67.89 }
export const ANOTHER_POINT_JSON: string = JSON.stringify(ANOTHER_POINT)
export const ANOTHER_POINT_STRING: string = `${ANOTHER_POINT.longitude},${ANOTHER_POINT.latitude}`

export const A_THIRD_POINT: Point = { longitude: -34.56, latitude: 78.90 }
export const A_THIRD_POINT_JSON: string = JSON.stringify(A_THIRD_POINT)
export const A_THIRD_POINT_STRING: string = `${A_THIRD_POINT.longitude},${A_THIRD_POINT.latitude}`

export const AN_INVALID_POINT: Point = { longitude: 123.4, latitude: 85.05112879 }
export const AN_INVALID_POINT_STRING: string = `${AN_INVALID_POINT.longitude},${AN_INVALID_POINT.latitude}`

export const A_PARITAL_POINT = { latitude: 85.05112879 }

export const SOME_STRINGS: Array<string> = ['alfa', 'bravo', 'charlie']
export const SOME_STRINGS_JSON: string = JSON.stringify(SOME_STRINGS)
export const SOME_STRINGS_JOINED: string = SOME_STRINGS.join('|')

export const SOME_OTHER_STRINGS: Array<string> = ['bravo', 'charlie', 'delta']
export const SOME_OTHER_STRINGS_JSON: string = JSON.stringify(SOME_OTHER_STRINGS)
export const SOME_OTHER_STRINGS_JOINED: string = SOME_OTHER_STRINGS.join('|')

export const SOME_MORE_STRINGS: Array<string> = ['charlie', 'delta', 'echo']
export const SOME_MORE_STRINGS_JSON: string = JSON.stringify(SOME_MORE_STRINGS)
export const SOME_MORE_STRINGS_JOINED: string = SOME_MORE_STRINGS.join('|')
