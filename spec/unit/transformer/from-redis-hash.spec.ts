import '../../helpers/custom-matchers'

import { RedisHashData } from "$lib/client"
import { EntityData } from "$lib/entity"
import { Schema } from "$lib/schema"
import { fromRedisHash } from "$lib/transformer"

import { A_DATE, A_DATE_EPOCH_STRING, A_NUMBER, A_NUMBER_STRING, A_POINT, A_POINT_STRING, A_STRING, SOME_STRINGS, SOME_STRINGS_JOINED, SOME_TEXT } from "../../helpers/example-data"
import { InvalidHashValue } from '$lib/error'

describe("#fromRedisHash", () => {

  let schema: Schema
  let actual: EntityData

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

  describe("when converting an empty hash", () => {
    beforeEach(() => {
      actual = fromRedisHash(schema, {})
    })

    it("returns an empty object", () => {
      expect(actual).toEqual({})
    })
  })

  describe("when converting data not described in the schema", () => {
    beforeEach(() => {
      actual = fromRedisHash(schema, {
        aTrueBoolean: '1', aFalseBoolean: '0',
        aMissingNumber: A_NUMBER_STRING, aMissingDate: A_DATE_EPOCH_STRING,
        aMissingPoint: A_POINT_STRING, aMissingString: A_STRING
      })
    })

    it.each([
      ["leaves a converted true boolean as a string", { aTrueBoolean: '1' }],
      ["leaves a converted false boolean as a string", { aFalseBoolean: '0' }],
      ["leaves a converted number as a string", { aMissingNumber: A_NUMBER_STRING }],
      ["leaves a converted date as an epoch string", { aMissingDate: A_DATE_EPOCH_STRING }],
      ["leaves a converted point as a string", { aMissingPoint: A_POINT_STRING }],
      ["leaves a string as a string", { aMissingString: A_STRING }]
    ])('%s', (_, expected) => {
      expect(actual).toEqual(expect.objectContaining(expected))
    })
  })

  describe("when converting data that *is* described in the schema", () => {

    it.each([

      // boolean
      ["converts a true boolean from a string", { aBoolean: '1' }, { aBoolean: true }],
      ["converts a false boolean from a string", { aBoolean: '0' }, { aBoolean: false }],
      ["converts a renamed boolean from a string", { aRenamedBoolean: '1' }, { anotherBoolean: true }],

      // number
      ["converts a number from a string", { aNumber: A_NUMBER_STRING }, { aNumber: A_NUMBER }],
      ["converts a renamed number from a string", { aRenamedNumber: A_NUMBER_STRING }, { anotherNumber: A_NUMBER }],

      // date
      ["converts a date from an epoch string", { aDate: A_DATE_EPOCH_STRING }, { aDate: A_DATE }],
      ["converts a renamed date from an epoch string", { aRenamedDate: A_DATE_EPOCH_STRING }, { anotherDate: A_DATE }],

      // point
      ["converts a point from a point string", { aPoint: A_POINT_STRING }, { aPoint: A_POINT }],
      ["converts a renamed point from a point string", { aRenamedPoint: A_POINT_STRING }, { anotherPoint: A_POINT }],

      // string
      ["leaves a string as a string", { aString: A_STRING }, { aString: A_STRING }],
      ["leaves a renamed string as a string", { aRenamedString: A_STRING }, { anotherString: A_STRING }],

      // text
      ["converts a string in a text from a string", { someText: SOME_TEXT }, { someText: SOME_TEXT }],
      ["converts a renamed string in a text from a string", { someRenamedText: SOME_TEXT }, { someOtherText: SOME_TEXT }],

      // string[]
      ["converts a string[] from a delimited string", { aStringArray: SOME_STRINGS_JOINED }, { aStringArray: SOME_STRINGS }],
      ["converts a string[] from a string without delimiters", { aStringArray: A_STRING }, { aStringArray: [ A_STRING ] }],
      ["converts a renamed string[] from a delimited string", { aRenamedStringArray: SOME_STRINGS_JOINED }, { anotherStringArray: SOME_STRINGS }],
      ["converts a string[] from a delimited string with a custom delimiter", { aSeparatedStringArray: SOME_STRINGS.join(',') }, { aSeparatedStringArray: SOME_STRINGS }]

    ])('%s', (_, hashData: RedisHashData, expected) => {
      const actual = fromRedisHash(schema, hashData)
      expect(actual).not.toBe(hashData)
      expect(actual).toEqual(expected)
    })

    it.each([
      ["complains when a boolean is invalid", { aBoolean: 'NOT_A_BOOLEAN' }, `Unexpected value for field 'aBoolean' of type 'boolean' from Hash field "aBoolean" read from Redis.`],
      ["complains when an aliased boolean is invalid", { aRenamedBoolean: 'NOT_A_BOOLEAN' }, `Unexpected value for field 'anotherBoolean' of type 'boolean' from Hash field "aRenamedBoolean" read from Redis.`],
      ["complains when a number is not numeric", { aNumber: 'NOT_A_NUMBER' }, `Unexpected value for field 'aNumber' of type 'number' from Hash field "aNumber" read from Redis.`],
      ["complains when an alaised number is not numeric", { aRenamedNumber: 'NOT_A_NUMBER' }, `Unexpected value for field 'anotherNumber' of type 'number' from Hash field "aRenamedNumber" read from Redis.`],
      ["complains when a date is not an epoch string", { aDate: 'NOT_A_NUMBER' }, `Unexpected value for field 'aDate' of type 'date' from Hash field "aDate" read from Redis.`],
      ["complains when an aliased date is not an epoch string", { aRenamedDate: 'NOT_A_NUMBER' }, `Unexpected value for field 'anotherDate' of type 'date' from Hash field "aRenamedDate" read from Redis.`],
      ["complains when a point is not a point string", { aPoint: 'NOT_A_POINT' }, `Unexpected value for field 'aPoint' of type 'point' from Hash field "aPoint" read from Redis.`],
      ["complains when an aliased point is not a point string", { aRenamedPoint: 'NOT_A_POINT' }, `Unexpected value for field 'anotherPoint' of type 'point' from Hash field "aRenamedPoint" read from Redis.`],
    ])('%s', (_, hashData: RedisHashData, expectedMessage) => {
      expect(() => fromRedisHash(schema, hashData)).toThrowErrorOfType(InvalidHashValue, expectedMessage)
    })
  })
})
