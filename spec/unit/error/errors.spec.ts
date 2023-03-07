import { ArrayHashInput, FieldNotInSchema, InvalidHashInput, InvalidHashValue, InvalidInput, InvalidJsonInput, InvalidJsonValue, InvalidSchema, InvalidValue, NestedHashInput, NullJsonInput, NullJsonValue, PointOutOfRange, RedisOmError, SearchError, SemanticSearchError } from '$lib/error'
import { Field } from '$lib/schema'

describe("Errors", () => {

  let error: any

  describe.each([
    ["RedisOmError", RedisOmError],
    ["InvalidInput", InvalidInput],
    ["InvalidSchema", InvalidSchema],
    ["InvalidValue", InvalidValue],
    ["SearchError", SearchError],
    ["SemanticSearchError", SemanticSearchError]
  ])("%s", (_, errorClass) => {
    beforeEach(() => { error = new errorClass("An error has occured.") })
    it("has the expected message", () => expect(error.message).toBe(`An error has occured.`))
  })

  describe.each([
    ["NullJsonInput", NullJsonInput, `Null or undefined found in field 'aString' of type 'string' in JSON at "$.aString".`],
    ["InvalidJsonInput", InvalidJsonInput, `Unexpected value for field 'aString' of type 'string' in JSON at "$.aString".`],
    ["NullJsonValue", NullJsonValue, `Null or undefined found in field 'aString' of type 'string' from JSON path "$.aString" in Redis.`],
    ["InvalidJsonValue", InvalidJsonValue, `Unexpected value for field 'aString' of type 'string' from JSON path "$.aString" in Redis.`]
  ])("%s", (_, errorClass, expectedMessage) => {
    beforeEach(() => { error = new errorClass(new Field('aString', { type: 'string' })) })
    it("has the expected message", () => expect(error.message).toBe(expectedMessage))
    it("has the expected field name", () => expect(error.fieldName).toBe('aString'))
    it("has the expected field type", () => expect(error.fieldType).toBe('string'))
    it("has the expected JSON path", () => expect(error.jsonPath).toBe('$.aString'))
  })

  describe.each([
    ["NestedHashInput", NestedHashInput, `Unexpected object in Hash at property 'aString'. You can not store a nested object in a Redis Hash.`],
    ["ArrayHashInput", ArrayHashInput, `Unexpected array in Hash at property 'aString'. You can not store an array in a Redis Hash without defining it in the Schema.`],
    ["FieldNotInSchema", FieldNotInSchema, `The field 'aString' is not part of the schema and thus cannot be used to search.`]
  ])("%s", (_, errorClass, expectedMessage) => {
    beforeEach(() => { error = new errorClass('aString') })
    it("has the expected message", () => expect(error.message).toBe(expectedMessage))
    it("has the expected field", () => expect(error.field).toBe('aString'))
  })

  describe("InvalidHashInput", () => {
    beforeEach(() => { error = new InvalidHashInput(new Field('aString', { type: 'string' })) })
    it("has the expected message", () => expect(error.message).toBe(`Unexpected value for field 'aString' of type 'string' in Hash.`))
    it("has the expected field name", () => expect(error.fieldName).toBe('aString'))
    it("has the expected field type", () => expect(error.fieldType).toBe('string'))
  })

  describe("InvalidHashValue", () => {
    beforeEach(() => { error = new InvalidHashValue(new Field('aString', { type: 'string' })) })
    it("has the expected message", () => expect(error.message).toBe(`Unexpected value for field 'aString' of type 'string' from Hash field "aString" read from Redis.`))
    it("has the expected field name", () => expect(error.fieldName).toBe('aString'))
    it("has the expected field type", () => expect(error.fieldType).toBe('string'))
    it("has the expected Hash field", () => expect(error.hashField).toBe('aString'))
  })

  describe("PointOutOfRange", () => {
    beforeEach(() => { error = new PointOutOfRange({ longitude: 4242, latitude: 2323 }) })
    it("has the expected message", () => expect(error.message).toBe(`Points must be between ±85.05112878 latitude and ±180 longitude.`))
    it("has the expected point", () => expect(error.point).toEqual({ longitude: 4242, latitude: 2323 }))
  })
})
