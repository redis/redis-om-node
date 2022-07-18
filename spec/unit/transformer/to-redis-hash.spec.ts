import { toRedisHash } from "$lib/transformer";
import { Schema } from "$lib/schema";
import { Entity } from "$lib/entity/entity";
import { RedisHashData } from "$lib/client";
import { AN_INVALID_POINT, A_DATE, A_DATE_EPOCH_STRING, A_NUMBER, A_NUMBER_STRING, A_POINT, A_POINT_STRING, A_STRING, SOME_STRINGS, SOME_STRINGS_JOINED, SOME_TEXT } from "../../helpers/example-data";


describe("#toRedisHash", () => {

  class TestEntity extends Entity {}
  let schema: Schema<TestEntity>;
  let actual: RedisHashData;

  describe("when converting without a schema", () => {
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

  describe("when converting with a schema", () => {
    beforeEach(() => {
      schema = new Schema(TestEntity, {
        aBoolean: { type: 'boolean' },
        aNumber: { type: 'number' },
        aDate: { type: 'date' },
        aPoint: { type: 'point' },
        aString: { type: 'string' },
        aStringArray: { type: 'string[]' },
        anotherStringArray: { type: 'string[]', separator: ',' },
        someText: { type: 'text' }
      })
    })

    it("doesn't add missing fields", () => {
      const actual = toRedisHash(schema, {})
      expect(actual).toEqual({})
    })

    it.each([

      // TODO: add aliases

      // boolean
      ["converts a true boolean to a string", { aBoolean: true }, { aBoolean: '1' }],
      ["converts a false boolean to a string", { aBoolean: false }, { aBoolean: '0' }],
      ["removes an explicitly undefined boolean", { aBoolean: undefined }, {}],
      ["removes a null boolean", { aBoolean: null }, {}],

      // number
      ["converts a number to a string", { aNumber: A_NUMBER }, { aNumber: A_NUMBER_STRING }],
      ["removes an explicitly undefined number", { aNumber: undefined }, {}],
      ["removes a null number", { aNumber: null }, {}],

      // date
      ["converts a date to an epoch string", { aDate: A_DATE }, { aDate: A_DATE_EPOCH_STRING }],
      ["removes an explicitly undefined date", { aDate: undefined }, {}],
      ["removes a null date", { aDate: null }, {}],

      // point
      ["converts a point to a string", { aPoint: A_POINT }, { aPoint: A_POINT_STRING }],
      ["removes an explicitly undefined point", { aPoint: undefined }, {}],
      ["removes a null point", { aPoint: null }, {}],

      // string
      ["leaves a string as a string", { aString: A_STRING }, { aString: A_STRING }],
      ["coerces a number to a string", { aString: A_NUMBER }, { aString: A_NUMBER_STRING }],
      ["coerces a boolean to a string", { aString: true }, { aString: 'true' }],
      ["removes an explicitly undefined string", { aString: undefined }, {}],
      ["removes a null string", { aString: null }, {}],

      // text
      ["converts a string in a text to a string", { someText: SOME_TEXT }, { someText: SOME_TEXT }],
      ["coerces a number in a text to a string", { someText: A_NUMBER }, { someText: A_NUMBER_STRING }],
      ["coerces a boolean in a text to a string", { someText: true }, { someText: 'true' }],
      ["removes an explicitly undefined text", { someText: undefined }, {}],
      ["removes a null text", { someText: null }, {}],

      // string[]
      ["converts a string[] to a delimited string", { aStringArray: SOME_STRINGS }, { aStringArray: SOME_STRINGS_JOINED }],
      ["coerces numbers and booleans in a string[] to strings", { aStringArray: [ A_STRING, A_NUMBER, true] }, { aStringArray: [A_STRING, A_NUMBER_STRING, 'true'].join('|') }],

      // string[] with separator
      ["converts a string[] to a delimited string with a custom delimiter", { aStringArray: SOME_STRINGS }, { aStringArray: SOME_STRINGS.join(',') }],
      ["coerces numbers and booleans in a string[] to string with a custom delimiter", { aStringArray: [ A_STRING, A_NUMBER, true] }, { aStringArray: [A_STRING, A_NUMBER_STRING, 'true'].join(',') }],

    ])('%s', (_, data, expected) => {
      const actual = toRedisHash(schema, data)
      expect(actual).toEqual(expected)
    })

    it("complains when given an invalid point", () => {
      expect(() => toRedisHash(schema, { aPoint: AN_INVALID_POINT }))
      .toThrow("Points must be between ±85.05112878 latitude and ±180 longitude")
    })

    // it complains when given non-matching types (include objects)
  })
})
