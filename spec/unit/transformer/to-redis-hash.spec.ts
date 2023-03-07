import '../../helpers/custom-matchers'

import { RedisHashData } from "$lib/client"
import { Schema } from "$lib/schema"
import { toRedisHash } from "$lib/transformer"

import { AN_INVALID_POINT, A_DATE, A_DATE_EPOCH, A_DATE_EPOCH_STRING, A_DATE_ISO, A_NUMBER, A_NUMBER_STRING, A_PARITAL_POINT, A_POINT, A_POINT_PRETTY_JSON, A_POINT_STRING, A_STRING, SOME_STRINGS, SOME_STRINGS_JOINED, SOME_TEXT } from "../../helpers/example-data"
import { InvalidHashInput, NestedHashInput, PointOutOfRange, ArrayHashInput } from '$lib/error'


describe("#toRedisHash", () => {

  let schema: Schema
  let actual: RedisHashData

  describe("when converting data not described in the schema", () => {
    beforeEach(() => {
      schema = new Schema('TestPrefix', {})
      actual = toRedisHash(schema, {
        aTrueBoolean: true, aFalseBoolean: false,
        aNumber: A_NUMBER, aDate: A_DATE, aPoint: A_POINT,
        aString: A_STRING, somethingUndefined: undefined, aNull: null
      })
    })

    it.each([
      ["converts a true boolean to a string", { aTrueBoolean: '1' }],
      ["converts a false boolean to a string", { aFalseBoolean: '0' }],
      ["converts a number to a string", { aNumber: A_NUMBER_STRING }],
      ["converts a date to an epoch string", { aDate: A_DATE_EPOCH_STRING }],
      ["converts a point to a string", { aPoint: A_POINT_STRING }],
      ["leaves a string as a string", { aString: A_STRING }]
    ])('%s', (_, expected) => {
      expect(actual).toEqual(expect.objectContaining(expected))
    })

    it("removes an explicit undefined", () => expect(actual).not.toHaveProperty('somethingUndefined'))
    it("removes a null", () => expect(actual).not.toHaveProperty('aNull'))

    it("complains when given an array", () => {
        expect(() => toRedisHash(schema, { anArray: [A_STRING, A_NUMBER, true]}))
        .toThrowErrorOfType(ArrayHashInput, "Unexpected array in Hash at property 'anArray'. You can not store an array in a Redis Hash without defining it in the Schema.")
    })

    it("complains when given an object", () => {
      expect(() => toRedisHash(schema, { anObject: { aString: A_STRING, aNumber: A_NUMBER, aBoolean: true }}))
        .toThrowErrorOfType(NestedHashInput, "Unexpected object in Hash at property 'anObject'. You can not store a nested object in a Redis Hash.")
    })

    it("complains when given an invalid point", () => {
      expect(() => toRedisHash(schema, { aBadPoint: AN_INVALID_POINT }))
        .toThrowErrorOfType(PointOutOfRange, "Points must be between ±85.05112878 latitude and ±180 longitude.")
    })
  })

  describe("when converting data that *is* described in the schema", () => {
    beforeEach(() => {
      schema = new Schema('TestPrefix', {
        aBoolean: { type: 'boolean' },
        anotherBoolean: { type: 'boolean', field: 'aRenamedBoolean' },
        aNumber: { type: 'number' },
        anotherNumber: { type: 'number', field: 'aRenamedNumber' },
        aDate: { type: 'date' },
        anotherDate: { type: 'date', field: 'aRenamedDate' },
        aPoint: { type: 'point' },
        anotherPoint: { type: 'point', field: 'aRenamedPoint' },
        aString: { type: 'string' },
        anotherString: { type: 'string', field: 'aRenamedString' },
        aStringArray: { type: 'string[]' },
        aSeparatedStringArray: { type: 'string[]', separator: ',' },
        anotherStringArray: { type: 'string[]', field: 'aRenamedStringArray' },
        someText: { type: 'text' },
        someOtherText: { type: 'text', field: 'someRenamedText' }
      })
    })

    it("doesn't add missing fields", () => {
      const actual = toRedisHash(schema, {})
      expect(actual).toEqual({})
    })

    it.each([

      // boolean
      ["converts a true boolean to a string", { aBoolean: true }, { aBoolean: '1' }],
      ["converts a false boolean to a string", { aBoolean: false }, { aBoolean: '0' }],
      ["converts a renamed boolean to a string", { anotherBoolean: true }, { aRenamedBoolean: '1' }],
      ["removes an explicitly undefined boolean", { aBoolean: undefined }, {}],
      ["removes a null boolean", { aBoolean: null }, {}],

      // number
      ["converts a number to a string", { aNumber: A_NUMBER }, { aNumber: A_NUMBER_STRING }],
      ["converts a renamed number to a string", { anotherNumber: A_NUMBER }, { aRenamedNumber: A_NUMBER_STRING }],
      ["removes an explicitly undefined number", { aNumber: undefined }, {}],
      ["removes a null number", { aNumber: null }, {}],

      // date
      ["converts a date to an epoch string", { aDate: A_DATE }, { aDate: A_DATE_EPOCH_STRING }],
      ["converts an ISO date to an epoch string", { aDate: A_DATE_ISO }, { aDate: A_DATE_EPOCH_STRING }],
      ["converts an UNIX epoch date to an epoch string", { aDate: A_DATE_EPOCH }, { aDate: A_DATE_EPOCH_STRING }],
      ["converts a renamed date to an epoch string", { anotherDate: A_DATE }, { aRenamedDate: A_DATE_EPOCH_STRING }],
      ["removes an explicitly undefined date", { aDate: undefined }, {}],
      ["removes a null date", { aDate: null }, {}],

      // point
      ["converts a point to a string", { aPoint: A_POINT }, { aPoint: A_POINT_STRING }],
      ["converts a renamed point to a string", { anotherPoint: A_POINT }, { aRenamedPoint: A_POINT_STRING }],
      ["removes an explicitly undefined point", { aPoint: undefined }, {}],
      ["removes a null point", { aPoint: null }, {}],

      // string
      ["leaves a string as a string", { aString: A_STRING }, { aString: A_STRING }],
      ["coerces a number to a string", { aString: A_NUMBER }, { aString: A_NUMBER_STRING }],
      ["coerces a boolean to a string", { aString: true }, { aString: 'true' }],
      ["leaves a renamed string as a string", { anotherString: A_STRING }, { aRenamedString: A_STRING }],
      ["removes an explicitly undefined string", { aString: undefined }, {}],
      ["removes a null string", { aString: null }, {}],

      // text
      ["converts a string in a text to a string", { someText: SOME_TEXT }, { someText: SOME_TEXT }],
      ["coerces a number in a text to a string", { someText: A_NUMBER }, { someText: A_NUMBER_STRING }],
      ["coerces a boolean in a text to a string", { someText: true }, { someText: 'true' }],
      ["converts a renamed string in a text to a string", { someOtherText: SOME_TEXT }, { someRenamedText: SOME_TEXT }],
      ["removes an explicitly undefined text", { someText: undefined }, {}],
      ["removes a null text", { someText: null }, {}],

      // string[]
      ["converts a string[] to a delimited string", { aStringArray: SOME_STRINGS }, { aStringArray: SOME_STRINGS_JOINED }],
      ["converts a renamed string[] to a delimited string", { anotherStringArray: SOME_STRINGS }, { aRenamedStringArray: SOME_STRINGS_JOINED }],
      ["coerces numbers and booleans in a string[] to strings", { aStringArray: [ A_STRING, A_NUMBER, true] }, { aStringArray: [A_STRING, A_NUMBER_STRING, 'true'].join('|') }],
      ["converts a string[] to a delimited string with a custom delimiter", { aSeparatedStringArray: SOME_STRINGS }, { aSeparatedStringArray: SOME_STRINGS.join(',') }],
      ["coerces numbers and booleans in a string[] to string with a custom delimiter", { aSeparatedStringArray: [ A_STRING, A_NUMBER, true] }, { aSeparatedStringArray: [A_STRING, A_NUMBER_STRING, 'true'].join(',') }],

    ])('%s', (_, data, expected) => {
      const actual = toRedisHash(schema, data)
      expect(actual).not.toBe(data)
      expect(actual).toEqual(expected)
    })

    it("complains when given an invalid point", () => {
      expect(() => toRedisHash(schema, { aPoint: AN_INVALID_POINT }))
        .toThrowErrorOfType(PointOutOfRange, "Points must be between ±85.05112878 latitude and ±180 longitude.")
    })

    it.each([

      // boolean
      ["complains when a boolean is not a boolean", { aBoolean: 'NOT_A_BOOLEAN' }, `Unexpected value for field 'aBoolean' of type 'boolean' in Hash.`],
      ["complains when a boolean is an object", { aBoolean: A_POINT }, `Unexpected value for field 'aBoolean' of type 'boolean' in Hash.`],

      // number
      ["complains when a number is not a number", { aNumber: 'NOT_A_NUMBER' }, `Unexpected value for field 'aNumber' of type 'number' in Hash.`],
      ["complains when a number is an object", { aNumber: A_POINT }, `Unexpected value for field 'aNumber' of type 'number' in Hash.`],

      /// date
      ["complains when a date is not a date", { aDate: true }, `Unexpected value for field 'aDate' of type 'date' in Hash.`],
      ["complains when a date is not a date string", { aDate: 'NOT_A_DATE' }, `Unexpected value for field 'aDate' of type 'date' in Hash.`],
      ["complains when a date is an object", { aDate: A_POINT }, `Unexpected value for field 'aDate' of type 'date' in Hash.`],

      // point
      ["complains when a point is not a point", { aPoint: 'NOT_A_POINT' }, `Unexpected value for field 'aPoint' of type 'point' in Hash.`],
      ["complains when a point is a partial point", { aPoint: A_PARITAL_POINT }, `Unexpected value for field 'aPoint' of type 'point' in Hash.`],

      // string
      ["complains when a string is not a string", { aString: A_DATE }, `Unexpected value for field 'aString' of type 'string' in Hash.`],
      ["complains when a string is an object", { aString: A_POINT }, `Unexpected value for field 'aString' of type 'string' in Hash.`],

      // text
      ["complains when a text is not a string", { someText: A_DATE }, `Unexpected value for field 'someText' of type 'text' in Hash.`],
      ["complains when a text is an object", { someText: A_POINT }, `Unexpected value for field 'someText' of type 'text' in Hash.`],

      // string[]
      ["complains when a string[] is not an array", { aStringArray: 'NOT_AN_ARRAY' }, `Unexpected value for field 'aStringArray' of type 'string[]' in Hash.`],
      ["complains when a string[] is an object", { aStringArray: A_POINT }, `Unexpected value for field 'aStringArray' of type 'string[]' in Hash.`],

    ])('%s', (_, data, expectedMessage) => {
      expect(() => toRedisHash(schema, data)).toThrowErrorOfType(InvalidHashInput, expectedMessage)
    })
  })
})
