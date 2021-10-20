import Schema from '../../lib/schema/schema';
import Entity from '../../lib/entity/entity';

describe("Schema", () => {

  describe("that is empty", () => {
    interface TestEntity {}
    class TestEntity extends Entity {}

    let schema: Schema<TestEntity>;

    beforeEach(() => schema = new Schema<TestEntity>(TestEntity, {}));

    it("has the constructor for the entity", () =>
      expect(schema.entityCtor).toBe(TestEntity));
      
    it("generates an empty Redis schema", () =>
      expect(schema.redisSchema).toEqual([]));

    it("provides the default data structure", () =>
      expect(schema.dataStructure).toBe("HASH"));

    it("generates the keyspace prefix from the entity constructor name", () =>
      expect(schema.prefix).toBe("TestEntity"));

    it("generates the index name from the entity constructor name", () =>
      expect(schema.indexName).toBe("TestEntity:index"));

    it("generates default Redis IDs", () => {
      let id = schema.generateId();
      expect(id).toBeUlid();
      // expect(id).toHaveLength(26);
      // expect(id).toMatch(/^[0-9ABCDEFGHJKMNPQRSTVWXYZ]{26}$/);
    });
  });

  describe("that overrides the data structure to be JSON", () => {
    interface TestEntity {}
    class TestEntity extends Entity {}

    let schema: Schema<TestEntity>;

    beforeEach(() => schema = new Schema<TestEntity>(TestEntity, {}, { dataStructure: 'JSON' }));

    it("provides a JSON data structure", () => expect(schema.dataStructure).toBe("JSON"));
  });

  describe("that overrides the data structure to be HASH", () => {
    interface TestEntity {}
    class TestEntity extends Entity {}

    let schema: Schema<TestEntity>;

    beforeEach(() => schema = new Schema<TestEntity>(TestEntity, {}, { dataStructure: 'HASH' }));

    it("provides a HASH data structure", () => expect(schema.dataStructure).toBe("HASH"));
  });

  describe("that overrides the keyspace prefix", () => {
    interface TestEntity {}
    class TestEntity extends Entity {}

    let schema: Schema<TestEntity>;

    beforeEach(() => schema = new Schema<TestEntity>(TestEntity, {}, { prefix: 'test-prefix' }));

    it("generates the keyspace prefix from the configuration", () =>
      expect(schema.prefix).toBe("test-prefix"));

    it("generates the index name from the configured prefix", () =>
      expect(schema.indexName).toBe("test-prefix:index"));
  });

  describe("that overrides the index name", () => {
    interface TestEntity {}
    class TestEntity extends Entity {}

    let schema: Schema<TestEntity>;

    beforeEach(() => schema = new Schema<TestEntity>(TestEntity, {}, { indexName: 'test-index' }));
    
    it("generates the index name from the configured index name, ignoring the prefix", () =>
      expect(schema.indexName).toBe("test-index"));
  });

  describe("that overrides the id generation strategy", () => {
    interface TestEntity {}
    class TestEntity extends Entity {}

    let schema: Schema<TestEntity>;

    beforeEach(() => schema = new Schema<TestEntity>(TestEntity, {}, { idStrategy: () => '1'}));

    it("generates Redis IDs from the strategy", () => expect(schema.generateId()).toBe('1'));
  });

  describe("that is misconfigured", () => {
    interface TestEntity {}
    class TestEntity extends Entity {}

    it("throws an exception when the type is missing on a field definition", () =>
      // @ts-ignore: JavaScript test
      expect(() => new Schema<TestEntity>(TestEntity, { aField: {} }))
        .toThrow("The field 'aField' is configured with a type of 'undefined'. Valid types include 'array', 'boolean', 'number', and 'string'."));

    it("throws an exception when the type is invalid on a field definition", () =>
      // @ts-ignore: JavaScript test
      expect(() => new Schema<TestEntity>(TestEntity, { aField: { type: 'foo' } }))
        .toThrow("The field 'aField' is configured with a type of 'foo'. Valid types include 'array', 'boolean', 'number', and 'string'."));

    it("throws an exception when the data structure is invalid", () => {
      // @ts-ignore: JavaScript test
      expect(() => new Schema<TestEntity>(TestEntity, {}, { dataStructure: 'FOO' }))
        .toThrow("'FOO' in an invalid data structure. Valid data structures are 'HASH' and 'JSON'.");
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
