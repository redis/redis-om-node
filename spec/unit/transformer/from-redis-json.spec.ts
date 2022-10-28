import { fromRedisJson } from "$lib/transformer";
import { Schema } from "$lib/schema";
import { Entity } from "$lib/entity/entity";
import { ANOTHER_STRING, A_DATE, A_DATE_EPOCH, A_DATE_EPOCH_STRING, A_NUMBER, A_NUMBER_STRING, A_POINT, A_POINT_STRING, A_STRING, A_THIRD_STRING, SOME_STRINGS, SOME_STRINGS_JOINED, SOME_TEXT } from "../../helpers/example-data";
import { RedisJsonData } from "../../../dist";

describe("#fromRedisJson", () => {

  class TestEntity extends Entity {}
  let schema: Schema<TestEntity>;
  let actual: object;

  beforeEach(() => {
    schema = new Schema(TestEntity, {
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
      anotherStringArray: { type: 'string[]', path: '$.aPathedStringArray' },
      aNestedStringArray: { type: 'string[]', path: '$.aNestedStringArray.aStringArray' },
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
      ["leaves an array as an array", { aMissingArray: [ A_STRING, A_NUMBER, true ] }],
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
      ["leaves a string[] as a string[]", { aStringArray: SOME_STRINGS }, { aStringArray: SOME_STRINGS }],
      ["leaves a null string[] as null", { aStringArray: null }, { aStringArray: null }],
      ["coerces numbers and booleans in a string[] to strings", { aStringArray: [ A_STRING, A_NUMBER, true] }, { aStringArray: [A_STRING, A_NUMBER_STRING, 'true'] }],

      ["leaves a pathed string[] as a string[]", { aPathedStringArray: SOME_STRINGS }, { aPathedStringArray: SOME_STRINGS }],
      ["leaves a pathed null string[] as null", { aPathedStringArray: null }, { aPathedStringArray: null }],
      ["coerces numbers and booleans in a pathed string[] to strings", { aPathedStringArray: [ A_STRING, A_NUMBER, true] }, { aPathedStringArray: [A_STRING, A_NUMBER_STRING, 'true'] }],

      ["leaves a nested string[] as a string[]", { aNestedStringArray: { aStringArray: SOME_STRINGS } }, { aNestedStringArray: { aStringArray: SOME_STRINGS } }],
      ["leaves a nested null string[] as null", { aNestedStringArray: { aStringArray: null } }, { aNestedStringArray: { aStringArray: null } }],
      ["coerces numbers and booleans in a nested string[] to strings", { aNestedStringArray: { aStringArray: [ A_STRING, A_NUMBER, true] } }, { aNestedStringArray: { aStringArray: [A_STRING, A_NUMBER_STRING, 'true'] } }],

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
      ["complains when a boolean is invalid", { aBoolean: 'NOT_A_BOOLEAN' }, `Expected a value of true, false, or null from RedisJSON for a boolean but received: "NOT_A_BOOLEAN"`],
      ["complains when a pathed boolean is invalid", { aPathedBoolean: 'NOT_A_BOOLEAN' }, `Expected a value of true, false, or null from RedisJSON for a boolean but received: "NOT_A_BOOLEAN"`],
      ["complains when a nested boolean is invalid", { aNestedBoolean: { aBoolean: 'NOT_A_BOOLEAN' } }, `Expected a value of true, false, or null from RedisJSON for a boolean but received: "NOT_A_BOOLEAN"`],

      ["complains when a number is invalid", { aNumber: 'NOT_A_NUMBER' }, `Expected a number from RedisJSON but received: "NOT_A_NUMBER"`],
      ["complains when a pathed number is invalid", { aPathedNumber: 'NOT_A_NUMBER' }, `Expected a number from RedisJSON but received: "NOT_A_NUMBER"`],
      ["complains when a nested number is invalid", { aNestedNumber: { aNumber: 'NOT_A_NUMBER' } }, `Expected a number from RedisJSON but received: "NOT_A_NUMBER"`],

      ["complains when a date is invalid", { aDate: 'NOT_A_NUMBER' }, `Expected a number containing a epoch date from RedisJSON but received: "NOT_A_NUMBER"`],
      ["complains when a pathed date is invalid", { aPathedDate: 'NOT_A_NUMBER' }, `Expected a number containing a epoch date from RedisJSON but received: "NOT_A_NUMBER"`],
      ["complains when a nested date is invalid", { aNestedDate: { aDate: 'NOT_A_NUMBER' } }, `Expected a number containing a epoch date from RedisJSON but received: "NOT_A_NUMBER"`],

      ["complains when a point is not a point string", { aPoint: 'NOT_A_POINT' }, `Expected a point string from RedisJSON but received: "NOT_A_POINT"`],
      ["complains when a point is not a string", { aPoint: A_NUMBER }, `Expected a point string from RedisJSON but received: 42`],
      ["complains when a pathed point is invalid", { aPathedPoint: 'NOT_A_POINT' }, `Expected a point string from RedisJSON but received: "NOT_A_POINT"`],
      ["complains when a nested point is invalid", { aNestedPoint: { aPoint: 'NOT_A_POINT' } }, `Expected a point string from RedisJSON but received: "NOT_A_POINT"`],

      ["complains when a string is invalid", { aString: SOME_STRINGS }, `Expected a string from RedisJSON but received: [\n "alfa",\n "bravo",\n "charlie"\n]`],
      ["complains when a pathed string is invalid", { aPathedString: SOME_STRINGS }, `Expected a string from RedisJSON but received: [\n "alfa",\n "bravo",\n "charlie"\n]`],
      ["complains when a nested string is invalid", { aNestedString: { aString: SOME_STRINGS } }, `Expected a string from RedisJSON but received: [\n "alfa",\n "bravo",\n "charlie"\n]`],

      ["complains when text is invalid", { someText: SOME_STRINGS }, `Expected a string from RedisJSON but received: [\n "alfa",\n "bravo",\n "charlie"\n]`],
      ["complains when pathed text is invalid", { somePathedText: SOME_STRINGS }, `Expected a string from RedisJSON but received: [\n "alfa",\n "bravo",\n "charlie"\n]`],
      ["complains when nested text is invalid", { someNestedText: { someText: SOME_STRINGS } }, `Expected a string from RedisJSON but received: [\n "alfa",\n "bravo",\n "charlie"\n]`],

      ["complains when a string[] is invalid", { aStringArray: 'NOT_AN_ARRAY' }, `Expected a string[] from RedisJSON but received: "NOT_AN_ARRAY"`],
      ["complains when a string[] is invalid", { aPathedStringArray: 'NOT_AN_ARRAY' }, `Expected a string[] from RedisJSON but received: "NOT_AN_ARRAY"`],
      ["complains when a string[] is invalid", { aNestedStringArray: { aStringArray: 'NOT_AN_ARRAY' } }, `Expected a string[] from RedisJSON but received: "NOT_AN_ARRAY"`],

      ["complains when a string[] contains a null", { aStringArray: [ A_STRING, null, ANOTHER_STRING ] }, `Expected a string[] from RedisJSON but received an array containing null: [\n "foo",\n null,\n "bar"\n]`],
      ["complains when a pathed string[] contains a null", { aPathedStringArray: [ A_STRING, null, ANOTHER_STRING ] }, `Expected a string[] from RedisJSON but received an array containing null: [\n "foo",\n null,\n "bar"\n]`],
      ["complains when a nested string[] contains a null", { aNestedStringArray: { aStringArray: [ A_STRING, null, ANOTHER_STRING ] } }, `Expected a string[] from RedisJSON but received an array containing null: [\n "foo",\n null,\n "bar"\n]`],
      ["complains when a dispersed string[] contains null", { someOtherStrings:  [ A_STRING, null, ANOTHER_STRING] }, `Expected a string[] from RedisJSON but received an array or object containing null: [\n "foo",\n null,\n "bar"\n]`],
      ["complains when a widely dispersed string[] contains null", { someObjects: [ { aString: A_STRING }, { aString: null }, { aString: ANOTHER_STRING } ] }, `Expected a string[] from RedisJSON but received an array or object containing null: {\n "aString": null\n}`]

    ])('%s', (_, jsonData: RedisJsonData, expectedException) => {
      expect(() => fromRedisJson(schema, jsonData)).toThrow(expectedException)
    })
  })
})
