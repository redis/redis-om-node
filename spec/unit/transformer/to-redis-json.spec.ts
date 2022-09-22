import { toRedisJson } from "$lib/transformer";
import { Schema } from "$lib/schema";
import { Entity } from "$lib/entity/entity";
import { RedisJsonData } from "$lib/client";
import { A_DATE, A_DATE_EPOCH, A_NUMBER, A_PARITAL_POINT, A_POINT, A_POINT_PRETTY_JSON, A_STRING } from "../../helpers/example-data";


describe("#toRedisJson", () => {

  class TestEntity extends Entity {}
  let schema: Schema<TestEntity>;
  let actual: RedisJsonData;

  describe("when converting data not described in the schema", () => {
    beforeEach(() => {
      schema = new Schema(TestEntity, {})
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
  })

  describe("when converting data that *is* described in the schema", () => {
    beforeEach(() => {
      schema = new Schema(TestEntity, {
        aBoolean: { type: 'boolean' },
        anotherBoolean: { type: 'boolean', path: '$.aPathedBoolean' },
        aNestedBoolean: { type: 'boolean', path: '$.aNestedBoolean.aBoolean' },
        aNumber: { type: 'number' },
        anotherNumber: { type: 'number', path: '$.aPathedNumber' },
        aNestedNumber: { type: 'number', path: '$.aNestedNumber.aNumber' },
        aDate: { type: 'date' },
        aPoint: { type: 'point' },
        aString: { type: 'string' },
        aStringArray: { type: 'string[]' },
        someText: { type: 'text' }
      })
    })

    it("doesn't add missing fields", () => {
      const actual = toRedisJson(schema, {})
      expect(actual).toEqual({})
    })

    it.each([

      // boolean
      ["leaves a true boolean as a boolean", { aBoolean: true }, { aBoolean: true }],
      ["leaves a false boolean as a boolean", { aBoolean: false }, { aBoolean: false }],
      ["leaves a null boolean as null", { aBoolean: null }, { aBoolean: null }],
      ["leaves a pathed boolean as a boolean", { aPathedBoolean: true }, { aPathedBoolean: true }],
      ["leaves a nested boolean as a boolean", { aNestededBoolean: { aBoolean: true } }, { aNestededBoolean: { aBoolean: true } }],
      ["removes an explicitly undefined boolean", { aBoolean: undefined }, {}],

      // number
      ["leaves a number as a number", { aNumber: A_NUMBER }, { aNumber: A_NUMBER }],
      ["leaves a null number as null", { aNumber: null }, { aNumber: null }],
      ["leaves a pathed number as a number", { aPathedNumber: A_NUMBER }, { aPathedNumber: A_NUMBER }],
      ["leaves a nested number as a number", { aNestedNumber: { aNumber: A_NUMBER } }, { aNestedNumber: { aNumber: A_NUMBER } }],
      ["removes an explicitly undefined number", { aNumber: undefined }, {}],

  //     // date
  //     ["converts a date to an epoch string", { aDate: A_DATE }, { aDate: A_DATE_EPOCH_STRING }],
  //     ["converts an ISO date to an epoch string", { aDate: A_DATE_ISO }, { aDate: A_DATE_EPOCH_STRING }],
  //     ["converts an UNIX epoch date to an epoch string", { aDate: A_DATE_EPOCH }, { aDate: A_DATE_EPOCH_STRING }],
  //     ["converts an aliased date to an epoch string", { anotherDate: A_DATE }, { anAliasedDate: A_DATE_EPOCH_STRING }],
  //     ["removes an explicitly undefined date", { aDate: undefined }, {}],
  //     ["removes a null date", { aDate: null }, {}],

  //     // point
  //     ["converts a point to a string", { aPoint: A_POINT }, { aPoint: A_POINT_STRING }],
  //     ["converts an aliased point to a string", { anotherPoint: A_POINT }, { anAliasedPoint: A_POINT_STRING }],
  //     ["removes an explicitly undefined point", { aPoint: undefined }, {}],
  //     ["removes a null point", { aPoint: null }, {}],

  //     // string
  //     ["leaves a string as a string", { aString: A_STRING }, { aString: A_STRING }],
  //     ["coerces a number to a string", { aString: A_NUMBER }, { aString: A_NUMBER_STRING }],
  //     ["coerces a boolean to a string", { aString: true }, { aString: 'true' }],
  //     ["leaves an aliased string as a string", { anotherString: A_STRING }, { anAliasedString: A_STRING }],
  //     ["removes an explicitly undefined string", { aString: undefined }, {}],
  //     ["removes a null string", { aString: null }, {}],

  //     // text
  //     ["converts a string in a text to a string", { someText: SOME_TEXT }, { someText: SOME_TEXT }],
  //     ["coerces a number in a text to a string", { someText: A_NUMBER }, { someText: A_NUMBER_STRING }],
  //     ["coerces a boolean in a text to a string", { someText: true }, { someText: 'true' }],
  //     ["converts an aliased string in a text to a string", { someOtherText: SOME_TEXT }, { someAliasedText: SOME_TEXT }],
  //     ["removes an explicitly undefined text", { someText: undefined }, {}],
  //     ["removes a null text", { someText: null }, {}],

  //     // string[]
  //     ["converts a string[] to a delimited string", { aStringArray: SOME_STRINGS }, { aStringArray: SOME_STRINGS_JOINED }],
  //     ["converts an aliased string[] to a delimited string", { anotherStringArray: SOME_STRINGS }, { anAliasedStringArray: SOME_STRINGS_JOINED }],
  //     ["coerces numbers and booleans in a string[] to strings", { aStringArray: [ A_STRING, A_NUMBER, true] }, { aStringArray: [A_STRING, A_NUMBER_STRING, 'true'].join('|') }],
  //     ["converts a string[] to a delimited string with a custom delimiter", { aSeparatedStringArray: SOME_STRINGS }, { aSeparatedStringArray: SOME_STRINGS.join(',') }],
  //     ["coerces numbers and booleans in a string[] to string with a custom delimiter", { aSeparatedStringArray: [ A_STRING, A_NUMBER, true] }, { aSeparatedStringArray: [A_STRING, A_NUMBER_STRING, 'true'].join(',') }],

    ])('%s', (_, data, expected) => {
      const actual = toRedisJson(schema, data)
      expect(actual).not.toBe(data)
      expect(actual).toEqual(expected)
    })

  //   it("complains when given an invalid point", () => {
  //     expect(() => toRedisJson(schema, { aPoint: AN_INVALID_POINT }))
  //       .toThrow("Points must be between ±85.05112878 latitude and ±180 longitude")
  //   })

    it.each([

      // boolean
      ["complains when a boolean is not a boolean", { aBoolean: 'NOT_A_BOOLEAN' }, `Expected a boolean but received: "NOT_A_BOOLEAN"`],
      ["complains when a pathed boolean is not a boolean", { aPathedBoolean: 'NOT_A_BOOLEAN' }, `Expected a boolean but received: "NOT_A_BOOLEAN"`],
      ["complains when a nested boolean is not a boolean", { aNestedBoolean: { aBoolean: 'NOT_A_BOOLEAN' } }, `Expected a boolean but received: "NOT_A_BOOLEAN"`],

      // number
      ["complains when a number is not a number", { aNumber: 'NOT_A_NUMBER' }, `Expected a number but received: "NOT_A_NUMBER"`],
      ["complains when a pathed number is not a number", { aPathedNumber: 'NOT_A_NUMBER' }, `Expected a number but received: "NOT_A_NUMBER"`],
      ["complains when a nested number is not a number", { aNestedNumber: { aNumber: 'NOT_A_NUMBER' } }, `Expected a number but received: "NOT_A_NUMBER"`],

      // date
      // ["complains when a date is not a date", { aDate: true }, `Expected a date but received: true`],
      // ["complains when a date is not a date string", { aDate: 'NOT_A_DATE' }, `Expected a date but received: "NOT_A_DATE"`],

      // point
      // ["complains when a point is not a point", { aPoint: 'NOT_A_POINT' }, `Expected a point but received: "NOT_A_POINT"`],
      // ["complains when a point is a partial point", { aPoint: A_PARITAL_POINT }, `Expected a point but received: {\n "latitude": 85.05112879\n}`],

      // string
      // ["complains when a string is not a string", { aString: A_DATE }, `Expected a string but received: "${A_DATE.toISOString()}"`],

      // text
      // ["complains when a text is not a string", { someText: A_DATE }, `Expected a string but received: "${A_DATE.toISOString()}"`],

      // string[]
      // ["complains when a string[] is not an array", { aStringArray: 'NOT_AN_ARRAY' }, `Expected a string[] but received: "NOT_AN_ARRAY"`],
      // ["complains when a string[] is an object", { aStringArray: A_POINT }, `Expected a string[] but received: ${A_POINT_PRETTY_JSON}`],

    ])('%s', (_, data, expectedException) => {
      expect(() => toRedisJson(schema, data)).toThrow(expectedException)
    })
  })
})
