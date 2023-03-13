import '../../helpers/custom-matchers'

import { RedisJsonData } from "$lib/client"
import { EntityData } from "$lib/entity"
import { Schema } from "$lib/schema"
import { fromRedisJson } from "$lib/transformer"
import { InvalidJsonValue, NullJsonValue } from '$lib/error'

import { ANOTHER_STRING, A_DATE, A_DATE_EPOCH, A_DATE_EPOCH_STRING, A_NUMBER, A_NUMBER_STRING, A_POINT, A_POINT_STRING, A_STRING, A_THIRD_STRING, SOME_STRINGS, SOME_TEXT } from "../../helpers/example-data"

describe("#fromRedisJson", () => {

  let schema: Schema
  let actual: EntityData

  beforeEach(() => {
    schema = new Schema('TestPrefix', {
      aBoolean: { type: 'boolean' },
      anotherBoolean: { type: 'boolean', path: '$.aPathedBoolean' },
      aNestedBoolean: { type: 'boolean', path: '$.aNestedBoolean.aBoolean' },
      someBooleans: { type: 'boolean', path: '$.someBooleans[*]' },
      aNumber: { type: 'number' },
      anotherNumber: { type: 'number', path: '$.aPathedNumber' },
      aNestedNumber: { type: 'number', path: '$.aNestedNumber.aNumber' },
      someNumbers: { type: 'number', path: '$.someNumbers[*]' },
      aDate: { type: 'date' },
      anotherDate: { type: 'date', path: '$.aPathedDate' },
      aNestedDate: { type: 'date', path: '$.aNestedDate.aDate' },
      someDates: { type: 'number', path: '$.someDates[*]' },
      aPoint: { type: 'point' },
      anotherPoint: { type: 'point', path: '$.aPathedPoint' },
      aNestedPoint: { type: 'point', path: '$.aNestedPoint.aPoint' },
      somePoints: { type: 'point', path: '$.somePoints[*]' },
      aString: { type: 'string' },
      anotherString: { type: 'string', path: '$.aPathedString' },
      aNestedString: { type: 'string', path: '$.aNestedString.aString' },
      someStrings: { type: 'string', path: '$.someStrings[*]' },
      someText: { type: 'text' },
      someMoreText: { type: 'text', path: '$.somePathedText' },
      someNestedText: { type: 'text', path: '$.someNestedText.someText' },
      arrayOfText: { type: 'text', path: '$.arrayOfText[*]' },
      aStringArray: { type: 'string[]' },
      someStringsAsAnArray: { type: 'string[]', path: '$.someOtherStrings[*]' },
      someOtherStringsAsAnArray: { type: 'string[]', path: '$.someObjects[*].aString' }
    })
  })

  describe("when converting an empty hash", () => {
    beforeEach(() => {
      actual = fromRedisJson(schema, {})
    })

    it("returns an empty object", () => {
      expect(actual).toEqual({})
    })
  })

  describe("when converting data not described in the schema", () => {
    beforeEach(() => {
      actual = fromRedisJson(schema, {
        aTrueBoolean: true, aFalseBoolean: false,
        aMissingNumber: A_NUMBER, aMissingDate: A_DATE_EPOCH_STRING,
        aMissingPoint: A_POINT_STRING, aMissingString: A_STRING,
        aMissingEmptyArray: [],
        aMissingSingleArray: [ A_STRING ],
        aMissingArray: [ A_STRING, A_NUMBER, true ],
        aMissingObject: { withArray: [ A_STRING, A_NUMBER, true ] }
      })
    })

    it.each([
      ["leaves a true boolean as true", { aTrueBoolean: true }],
      ["leaves a false boolean as false", { aFalseBoolean: false }],
      ["leaves a number as a number", { aMissingNumber: A_NUMBER }],
      ["leaves a converted date as a string", { aMissingDate: A_DATE_EPOCH_STRING }],
      ["leaves a converted point as a string", { aMissingPoint: A_POINT_STRING }],
      ["leaves a string as a string", { aMissingString: A_STRING }],
      ["leaves an empty array empty", { aMissingEmptyArray: [] }],
      ["leaves a lonely array alone", { aMissingSingleArray: [ A_STRING ] }],
      ["leaves a populated array populated", { aMissingArray: [ A_STRING, A_NUMBER, true ] }],
      ["leaves nested objects as objects", { aMissingObject: { withArray: [ A_STRING, A_NUMBER, true ] } }]
    ])('%s', (_, expected) => {
      expect(actual).toEqual(expect.objectContaining(expected))
    })
  })

  describe("when converting data that *is* described in the schema", () => {

    it.each([

      // boolean
      ["leaves a true boolean as a boolean", { aBoolean: true }, { aBoolean: true }],
      ["leaves a false boolean as a string", { aBoolean: false }, { aBoolean: false }],
      ["leaves a null boolean as null", { aBoolean: null }, { aBoolean: null }],
      ["leaves a pathed boolean as a boolean", { aPathedBoolean: true }, { aPathedBoolean: true }],
      ["leaves a nested boolean as a boolean", { aNestedBoolean: { aBoolean: true } }, { aNestedBoolean: { aBoolean: true } }],

      // number
      ["leaves a number as a number", { aNumber: A_NUMBER }, { aNumber: A_NUMBER }],
      ["leaves a null number as null", { aNumber: null }, { aNumber: null }],
      ["leaves a pathed number as a number", { aPathedNumber: A_NUMBER }, { aPathedNumber: A_NUMBER }],
      ["leaves a nested number as a number", { aNestedNumber: { aNumber: A_NUMBER } }, { aNestedNumber: { aNumber: A_NUMBER } }],

      // date
      ["coerces a epoch date to a date", { aDate: A_DATE_EPOCH }, { aDate: A_DATE }],
      ["leaves a null date as null", { aDate: null }, { aDate: null }],
      ["coerces a pathed epoch date to a date", { aPathedDate: A_DATE_EPOCH }, { aPathedDate: A_DATE }],
      ["coerces a nested epoch date to a date", { aNestedDate: { aDate: A_DATE_EPOCH } }, { aNestedDate: { aDate: A_DATE } }],

      // point
      ["converts a point string to a point", { aPoint: A_POINT_STRING }, { aPoint: A_POINT }],
      ["leaves a null point as null", { aPoint: null }, { aPoint: null }],
      ["converts a pathed point string to a point", { aPathedPoint: A_POINT_STRING }, { aPathedPoint: A_POINT }],
      ["converts a pathed point string to a point", { aNestedPoint: { aPoint: A_POINT_STRING } }, { aNestedPoint: { aPoint: A_POINT } }],

      // string
      ["leaves a string as a string", { aString: A_STRING }, { aString: A_STRING }],
      ["leaves a null string as null", { aString: null }, { aString: null }],
      ["coerces a number to a string", { aString: A_NUMBER }, { aString: A_NUMBER_STRING }],
      ["coerces a boolean to a string", { aString: true }, { aString: 'true' }],
      ["leaves a pathed string as a string", { aPathedString: A_STRING }, { aPathedString: A_STRING }],
      ["leaves a nested string as a string", { aNestedString: { aString: A_STRING } }, { aNestedString: { aString: A_STRING } }],

      // text
      ["leaves a text as a string", { someText: SOME_TEXT }, { someText: SOME_TEXT }],
      ["leaves a null text as null", { someText: null }, { someText: null }],
      ["coerces a number text to a string", { someText: A_NUMBER }, { someText: A_NUMBER_STRING }],
      ["coerces a boolean text to a string", { someText: true }, { someText: 'true' }],
      ["leaves a pathed string as a string", { somePathedText: SOME_TEXT }, { somePathedText: SOME_TEXT }],
      ["leaves a nested string as a string", { someNestedText: { someText: SOME_TEXT } }, { someNestedText: { someText: SOME_TEXT } }],

      // string[]
      ["leaves an empty string[] empty", { aStringArray: [] }, { aStringArray: [] }],
      ["leaves a lonely string[] alone", { aStringArray: [ A_STRING ] }, { aStringArray: [ A_STRING] }],
      ["leaves a populated string[] populated", { aStringArray: SOME_STRINGS }, { aStringArray: SOME_STRINGS }],
      ["leaves a null string[] as null", { aStringArray: null }, { aStringArray: null }],
      ["leaves a string[] that doesn't contain a string[] as is", { aStringArray: 'NOT_AN_ARRAY' }, { aStringArray: 'NOT_AN_ARRAY' }],
      ["coerces numbers and booleans in a string[] to strings", { aStringArray: [ A_STRING, A_NUMBER, true] }, { aStringArray: [A_STRING, A_NUMBER_STRING, 'true'] }],

      // dispersed string[]
      ["leaves dispersed string[] as strings", { someOtherStrings: SOME_STRINGS }, { someOtherStrings: SOME_STRINGS }],
      ["coerces numbers and booleans in a dispersed string[] to strings",
        { someOtherStrings: [ A_STRING, A_NUMBER, true ] },
        { someOtherStrings: [ A_STRING, A_NUMBER_STRING, 'true' ] }],

      // widely dispersed string[]
      ["leaves widely dispersed string[] as strings",
        { someObjects: [ { aString: A_STRING }, { aString: ANOTHER_STRING }, { aString: A_THIRD_STRING } ] },
        { someObjects: [ { aString: A_STRING }, { aString: ANOTHER_STRING }, { aString: A_THIRD_STRING } ] }],
      ["coerces numbers and booleans in a widely dispersed string[] to strings",
        { someObjects: [ { aString: A_STRING }, { aString: A_NUMBER }, { aString: true } ] },
        { someObjects: [ { aString: A_STRING }, { aString: A_NUMBER_STRING }, { aString: 'true' } ] }],

    ])('%s', (_, jsonData: RedisJsonData, expected) => {
      const actual = fromRedisJson(schema, jsonData)
      expect(actual).toEqual(expected)
    })

    it.each([
      ["complains when a boolean is invalid", { aBoolean: 'NOT_A_BOOLEAN' }, `Unexpected value for field 'aBoolean' of type 'boolean' from JSON path "$.aBoolean" in Redis.`],
      ["complains when a pathed boolean is invalid", { aPathedBoolean: 'NOT_A_BOOLEAN' }, `Unexpected value for field 'anotherBoolean' of type 'boolean' from JSON path "$.aPathedBoolean" in Redis.`],
      ["complains when a nested boolean is invalid", { aNestedBoolean: { aBoolean: 'NOT_A_BOOLEAN' } }, `Unexpected value for field 'aNestedBoolean' of type 'boolean' from JSON path "$.aNestedBoolean.aBoolean" in Redis.`],

      ["complains when a number is invalid", { aNumber: 'NOT_A_NUMBER' }, `Unexpected value for field 'aNumber' of type 'number' from JSON path "$.aNumber" in Redis.`],
      ["complains when a pathed number is invalid", { aPathedNumber: 'NOT_A_NUMBER' }, `Unexpected value for field 'anotherNumber' of type 'number' from JSON path "$.aPathedNumber" in Redis.`],
      ["complains when a nested number is invalid", { aNestedNumber: { aNumber: 'NOT_A_NUMBER' } }, `Unexpected value for field 'aNestedNumber' of type 'number' from JSON path "$.aNestedNumber.aNumber" in Redis.`],

      ["complains when a date is invalid", { aDate: 'NOT_A_NUMBER' }, `Unexpected value for field 'aDate' of type 'date' from JSON path "$.aDate" in Redis.`],
      ["complains when a pathed date is invalid", { aPathedDate: 'NOT_A_NUMBER' }, `Unexpected value for field 'anotherDate' of type 'date' from JSON path "$.aPathedDate" in Redis.`],
      ["complains when a nested date is invalid", { aNestedDate: { aDate: 'NOT_A_NUMBER' } }, `Unexpected value for field 'aNestedDate' of type 'date' from JSON path "$.aNestedDate.aDate" in Redis.`],

      ["complains when a point is not a point string", { aPoint: 'NOT_A_POINT' }, `Unexpected value for field 'aPoint' of type 'point' from JSON path "$.aPoint" in Redis.`],
      ["complains when a point is not a string", { aPoint: A_NUMBER }, `Unexpected value for field 'aPoint' of type 'point' from JSON path "$.aPoint" in Redis.`],
      ["complains when a pathed point is invalid", { aPathedPoint: 'NOT_A_POINT' }, `Unexpected value for field 'anotherPoint' of type 'point' from JSON path "$.aPathedPoint" in Redis.`],
      ["complains when a nested point is invalid", { aNestedPoint: { aPoint: 'NOT_A_POINT' } }, `Unexpected value for field 'aNestedPoint' of type 'point' from JSON path "$.aNestedPoint.aPoint" in Redis.`],

      ["complains when a string is invalid", { aString: SOME_STRINGS }, `Unexpected value for field 'aString' of type 'string' from JSON path "$.aString" in Redis.`],
      ["complains when a pathed string is invalid", { aPathedString: SOME_STRINGS }, `Unexpected value for field 'anotherString' of type 'string' from JSON path "$.aPathedString" in Redis.`],
      ["complains when a nested string is invalid", { aNestedString: { aString: SOME_STRINGS } }, `Unexpected value for field 'aNestedString' of type 'string' from JSON path "$.aNestedString.aString" in Redis.`],

      ["complains when text is invalid", { someText: SOME_STRINGS }, `Unexpected value for field 'someText' of type 'text' from JSON path "$.someText" in Redis.`],
      ["complains when pathed text is invalid", { somePathedText: SOME_STRINGS }, `Unexpected value for field 'someMoreText' of type 'text' from JSON path "$.somePathedText" in Redis.`],
      ["complains when nested text is invalid", { someNestedText: { someText: SOME_STRINGS } }, `Unexpected value for field 'someNestedText' of type 'text' from JSON path "$.someNestedText.someText" in Redis.`],

    ])('%s', (_, jsonData: RedisJsonData, expectedMessage) => {
      expect(() => fromRedisJson(schema, jsonData)).toThrowErrorOfType(InvalidJsonValue, expectedMessage)
    })

    it.each([
      ["complains when a string[] contains a null", { aStringArray: [ A_STRING, null, ANOTHER_STRING ] }, `Null or undefined found in field 'aStringArray' of type 'string[]' from JSON path "$.aStringArray[*]" in Redis.`],
      ["complains when a dispersed string[] contains null", { someOtherStrings:  [ A_STRING, null, ANOTHER_STRING] }, `Null or undefined found in field 'someStringsAsAnArray' of type 'string[]' from JSON path "$.someOtherStrings[*]" in Redis.`],
      ["complains when a widely dispersed string[] contains null", { someObjects: [ { aString: A_STRING }, { aString: null }, { aString: ANOTHER_STRING } ] }, `Null or undefined found in field 'someOtherStringsAsAnArray' of type 'string[]' from JSON path "$.someObjects[*].aString" in Redis.`]

    ])('%s', (_, jsonData: RedisJsonData, expectedMessage) => {
      expect(() => fromRedisJson(schema, jsonData)).toThrowErrorOfType(NullJsonValue, expectedMessage)
    })
  })
})
