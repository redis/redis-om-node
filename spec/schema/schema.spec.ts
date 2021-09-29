import Schema from '../../lib/schema/schema';
import Entity from '../../lib/entity/entity';

describe("Schema", () => {

  describe("that is empty", () => {

    interface TestEntity {}
    class TestEntity extends Entity {}

    let schema: Schema<TestEntity>;

    beforeAll(() => schema = new Schema<TestEntity>(TestEntity, {}));
    
    it("has the constructor for the entity",
      () => expect(schema.entityCtor).toBe(TestEntity));
      
    it("generates an empty Redis schema",
      () => expect(schema.redisSchema).toEqual([]));

    it("generates the keyspace prefix from the entity constructor name",
      () => expect(schema.prefix).toBe("TestEntity"));

    it("generates the index name from the entity constructor name",
      () => expect(schema.indexName).toBe("TestEntity:index"));

    it("generates default Redis IDs", () => {
      let id = schema.generateId();
      expect(id).toHaveLength(22);
      expect(id).toMatch(/^[A-Za-z0-9+/]{22}$/);
    });
  });

  describe("that is misconfigured", () => {

    interface TestEntity {}
    class TestEntity extends Entity {}

    it("throws an exception when the type is missing on the field definition", () => {
      expect(() => {
        new Schema<TestEntity>(TestEntity, {
          // @ts-ignore: JavaScript test
          aField: {}
        });
      }).toThrow("The field 'aField' is configured with a type of 'undefined'. Valid types include 'array', 'boolean', 'number', and 'string'.");
    });  

    it("throws an exception when the type is invalid on the field definition", () => {
      expect(() => {
        new Schema<TestEntity>(TestEntity, {
          // @ts-ignore: JavaScript test
          aField: { type: 'foo' }
        });
      }).toThrow("The field 'aField' is configured with a type of 'foo'. Valid types include 'array', 'boolean', 'number', and 'string'.");
    });
  });

  describe("that overrides the keyspace prefix", () => {

    interface TestEntity {}
    class TestEntity extends Entity {}

    let schema: Schema<TestEntity>;

    beforeAll(() => schema = new Schema<TestEntity>(TestEntity, {}, { prefix: 'test-prefix' }));
    
    it("generates the keyspace prefix from the configuration",
      () => expect(schema.prefix).toBe("test-prefix"));

    it("generates the index name from the configured prefix",
      () => expect(schema.indexName).toBe("test-prefix:index"));
  });

  describe("that overrides the index name", () => {

    interface TestEntity {}
    class TestEntity extends Entity {}

    let schema: Schema<TestEntity>;

    beforeAll(() => schema = new Schema<TestEntity>(TestEntity, {}, { indexName: 'test-index' }));
    
    it("generates the index name from the configured prefix",
      () => expect(schema.indexName).toBe("test-index"));
  });

  describe("that overrides the id generation strategy", () => {

    interface TestEntity {}
    class TestEntity extends Entity {}

    let schema: Schema<TestEntity>;

    beforeAll(() => {
      schema = new Schema<TestEntity>(TestEntity, {}, {
        idStrategy: () => '1'
      });
    })

    it("generates Redis IDs from the strategy", () => {
      let id = schema.generateId();
      expect(id).toBe('1');
    });
  });
});
