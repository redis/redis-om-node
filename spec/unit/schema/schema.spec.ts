import { Schema } from '$lib/schema/schema';
import { Entity } from '$lib/entity/entity';

describe("Schema", () => {

  class TestEntity extends Entity {}
  let schema: Schema<TestEntity>;


  describe("that is empty", () => {
    beforeEach(() => {
      schema = new Schema<TestEntity>(TestEntity, {})
    });

    it("has the constructor for the entity", () => expect(schema.entityCtor).toBe(TestEntity));
    it("provides the default data structure", () => expect(schema.dataStructure).toBe("JSON"));
    it("generates the keyspace prefix from the entity constructor name", () => expect(schema.prefix).toBe("TestEntity"));
    it("generates the index name from the entity constructor name", () => expect(schema.indexName).toBe("TestEntity:index"));
    it("generates the index hash name from the entity constructor name", () => expect(schema.indexHashName).toBe("TestEntity:index:hash"));
    it("generates default Redis IDs", () => expect(schema.generateId()).toMatch(/^[0-9ABCDEFGHJKMNPQRSTVWXYZ]{26}$/));

    it("provides the default stop word settings", () => {
      expect(schema.useStopWords).toBe('DEFAULT')
      expect(schema.stopWords).toEqual([])
    });
  });

  describe("that overrides the data structure to be JSON", () => {
    beforeEach(() => {
      schema = new Schema<TestEntity>(TestEntity, {}, { dataStructure: 'JSON' })
    });
    it("provides a JSON data structure", () => expect(schema.dataStructure).toBe("JSON"));
  });

  describe("that overrides the data structure to be HASH", () => {
    beforeEach(() => {
      schema = new Schema<TestEntity>(TestEntity, {}, { dataStructure: 'HASH' })
    });
    it("provides a HASH data structure", () => expect(schema.dataStructure).toBe("HASH"));
  });

  describe("that overrides the keyspace prefix", () => {
    beforeEach(() => {
      schema = new Schema<TestEntity>(TestEntity, {}, { prefix: 'test-prefix' })
    });
    it("generates the keyspace prefix from the configuration", () => expect(schema.prefix).toBe("test-prefix"));
    it("generates the index name from the configured prefix", () => expect(schema.indexName).toBe("test-prefix:index"));
    it("generates the index hash name from the configured prefix", () => expect(schema.indexHashName).toBe("test-prefix:index:hash"));
  });

  describe("that overrides the index name", () => {
    beforeEach(() => {
      schema = new Schema<TestEntity>(TestEntity, {}, { indexName: 'test-index' })
    });
    it("generates the index name from the configured index name, ignoring the prefix", () => expect(schema.indexName).toBe("test-index"));
  });

  describe("that overrides the index hash name", () => {
    beforeEach(() => {
      schema = new Schema<TestEntity>(TestEntity, {}, { indexHashName: 'test-index-hash' })
    });
    it("generates the index hash name from the configured index hash name, ignoring the prefix", () => expect(schema.indexHashName).toBe("test-index-hash"));
  });

  describe("that overrides the id generation strategy", () => {
    beforeEach(() => {
      schema = new Schema<TestEntity>(TestEntity, {}, { idStrategy: () => '1' })
    });
    it("generates Redis IDs from the strategy", () => expect(schema.generateId()).toBe('1'));
  });

  describe("that disables stop words", () => {
    beforeEach(() => {
      schema = new Schema<TestEntity>(TestEntity, {}, { useStopWords: 'OFF' })
    });
    it("provides the stop words option", () => expect(schema.useStopWords).toBe('OFF'));
  });

  describe("that uses default stop words", () => {
    beforeEach(() => {
      schema = new Schema<TestEntity>(TestEntity, {}, { useStopWords: 'DEFAULT' })
    });
    it("provides the stop words option", () => expect(schema.useStopWords).toBe('DEFAULT'));
  });

  describe("that uses custom stop words", () => {
    beforeEach(() => {
      schema = new Schema<TestEntity>(TestEntity, {}, { useStopWords: 'CUSTOM' })
    });
    it("provides the stop words option", () => expect(schema.useStopWords).toBe('CUSTOM'));
  });

  describe("that sets custom stop words", () => {
    beforeEach(() => {
      schema = new Schema<TestEntity>(TestEntity, {}, { stopWords: ['foo', 'bar', 'baz'] })
    });
    it("provides the custom stop words", () => expect(schema.stopWords).toEqual(['foo', 'bar', 'baz']));
  });

  describe("that is misconfigured", () => {
    it("throws an exception when the type is missing on a field definition", () =>
      // @ts-ignore: JavaScript test
      expect(() => new Schema<TestEntity>(TestEntity, { aField: {} }))
        .toThrow("The field 'aField' is configured with a type of 'undefined'. Valid types include 'boolean', 'date', 'number', 'point', 'string', 'string[]', and 'text'."));

    it("throws an exception when the type is invalid on a field definition", () =>
      // @ts-ignore: JavaScript test
      expect(() => new Schema<TestEntity>(TestEntity, { aField: { type: 'foo' } }))
        .toThrow("The field 'aField' is configured with a type of 'foo'. Valid types include 'boolean', 'date', 'number', 'point', 'string', 'string[]', and 'text'."));

    it("throws an exception when the data structure is invalid", () => {
      // @ts-ignore: JavaScript test
      expect(() => new Schema<TestEntity>(TestEntity, {}, { dataStructure: 'FOO' }))
        .toThrow("'FOO' in an invalid data structure. Valid data structures are 'HASH' and 'JSON'.");
    });

    it("throws an exception when use stop words are invalid", () => {
      // @ts-ignore: JavaScript test
      expect(() => new Schema<TestEntity>(TestEntity, {}, { useStopWords: 'FOO' }))
        .toThrow("'FOO' in an invalid value for stop words. Valid values are 'OFF', 'DEFAULT', and 'CUSTOM'.");
    });

    it("throws an exception when keyspace prefix is empty", () =>
      expect(() => new Schema<TestEntity>(TestEntity, {}, { prefix: '' }))
        .toThrow("Prefix must be a non-empty string."));

    it("throws an exception when index name is empty", () =>
      expect(() => new Schema<TestEntity>(TestEntity, {}, { indexName: '' }))
        .toThrow("Index name must be a non-empty string."));

    it("throws an exception when ID strategy is not a function", () =>
      // @ts-ignore: JavaScript test
      expect(() => new Schema<TestEntity>(TestEntity, {}, { idStrategy: 'NOT A FUNCTION' }))
        .toThrow("ID strategy must be a function that takes no arguments and returns a string."));
  });
});
