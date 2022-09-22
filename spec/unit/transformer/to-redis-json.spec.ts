import { toRedisJson } from "$lib/transformer";
import { Schema } from "$lib/schema";
import { Entity } from "$lib/entity/entity";
import { RedisJsonData } from "$lib/client";
import { AN_INVALID_POINT, A_DATE, A_DATE_EPOCH, A_DATE_ISO, A_NUMBER, A_NUMBER_STRING, A_PARITAL_POINT, A_POINT, A_POINT_STRING, A_STRING, SOME_STRINGS, SOME_TEXT } from "../../helpers/example-data";


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
        anotherDate: { type: 'date', path: '$.aPathedDate' },
        aNestedDate: { type: 'date', path: '$.aNestedDate.aDate' },
        aPoint: { type: 'point' },
        anotherPoint: { type: 'point', path: '$.aPathedPoint' },
        aNestedPoint: { type: 'point', path: '$.aNestedPoint.aPoint' },
        aString: { type: 'string' },
        anotherString: { type: 'string', path: '$.aPathedString' },
        aNestedString: { type: 'string', path: '$.aNestedString.aString' },
        someText: { type: 'text' },
        someMoreText: { type: 'text', path: '$.somePathedText' },
        someNestedText: { type: 'text', path: '$.someNestedText.someText' },
        aStringArray: { type: 'string[]' },
        anotherStringArray: { type: 'string[]', path: '$.aPathedStringArray' },
        aNestedStringArray: { type: 'string[]', path: '$.aNestedStringArray.aStringArray' }
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

      // date
      ["converts a date to an epoch number", { aDate: A_DATE }, { aDate: A_DATE_EPOCH }],
      ["converts an ISO date to an epoch number", { aDate: A_DATE_ISO }, { aDate: A_DATE_EPOCH }],
      ["leaves an epoch number as an epoch number", { aDate: A_DATE_EPOCH }, { aDate: A_DATE_EPOCH }],
      ["leaves a null date as null", { aDate: null }, { aDate: null }],
      ["converts a pathed date to an epoch number", { aPathedDate: A_DATE }, { aPathedDate: A_DATE_EPOCH }],
      ["converts a nested date to an epoch number", { aNestedDate: { aPathedDate: A_DATE } }, { aNestedDate: { aPathedDate: A_DATE_EPOCH } }],
      ["removes an explicitly undefined date", { aDate: undefined }, {}],

      // point
      ["converts a point to a string", { aPoint: A_POINT }, { aPoint: A_POINT_STRING }],
      ["leaves a null point as null", { aPoint: null }, { aPoint: null }],
      ["converts a pathed point to a string", { aPathedPoint: A_POINT }, { aPathedPoint: A_POINT_STRING }],
      ["converts a nested point to a string", { aNestedPoint: { aPoint: A_POINT } }, { aNestedPoint: { aPoint: A_POINT_STRING } }],
      ["removes an explicitly undefined point", { aPoint: undefined }, {}],

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

      // text
      ["leaves a string as text", { someText: SOME_TEXT }, { someText: SOME_TEXT }],
      ["coerces a number to test", { someText: A_NUMBER }, { someText: A_NUMBER_STRING }],
      ["coerces a boolean to test", { someText: true }, { someText: 'true' }],
      ["leaves null text as null", { someText: null }, { someText: null }],
      ["leaves a pathed string as text", { somePathedText: SOME_TEXT }, { somePathedText: SOME_TEXT }],
      ["coerces a pathed number to text", { somePathedText: A_NUMBER }, { somePathedText: A_NUMBER_STRING }],
      ["coerces a pathed boolean to text", { somePathedText: true }, { somePathedText: 'true' }],
      ["leaves a nested string as text", { someNestedText: { someText: A_STRING } }, { someNestedText: { someText: A_STRING } }],
      ["coerces a nested number to text", { someNestedText: { someText: A_NUMBER } }, { someNestedText: { someText: A_NUMBER_STRING } }],
      ["coerces a nested boolean to text", { someNestedText: { someText: true } }, { someNestedText: { someText: 'true' } }],
      ["removes explicitly undefined text", { someText: undefined }, {}],

      // string[]
      ["leaves a string[] as a string[]", { aStringArray: SOME_STRINGS }, { aStringArray: SOME_STRINGS }],
      ["coerces numbers and booleans in a string[] to strings", { aStringArray: [ A_STRING, A_NUMBER, true] }, { aStringArray: [A_STRING, A_NUMBER_STRING, 'true'] }],
      ["leaves an empty string[] as a string[]", { aStringArray: [] }, { aStringArray: [] }],
      ["leaves a null string[] as null", { aStringArray: null }, { aStringArray: null }],
      ["leaves a pathed string[] as a string[]", { aPathedStringArray: SOME_STRINGS }, { aPathedStringArray: SOME_STRINGS }],
      ["leaves a nested string[] as a string[]", { aNestedStringArray: { aStringArray: SOME_STRINGS } }, { aNestedStringArray: { aStringArray: SOME_STRINGS } }],
      ["removes an explicitly undefined string[]", { aStringArray: undefined }, {}]

    ])('%s', (_, data, expected) => {
      const actual = toRedisJson(schema, data)
      expect(actual).not.toBe(data)
      expect(actual).toEqual(expected)
    })

    it("complains when given an invalid point", () => {
      expect(() => toRedisJson(schema, { aPoint: AN_INVALID_POINT }))
        .toThrow("Points must be between ±85.05112878 latitude and ±180 longitude")
    })

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
      ["complains when a date is not a date", { aDate: true }, `Expected a date but received: true`],
      ["complains when a date is not a date string", { aDate: 'NOT_A_DATE' }, `Expected a date but received: "NOT_A_DATE"`],
      ["complains when a pathed date is not a date", { aPathedDate: true }, `Expected a date but received: true`],
      ["complains when a pathed date is not a date string", { aPathedDate: 'NOT_A_DATE' }, `Expected a date but received: "NOT_A_DATE"`],
      ["complains when a nested date is not a date", { aNestedDate: { aDate: true } }, `Expected a date but received: true`],
      ["complains when a nested date is not a date string", { aNestedDate: { aDate: 'NOT_A_DATE' } }, `Expected a date but received: "NOT_A_DATE"`],

      // point
      ["complains when a point is not a point", { aPoint: 'NOT_A_POINT' }, `Expected a point but received: "NOT_A_POINT"`],
      ["complains when a point is a partial point", { aPoint: A_PARITAL_POINT }, `Expected a point but received: {\n "latitude": 85.05112879\n}`],
      ["complains when a pathed point is not a point", { aPathedPoint: 'NOT_A_POINT' }, `Expected a point but received: "NOT_A_POINT"`],
      ["complains when a pathed point is a partial point", { aPathedPoint: A_PARITAL_POINT }, `Expected a point but received: {\n "latitude": 85.05112879\n}`],
      ["complains when a nested point is not a point", { aNestedPoint: { aPoint: 'NOT_A_POINT' } }, `Expected a point but received: "NOT_A_POINT"`],
      ["complains when a nested point is a partial point", { aNestedPoint: { aPoint: A_PARITAL_POINT } }, `Expected a point but received: {\n "latitude": 85.05112879\n}`],

      // string
      ["complains when a string is not a string", { aString: A_DATE }, `Expected a string but received: "${A_DATE.toISOString()}"`],
      ["complains when a pathed string is not a string", { aPathedString: A_DATE }, `Expected a string but received: "${A_DATE.toISOString()}"`],
      ["complains when a nested string is not a string", { aNestedString: { aString: A_DATE } }, `Expected a string but received: "${A_DATE.toISOString()}"`],

      // string
      ["complains when text is not a string", { someText: A_DATE }, `Expected a string but received: "${A_DATE.toISOString()}"`],
      ["complains when pathed text is not a string", { somePathedText: A_DATE }, `Expected a string but received: "${A_DATE.toISOString()}"`],
      ["complains when nested text is not a string", { someNestedText: { someText: A_DATE } }, `Expected a string but received: "${A_DATE.toISOString()}"`],

      // string[]
      ["complains when a string[] is not an array", { aStringArray: 'NOT_AN_ARRAY' }, `Expected a string[] but received: "NOT_AN_ARRAY"`],
      ["complains when a pathed string[] is not an array", { aPathedStringArray: 'NOT_AN_ARRAY' }, `Expected a string[] but received: "NOT_AN_ARRAY"`],
      ["complains when a nested string[] is not an array", { aNestedStringArray: { aStringArray: 'NOT_AN_ARRAY' } }, `Expected a string[] but received: "NOT_AN_ARRAY"`]

    ])('%s', (_, data, expectedException) => {
      expect(() => toRedisJson(schema, data)).toThrow(expectedException)
    })
  })
})
