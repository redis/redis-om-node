import { toRedisHash } from "$lib/transformer";
import { Schema } from "$lib/schema";
import { Entity } from "$lib/entity/entity";
import { RedisHashData } from "$lib/client";
import { AN_INVALID_POINT, A_DATE, A_DATE_EPOCH, A_DATE_EPOCH_STRING, A_DATE_ISO, A_NUMBER, A_NUMBER_STRING, A_PARITAL_POINT, A_POINT, A_POINT_PRETTY_JSON, A_POINT_STRING, A_STRING, SOME_STRINGS, SOME_STRINGS_JOINED, SOME_TEXT } from "../../helpers/example-data";


describe("#toRedisHash", () => {

  class TestEntity extends Entity {}
  let schema: Schema<TestEntity>;
  let actual: RedisHashData;

  describe("when converting data not described in the schema", () => {
    beforeEach(() => {
      schema = new Schema(TestEntity, {})
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
        .toThrow("You can not store an array in a Redis Hash without defining it in the Schema.")
    })

    it("complains when given an object", () => {
      expect(() => toRedisHash(schema, { anObject: { aString: A_STRING, aNumber: A_NUMBER, aBoolean: true }}))
        .toThrow("You can not store a nested object in a Redis Hash.")
    })

    it("complains when given an invalid point", () => {
      expect(() => toRedisHash(schema, { aBadPoint: AN_INVALID_POINT }))
        .toThrow("Points must be between ±85.05112878 latitude and ±180 longitude")
    })
  })

  describe("when converting data that *is* described in the schema", () => {
    beforeEach(() => {
      schema = new Schema(TestEntity, {
        aBoolean: { type: 'boolean' },
        anotherBoolean: { type: 'boolean', alias: 'anAliasedBoolean' },
        aNumber: { type: 'number' },
        anotherNumber: { type: 'number', alias: 'anAliasedNumber' },
        aDate: { type: 'date' },
        anotherDate: { type: 'date', alias: 'anAliasedDate' },
        aPoint: { type: 'point' },
        anotherPoint: { type: 'point', alias: 'anAliasedPoint' },
        aString: { type: 'string' },
        anotherString: { type: 'string', alias: 'anAliasedString' },
        aStringArray: { type: 'string[]' },
        aSeparatedStringArray: { type: 'string[]', separator: ',' },
        anotherStringArray: { type: 'string[]', alias: 'anAliasedStringArray' },
        someText: { type: 'text' },
        someOtherText: { type: 'text', alias: 'someAliasedText' }
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
      ["converts an aliased boolean to a string", { anotherBoolean: true }, { anAliasedBoolean: '1' }],
      ["removes an explicitly undefined boolean", { aBoolean: undefined }, {}],
      ["removes a null boolean", { aBoolean: null }, {}],

      // number
      ["converts a number to a string", { aNumber: A_NUMBER }, { aNumber: A_NUMBER_STRING }],
      ["converts an aliased number to a string", { anotherNumber: A_NUMBER }, { anAliasedNumber: A_NUMBER_STRING }],
      ["removes an explicitly undefined number", { aNumber: undefined }, {}],
      ["removes a null number", { aNumber: null }, {}],

      // date
      ["converts a date to an epoch string", { aDate: A_DATE }, { aDate: A_DATE_EPOCH_STRING }],
      ["converts an ISO date to an epoch string", { aDate: A_DATE_ISO }, { aDate: A_DATE_EPOCH_STRING }],
      ["converts an UNIX epoch date to an epoch string", { aDate: A_DATE_EPOCH }, { aDate: A_DATE_EPOCH_STRING }],
      ["converts an aliased date to an epoch string", { anotherDate: A_DATE }, { anAliasedDate: A_DATE_EPOCH_STRING }],
      ["removes an explicitly undefined date", { aDate: undefined }, {}],
      ["removes a null date", { aDate: null }, {}],

      // point
      ["converts a point to a string", { aPoint: A_POINT }, { aPoint: A_POINT_STRING }],
      ["converts an aliased point to a string", { anotherPoint: A_POINT }, { anAliasedPoint: A_POINT_STRING }],
      ["removes an explicitly undefined point", { aPoint: undefined }, {}],
      ["removes a null point", { aPoint: null }, {}],

      // string
      ["leaves a string as a string", { aString: A_STRING }, { aString: A_STRING }],
      ["coerces a number to a string", { aString: A_NUMBER }, { aString: A_NUMBER_STRING }],
      ["coerces a boolean to a string", { aString: true }, { aString: 'true' }],
      ["leaves an aliased string as a string", { anotherString: A_STRING }, { anAliasedString: A_STRING }],
      ["removes an explicitly undefined string", { aString: undefined }, {}],
      ["removes a null string", { aString: null }, {}],

      // text
      ["converts a string in a text to a string", { someText: SOME_TEXT }, { someText: SOME_TEXT }],
      ["coerces a number in a text to a string", { someText: A_NUMBER }, { someText: A_NUMBER_STRING }],
      ["coerces a boolean in a text to a string", { someText: true }, { someText: 'true' }],
      ["converts an aliased string in a text to a string", { someOtherText: SOME_TEXT }, { someAliasedText: SOME_TEXT }],
      ["removes an explicitly undefined text", { someText: undefined }, {}],
      ["removes a null text", { someText: null }, {}],

      // string[]
      ["converts a string[] to a delimited string", { aStringArray: SOME_STRINGS }, { aStringArray: SOME_STRINGS_JOINED }],
      ["converts an aliased string[] to a delimited string", { anotherStringArray: SOME_STRINGS }, { anAliasedStringArray: SOME_STRINGS_JOINED }],
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
        .toThrow("Points must be between ±85.05112878 latitude and ±180 longitude")
    })

    it.each([

      // boolean
      ["complains when a boolean is not a boolean", { aBoolean: 'NOT_A_BOOLEAN' }, `Expected a boolean but received: "NOT_A_BOOLEAN"`],
      ["complains when a boolean is an object", { aBoolean: A_POINT }, `Expected a boolean but received: ${A_POINT_PRETTY_JSON}`],

      // number
      ["complains when a number is not a number", { aNumber: 'NOT_A_NUMBER' }, `Expected a number but received: "NOT_A_NUMBER"`],
      ["complains when a number is an object", { aNumber: A_POINT }, `Expected a number but received: ${A_POINT_PRETTY_JSON}`],

      /// date
      ["complains when a date is not a date", { aDate: true }, `Expected a date but received: true`],
      ["complains when a date is not a date string", { aDate: 'NOT_A_DATE' }, `Expected a date but received: "NOT_A_DATE"`],
      ["complains when a date is an object", { aDate: A_POINT }, `Expected a date but received: ${A_POINT_PRETTY_JSON}`],

      // point
      ["complains when a point is not a point", { aPoint: 'NOT_A_POINT' }, `Expected a point but received: "NOT_A_POINT"`],
      ["complains when a point is a partial point", { aPoint: A_PARITAL_POINT }, `Expected a point but received: {\n "latitude": 85.05112879\n}`],

      // string
      ["complains when a string is not a string", { aString: A_DATE }, `Expected a string but received: "${A_DATE.toISOString()}"`],
      ["complains when a string is an object", { aString: A_POINT }, `Expected a string but received: ${A_POINT_PRETTY_JSON}`],

      // text
      ["complains when a text is not a string", { someText: A_DATE }, `Expected a string but received: "${A_DATE.toISOString()}"`],
      ["complains when a text is an object", { someText: A_POINT }, `Expected a string but received: ${A_POINT_PRETTY_JSON}`],

      // string[]
      ["complains when a string[] is not an array", { aStringArray: 'NOT_AN_ARRAY' }, `Expected a string[] but received: "NOT_AN_ARRAY"`],
      ["complains when a string[] is an object", { aStringArray: A_POINT }, `Expected a string[] but received: ${A_POINT_PRETTY_JSON}`],

    ])('%s', (_, data, expectedException) => {
      expect(() => toRedisHash(schema, data)).toThrow(expectedException)
    })
  })
})