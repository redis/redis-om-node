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

    it("generates default Redis IDs", () => {
      let id = schema.generateId();
      expect(id).toHaveLength(22);
      expect(id).toMatch(/^[A-Za-z0-9+/]{22}$/);
    });
  });

  describe("that overrides the keyspace prefix", () => {

    interface TestEntity {}
    class TestEntity extends Entity {}

    let schema: Schema<TestEntity>;

    beforeAll(() => schema = new Schema<TestEntity>(TestEntity, {}, { prefix: 'test-prefix' }));
    
    it("generates the keyspace prefix from the configuration",
      () => expect(schema.prefix).toBe("test-prefix"));
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
