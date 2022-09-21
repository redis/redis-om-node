import { toRedisJson } from "$lib/transformer";
import { Schema } from "$lib/schema";
import { Entity } from "$lib/entity/entity";
import { RedisJsonData } from "$lib/client";
import { A_DATE, A_DATE_EPOCH, A_NUMBER, A_POINT, A_STRING } from "../../helpers/example-data";


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
        anArray: [ A_STRING, A_NUMBER, true ],
        anObject: { aString: A_STRING, aNumber: A_NUMBER, aBoolean: true }
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
      ["leaves an object as an object", { anObject: { aString: A_STRING, aNumber: A_NUMBER, aBoolean: true } }]
    ])('%s', (_, expected) => {
      expect(actual).toEqual(expect.objectContaining(expected))
    })

    it("removes an explicit undefined", () => expect(actual).not.toHaveProperty('somethingUndefined'))
  })
})
