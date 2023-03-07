import '../../helpers/custom-matchers'

import { RedisJsonData } from "$lib/client"
import { InvalidJsonInput, NullJsonInput, PointOutOfRange } from "$lib/error"
import { Schema } from "$lib/schema"
import { toRedisJson } from "$lib/transformer"

import { ANOTHER_STRING, AN_INVALID_POINT, A_DATE, A_DATE_EPOCH, A_DATE_ISO, A_NUMBER, A_NUMBER_STRING, A_PARITAL_POINT, A_POINT, A_POINT_STRING, A_STRING, A_THIRD_STRING, SOME_STRINGS, SOME_TEXT } from "../../helpers/example-data"


describe("#toRedisJson", () => {

  let schema: Schema
  let actual: RedisJsonData

  describe("when converting data not described in the schema", () => {
    beforeEach(() => {
      schema = new Schema('TestPrefix', {})
      actual = toRedisJson(schema, {
        aTrueBoolean: true, aFalseBoolean: false, aNumber: A_NUMBER, aString: A_STRING,
        aDate: A_DATE, aNestedDate: { aDate: A_DATE },
        aPoint: A_POINT, aNull: null, somethingUndefined: undefined,
        aNestedUndefined: { somethingUndefined: undefined },
        anArray: [ A_STRING, A_NUMBER, true ], anEmptyArray: [],
        anObject: { aString: A_STRING, aNumber: A_NUMBER, aBoolean: true }, anEmptyObject: {}
      })
    })

    it.each([
      ["leaves a true boolean as a boolean", { aTrueBoolean: true }],
      ["leaves a false boolean as a boolean", { aFalseBoolean: false }],
      ["leaves a a number as a number", { aNumber: A_NUMBER }],
      ["leaves a string as a string", { aString: A_STRING }],
      ["converts a date to an epoch number", { aDate: A_DATE_EPOCH }],
      ["converts a nested date to an epoch number", { aNestedDate: { aDate: A_DATE_EPOCH } }],
      ["leaves a point as an object", { aPoint: A_POINT }],
      ["leaves a null as a null", { aNull: null }],
      ["leaves an array as an array", { anArray: [ A_STRING, A_NUMBER, true ] }],
      ["leaves an object as an object", { anObject: { aString: A_STRING, aNumber: A_NUMBER, aBoolean: true } }],
      ["leaves an empty array as an array", { anEmptyArray: [] }],
      ["leaves an empty object as an object", { anEmptyObject: {} }]
    ])('%s', (_, expected) => {
      expect(actual).toEqual(expect.objectContaining(expected))
    })

    it("removes an explicit undefined", () => expect(actual).not.toHaveProperty('somethingUndefined'))
    it("removes a nested explicit undefined", () => expect(actual.aNestedUndefined).not.toHaveProperty('somethingUndefined'))
    it("leaves the containing object with a nested explicit undefined in place even though it is empty",
      () => expect(actual.aNestedUndefined).toEqual({}))
  })

  describe("when converting data that *is* described in the schema", () => {
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
        someDates: { type: 'date', path: '$.someDates[*]' },
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

    it("doesn't add fields defined in the schema that are missing", () => {
      const actual = toRedisJson(schema, {})
      expect(actual).toEqual({})
    })

    it("leaves data not defined in the schema in place", () => {
      const data = { anExistingField: 42, anExistingNestedField: { anotherExistingField: 23 }}
      const actual = toRedisJson(schema, data)
      expect(actual).toEqual(data)
    })

    it.each([

      // boolean
      ["leaves a true boolean as a boolean", { aBoolean: true }, { aBoolean: true }],
      ["leaves a false boolean as a boolean", { aBoolean: false }, { aBoolean: false }],
      ["leaves a null boolean as null", { aBoolean: null }, { aBoolean: null }],
      ["leaves a pathed boolean as a boolean", { aPathedBoolean: true }, { aPathedBoolean: true }],
      ["leaves a nested boolean as a boolean", { aNestededBoolean: { aBoolean: true } }, { aNestededBoolean: { aBoolean: true } }],
      ["removes an explicitly undefined boolean", { aBoolean: undefined }, {}],
      ["removes an explicitly undefined pathed boolean", { aPathedBoolean: undefined }, {}],

      // number
      ["leaves a number as a number", { aNumber: A_NUMBER }, { aNumber: A_NUMBER }],
      ["leaves a null number as null", { aNumber: null }, { aNumber: null }],
      ["leaves a pathed number as a number", { aPathedNumber: A_NUMBER }, { aPathedNumber: A_NUMBER }],
      ["leaves a nested number as a number", { aNestedNumber: { aNumber: A_NUMBER } }, { aNestedNumber: { aNumber: A_NUMBER } }],
      ["removes an explicitly undefined number", { aNumber: undefined }, {}],
      ["removes an explicitly undefined pathed number", { aPathedNumber: undefined }, {}],

      // date
      ["converts a date to an epoch number", { aDate: A_DATE }, { aDate: A_DATE_EPOCH }],
      ["converts an ISO date to an epoch number", { aDate: A_DATE_ISO }, { aDate: A_DATE_EPOCH }],
      ["leaves an epoch number as an epoch number", { aDate: A_DATE_EPOCH }, { aDate: A_DATE_EPOCH }],
      ["leaves a null date as null", { aDate: null }, { aDate: null }],
      ["converts a pathed date to an epoch number", { aPathedDate: A_DATE }, { aPathedDate: A_DATE_EPOCH }],
      ["converts a nested date to an epoch number", { aNestedDate: { aPathedDate: A_DATE } }, { aNestedDate: { aPathedDate: A_DATE_EPOCH } }],
      ["removes an explicitly undefined date", { aDate: undefined }, {}],
      ["removes an explicitly undefined pathed date", { aPathedDate: undefined }, {}],

      // point
      ["converts a point to a string", { aPoint: A_POINT }, { aPoint: A_POINT_STRING }],
      ["leaves a null point as null", { aPoint: null }, { aPoint: null }],
      ["converts a pathed point to a string", { aPathedPoint: A_POINT }, { aPathedPoint: A_POINT_STRING }],
      ["converts a nested point to a string", { aNestedPoint: { aPoint: A_POINT } }, { aNestedPoint: { aPoint: A_POINT_STRING } }],
      ["removes an explicitly undefined point", { aPoint: undefined }, {}],
      ["removes an explicitly undefined pathed point", { aPathedPoint: undefined }, {}],

      // string
      ["leaves a string as a string", { aString: A_STRING }, { aString: A_STRING }],
      ["coerces a number to a string", { aString: A_NUMBER }, { aString: A_NUMBER_STRING }],
      ["coerces a boolean to a string", { aString: true }, { aString: 'true' }],
      ["leaves a null string as null", { aString: null }, { aString: null }],
      ["leaves a pathed string as a string", { aPathedString: A_STRING }, { aPathedString: A_STRING }],
      ["coerces a pathed number to a string", { aPathedString: A_NUMBER }, { aPathedString: A_NUMBER_STRING }],
      ["coerces a pathed boolean to a string", { aPathedString: true }, { aPathedString: 'true' }],
      ["leaves a nested string as a string", { aNestedString: { aString: A_STRING } }, { aNestedString: { aString: A_STRING } }],
      ["coerces a nested number to a string", { aNestedString: { aString: A_NUMBER } }, { aNestedString: { aString: A_NUMBER_STRING } }],
      ["coerces a nested boolean to a string", { aNestedString: { aString: true } }, { aNestedString: { aString: 'true' } }],
      ["removes an explicitly undefined string", { aString: undefined }, {}],
      ["removes an explicitly undefined pathed string", { aPathedString: undefined }, {}],

      // text
      ["leaves a string as text", { someText: SOME_TEXT }, { someText: SOME_TEXT }],
      ["coerces a number to text", { someText: A_NUMBER }, { someText: A_NUMBER_STRING }],
      ["coerces a boolean to text", { someText: true }, { someText: 'true' }],
      ["leaves null text as null", { someText: null }, { someText: null }],
      ["leaves a pathed string as text", { somePathedText: SOME_TEXT }, { somePathedText: SOME_TEXT }],
      ["coerces a pathed number to text", { somePathedText: A_NUMBER }, { somePathedText: A_NUMBER_STRING }],
      ["coerces a pathed boolean to text", { somePathedText: true }, { somePathedText: 'true' }],
      ["leaves a nested string as text", { someNestedText: { someText: A_STRING } }, { someNestedText: { someText: A_STRING } }],
      ["coerces a nested number to text", { someNestedText: { someText: A_NUMBER } }, { someNestedText: { someText: A_NUMBER_STRING } }],
      ["coerces a nested boolean to text", { someNestedText: { someText: true } }, { someNestedText: { someText: 'true' } }],
      ["removes explicitly undefined text", { someText: undefined }, {}],
      ["removes explicitly undefined pathed text", { somePathedText: undefined }, {}],

      // string[]
      ["leaves a string[] as a string[]", { aStringArray: SOME_STRINGS }, { aStringArray: SOME_STRINGS }],
      ["coerces numbers and booleans in a string[] to strings", { aStringArray: [ A_STRING, A_NUMBER, true] }, { aStringArray: [A_STRING, A_NUMBER_STRING, 'true'] }],
      ["leaves an empty string[] as a string[]", { aStringArray: [] }, { aStringArray: [] }],
      ["leaves a null string[] as null", { aStringArray: null }, { aStringArray: null }],
      ["leaves a string[] that doesn't contain a string[] as is", { aStringArray: 'NOT_AN_ARRAY' }, { aStringArray: 'NOT_AN_ARRAY' }],
      ["leaves a pathed string[] as a string[]", { aPathedStringArray: SOME_STRINGS }, { aPathedStringArray: SOME_STRINGS }],
      ["leaves a nested string[] as a string[]", { aNestedStringArray: { aStringArray: SOME_STRINGS } }, { aNestedStringArray: { aStringArray: SOME_STRINGS } }],
      ["removes an explicitly undefined string[]", { aStringArray: undefined }, {}],
      ["removes an explicitly undefined pathed string[]", { aPathedStringArray: undefined }, {}],

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
      ["removes explicity undefined values in a widely dispersed string[]",
        { someObjects: [ { aString: A_STRING }, { aString: undefined }, { aString: ANOTHER_STRING } ] },
        { someObjects: [ { aString: A_STRING }, {}, { aString: ANOTHER_STRING }, ] }]

    ])('%s', (_, data, expected) => {
      const actual = toRedisJson(schema, data)
      expect(actual).not.toBe(data)
      expect(actual).toEqual(expected)
    })

    it("complains when given an invalid point", () => {
      expect(() => toRedisJson(schema, { aPoint: AN_INVALID_POINT }))
        .toThrowErrorOfType(PointOutOfRange, "Points must be between ±85.05112878 latitude and ±180 longitude.")
    })

    it.each([

      // boolean
      ["complains when a boolean is not a boolean", { aBoolean: 'NOT_A_BOOLEAN' }, `Unexpected value for field 'aBoolean' of type 'boolean' in JSON at "$.aBoolean".`],
      ["complains when a pathed boolean is not a boolean", { aPathedBoolean: 'NOT_A_BOOLEAN' }, `Unexpected value for field 'anotherBoolean' of type 'boolean' in JSON at "$.aPathedBoolean".`],
      ["complains when a nested boolean is not a boolean", { aNestedBoolean: { aBoolean: 'NOT_A_BOOLEAN' } }, `Unexpected value for field 'aNestedBoolean' of type 'boolean' in JSON at "$.aNestedBoolean.aBoolean".`],
      ["complains when a pathed boolean points to multiple results", { someBooleans: [ true, false, true ] }, `Unexpected value for field 'someBooleans' of type 'boolean' in JSON at "$.someBooleans[*]".`],

      // number
      ["complains when a number is not a number", { aNumber: 'NOT_A_NUMBER' }, `Unexpected value for field 'aNumber' of type 'number' in JSON at "$.aNumber".`],
      ["complains when a pathed number is not a number", { aPathedNumber: 'NOT_A_NUMBER' }, `Unexpected value for field 'anotherNumber' of type 'number' in JSON at "$.aPathedNumber".`],
      ["complains when a nested number is not a number", { aNestedNumber: { aNumber: 'NOT_A_NUMBER' } }, `Unexpected value for field 'aNestedNumber' of type 'number' in JSON at "$.aNestedNumber.aNumber".`],
      ["complains when a pathed number points to multiple results", { someNumbers: [ 42, 23, 13 ] }, `Unexpected value for field 'someNumbers' of type 'number' in JSON at "$.someNumbers[*]".`],

      // date
      ["complains when a date is not a date", { aDate: true }, `Unexpected value for field 'aDate' of type 'date' in JSON at "$.aDate".`],
      ["complains when a date is not a date string", { aDate: 'NOT_A_DATE' }, `Unexpected value for field 'aDate' of type 'date' in JSON at "$.aDate".`],
      ["complains when a pathed date is not a date", { aPathedDate: true }, `Unexpected value for field 'anotherDate' of type 'date' in JSON at "$.aPathedDate".`],
      ["complains when a pathed date is not a date string", { aPathedDate: 'NOT_A_DATE' }, `Unexpected value for field 'anotherDate' of type 'date' in JSON at "$.aPathedDate".`],
      ["complains when a nested date is not a date", { aNestedDate: { aDate: true } }, `Unexpected value for field 'aNestedDate' of type 'date' in JSON at "$.aNestedDate.aDate".`],
      ["complains when a nested date is not a date string", { aNestedDate: { aDate: 'NOT_A_DATE' } }, `Unexpected value for field 'aNestedDate' of type 'date' in JSON at "$.aNestedDate.aDate".`],
      ["complains when a pathed date points to multiple results", { someDates: [ A_DATE, A_DATE, A_DATE ] }, `Unexpected value for field 'someDates' of type 'date' in JSON at "$.someDates[*]".`],

      // point
      ["complains when a point is not a point", { aPoint: 'NOT_A_POINT' }, `Unexpected value for field 'aPoint' of type 'point' in JSON at "$.aPoint".`],
      ["complains when a point is a partial point", { aPoint: A_PARITAL_POINT }, `Unexpected value for field 'aPoint' of type 'point' in JSON at "$.aPoint".`],
      ["complains when a pathed point is not a point", { aPathedPoint: 'NOT_A_POINT' }, `Unexpected value for field 'anotherPoint' of type 'point' in JSON at "$.aPathedPoint".`],
      ["complains when a pathed point is a partial point", { aPathedPoint: A_PARITAL_POINT }, `Unexpected value for field 'anotherPoint' of type 'point' in JSON at "$.aPathedPoint".`],
      ["complains when a nested point is not a point", { aNestedPoint: { aPoint: 'NOT_A_POINT' } }, `Unexpected value for field 'aNestedPoint' of type 'point' in JSON at "$.aNestedPoint.aPoint".`],
      ["complains when a nested point is a partial point", { aNestedPoint: { aPoint: A_PARITAL_POINT } }, `Unexpected value for field 'aNestedPoint' of type 'point' in JSON at "$.aNestedPoint.aPoint".`],
      ["complains when a pathed point points to multiple results", { somePoints: [ A_POINT, A_POINT, A_POINT ] }, `Unexpected value for field 'somePoints' of type 'point' in JSON at "$.somePoints[*]".`],

      // string
      ["complains when a string is not a string", { aString: A_DATE }, `Unexpected value for field 'aString' of type 'string' in JSON at "$.aString".`],
      ["complains when a pathed string is not a string", { aPathedString: A_DATE }, `Unexpected value for field 'anotherString' of type 'string' in JSON at "$.aPathedString".`],
      ["complains when a nested string is not a string", { aNestedString: { aString: A_DATE } }, `Unexpected value for field 'aNestedString' of type 'string' in JSON at "$.aNestedString.aString".`],
      ["complains when a pathed string points to multiple results", { someStrings: SOME_STRINGS }, `Unexpected value for field 'someStrings' of type 'string' in JSON at "$.someStrings[*]".`],

      // text
      ["complains when text is not a string", { someText: A_DATE }, `Unexpected value for field 'someText' of type 'text' in JSON at "$.someText".`],
      ["complains when pathed text is not a string", { somePathedText: A_DATE }, `Unexpected value for field 'someMoreText' of type 'text' in JSON at "$.somePathedText".`],
      ["complains when nested text is not a string", { someNestedText: { someText: A_DATE } }, `Unexpected value for field 'someNestedText' of type 'text' in JSON at "$.someNestedText.someText".`],
      ["complains when a pathed text points to multiple results", { arrayOfText: SOME_STRINGS }, `Unexpected value for field 'arrayOfText' of type 'text' in JSON at "$.arrayOfText[*]".`],

    ])('%s', (_, data, expectedMessage) => {
      expect(() => toRedisJson(schema, data)).toThrowErrorOfType(InvalidJsonInput, expectedMessage)
    })

    it.each([

      // string[]
      ["complains when a string[] contains null", { aStringArray: [ A_STRING, null, ANOTHER_STRING ] }, `Null or undefined found in field 'aStringArray' of type 'string[]' in JSON at "$.aStringArray[*]".`],
      ["complains when a string[] contains undefined", { aStringArray: [ A_STRING, undefined, ANOTHER_STRING] }, `Null or undefined found in field 'aStringArray' of type 'string[]' in JSON at "$.aStringArray[*]".`],
      ["complains when a dispersed string[] contains null", { someOtherStrings:  [ A_STRING, null, ANOTHER_STRING] }, `Null or undefined found in field 'someStringsAsAnArray' of type 'string[]' in JSON at "$.someOtherStrings[*]".`],
      ["complains when a dispersed string[] contains undefined", { someOtherStrings:  [ A_STRING, undefined, ANOTHER_STRING] }, `Null or undefined found in field 'someStringsAsAnArray' of type 'string[]' in JSON at "$.someOtherStrings[*]".`],
      ["complains when a widely dispersed string[] contains null", { someObjects: [ { aString: A_STRING }, { aString: null }, { aString: ANOTHER_STRING } ] }, `Null or undefined found in field 'someOtherStringsAsAnArray' of type 'string[]' in JSON at "$.someObjects[*].aString".`]

    ])('%s', (_, data, expectedMessage) => {
      expect(() => toRedisJson(schema, data)).toThrowErrorOfType(NullJsonInput, expectedMessage)
    })
  })
})
