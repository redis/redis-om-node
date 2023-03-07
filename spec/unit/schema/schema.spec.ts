import { InvalidSchema } from '$lib/error'
import { Schema } from '$lib/schema'

import '../../helpers/custom-matchers'

describe("Schema", () => {

  let schema: Schema


  describe("that is empty", () => {
    beforeEach(() => {
      schema = new Schema('TestEntity', {})
    })

    it("provides the default data structure", () => expect(schema.dataStructure).toBe("JSON"))
    it("has the keyspace prefix from the constructor", () => expect(schema.schemaName).toBe("TestEntity"))
    it("generates the index name from the entity constructor name", () => expect(schema.indexName).toBe("TestEntity:index"))
    it("generates the index hash name from the entity constructor name", () => expect(schema.indexHashName).toBe("TestEntity:index:hash"))
    it("generates default Redis IDs", () => expect(schema.generateId()).resolves.toMatch(/^[0-9ABCDEFGHJKMNPQRSTVWXYZ]{26}$/))

    it("provides the default stop word settings", () => {
      expect(schema.useStopWords).toBe('DEFAULT')
      expect(schema.stopWords).toEqual([])
    })

    it("has no fields", () => expect(schema.fields).toHaveLength(0))
    it("returns null when getting a field by name", () => expect(schema.fieldByName('aBoolean')).toBe(null))
  })

  describe("that defines fields", () => {
    beforeEach(() => {
      schema = new Schema('TestEntity', {
        aBoolean: { type: 'boolean' },
        aNumber: { type: 'number' },
        aString: { type: 'string' }
      })
    })

    it("has all three fields", () => expect(schema.fields).toHaveLength(3))

    it("has fields with the expected names and definitions", () => {
      expect(schema.fields.map(field => {
        const { name, type } = field
        return { name, type }
      })).toEqual(expect.arrayContaining([
        { name: 'aBoolean', type: 'boolean' },
        { name: 'aNumber', type: 'number' },
        { name: 'aString', type: 'string' }
      ]))
    })

    it("returns a field by name", () => {
      const field = schema.fieldByName('aBoolean')
      expect(field).toBeDefined()
      expect(field!.name).toBe('aBoolean')
      expect(field!.type).toBe('boolean')
    })
  })

  describe("that overrides the data structure to be JSON", () => {
    beforeEach(() => {
      schema = new Schema('TestEntity', {}, { dataStructure: 'JSON' })
    })
    it("provides a JSON data structure", () => expect(schema.dataStructure).toBe("JSON"))
  })

  describe("that overrides the data structure to be HASH", () => {
    beforeEach(() => {
      schema = new Schema('TestEntity', {}, { dataStructure: 'HASH' })
    })
    it("provides a HASH data structure", () => expect(schema.dataStructure).toBe("HASH"))
  })

  describe("that overrides the index name", () => {
    beforeEach(() => {
      schema = new Schema('TestEntity', {}, { indexName: 'test-index' })
    })
    it("generates the index name from the configured index name, ignoring the prefix", () => expect(schema.indexName).toBe("test-index"))
  })

  describe("that overrides the index hash name", () => {
    beforeEach(() => {
      schema = new Schema('TestEntity', {}, { indexHashName: 'test-index-hash' })
    })
    it("generates the index hash name from the configured index hash name, ignoring the prefix", () => expect(schema.indexHashName).toBe("test-index-hash"))
  })

  describe("that overrides the id generation strategy", () => {
    beforeEach(() => {
      schema = new Schema('TestEntity', {}, { idStrategy: async () => '1' })
    })
    it("generates Redis IDs from the strategy", () => expect(schema.generateId()).resolves.toBe('1'))
  })

  describe("that disables stop words", () => {
    beforeEach(() => {
      schema = new Schema('TestEntity', {}, { useStopWords: 'OFF' })
    })
    it("provides the stop words option", () => expect(schema.useStopWords).toBe('OFF'))
  })

  describe("that uses default stop words", () => {
    beforeEach(() => {
      schema = new Schema('TestEntity', {}, { useStopWords: 'DEFAULT' })
    })
    it("provides the stop words option", () => expect(schema.useStopWords).toBe('DEFAULT'))
  })

  describe("that uses custom stop words", () => {
    beforeEach(() => {
      schema = new Schema('TestEntity', {}, { useStopWords: 'CUSTOM' })
    })
    it("provides the stop words option", () => expect(schema.useStopWords).toBe('CUSTOM'))
  })

  describe("that sets custom stop words", () => {
    beforeEach(() => {
      schema = new Schema('TestEntity', {}, { stopWords: ['foo', 'bar', 'baz'] })
    })
    it("provides the custom stop words", () => expect(schema.stopWords).toEqual(['foo', 'bar', 'baz']))
  })

  describe("that is misconfigured", () => {
    it("throws an exception when keyspace prefix is empty", () =>
      expect(() => new Schema('', {})).toThrowErrorOfType(InvalidSchema, "Schema name must be a non-empty string."))

    it("throws an exception when the type is missing on a field definition", () =>
      // @ts-ignore: JavaScript test
      expect(() => new Schema('TestEntity', { aField: {} }))
        .toThrowErrorOfType(InvalidSchema, "The field 'aField' is configured with a type of 'undefined'. Valid types include 'boolean', 'date', 'number', 'point', 'string', 'string[]', and 'text'."))

    it("throws an exception when the type is invalid on a field definition", () =>
      // @ts-ignore: JavaScript test
      expect(() => new Schema('TestEntity', { aField: { type: 'foo' } }))
        .toThrowErrorOfType(InvalidSchema, "The field 'aField' is configured with a type of 'foo'. Valid types include 'boolean', 'date', 'number', 'point', 'string', 'string[]', and 'text'."))

    it("throws an exception when the data structure is invalid", () => {
      // @ts-ignore: JavaScript test
      expect(() => new Schema('TestEntity', {}, { dataStructure: 'FOO' }))
        .toThrowErrorOfType(InvalidSchema, "'FOO' in an invalid data structure. Valid data structures are 'HASH' and 'JSON'.")
    })

    it("throws an exception when use stop words are invalid", () => {
      // @ts-ignore: JavaScript test
      expect(() => new Schema('TestEntity', {}, { useStopWords: 'FOO' }))
        .toThrowErrorOfType(InvalidSchema, "'FOO' in an invalid value for stop words. Valid values are 'OFF', 'DEFAULT', and 'CUSTOM'.")
    })

    it("throws an exception when index name is empty", () =>
      expect(() => new Schema('TestEntity', {}, { indexName: '' }))
        .toThrowErrorOfType(InvalidSchema, "Index name must be a non-empty string."))

    it("throws an exception when ID strategy is not a function", () =>
      // @ts-ignore: JavaScript test
      expect(() => new Schema('TestEntity', {}, { idStrategy: 'NOT A FUNCTION' }))
        .toThrowErrorOfType(InvalidSchema, "ID strategy must be a function that takes no arguments and returns a string."))
  })
})
