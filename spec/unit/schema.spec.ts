import Globals from '../globals';
import { RedisNumber, RedisTag, RedisText, Schema } from '../../lib/schema';
import { Entity } from '../../lib/entity';

const globals: Globals = (globalThis as unknown) as Globals;

describe("Schema", () => {

  describe("that is empty", () => {

    interface TestEntity {}
    class TestEntity extends Entity {}

    let subject: Schema<TestEntity>;

    beforeAll(() => subject = new Schema<TestEntity>(TestEntity, {}));
    
    it("has the constructor for the entity",
      () => expect(subject.entityCtor).toBe(TestEntity));
      
    it("generates the keyspace prefix from the entity constructor name",
      () => expect(subject.prefix).toBe("TestEntity"));

    it("generates default Redis IDs", () => {
      let id = subject.generateId();
      expect(id).toHaveLength(22);
      expect(id).toMatch(/^[A-Za-z0-9+/]{22}$/);
    });
  });

  describe("that overrides the keyspace prefix", () => {

    interface TestEntity {}
    class TestEntity extends Entity {}

    let subject: Schema<TestEntity>;

    beforeAll(() => subject = new Schema<TestEntity>(TestEntity, {}, { prefix: 'test-prefix' }));
    
    it("generates the keyspace prefix from the configuration",
      () => expect(subject.prefix).toBe("test-prefix"));
  });

  describe("that overrides the id generation strategy", () => {

    interface TestEntity {}
    class TestEntity extends Entity {}

    let subject: Schema<TestEntity>;

    beforeAll(() => {
      subject = new Schema<TestEntity>(TestEntity, {}, {
        idStrategy: () => '1'
      });
    })

    it("generates Redis IDs from the strategy", () => {
      let id = subject.generateId();
      expect(id).toBe('1');
    });
  });

  describe("that defines a number", () => {

    interface TestEntity {
      aNumber: number;
    }

    class TestEntity extends Entity {}

    let subject: Schema<TestEntity>;
    let entity: TestEntity;

    beforeAll(() => {
      subject = new Schema<TestEntity>(TestEntity, {
        aNumber: new RedisNumber()
      });
    });
    
    beforeEach(() => entity = new TestEntity('foo', { aNumber: '42' }));

    it("adds the getter and setter for a numeric field from the schema definition to the entity", () => {
      expect(entity).toHaveProperty('aNumber', 42);
      entity.aNumber = 23;
      expect(entity.aNumber).toBe(23);
    });
  });

  describe("that defines a text field", () => {

    interface TestEntity {
      aText: string;
    }

    class TestEntity extends Entity {}

    let subject: Schema<TestEntity>;
    let entity: TestEntity;

    beforeAll(() => {
      subject = new Schema<TestEntity>(TestEntity, {
        aText: new RedisText()
      });
    });
    
    beforeEach(() => entity = new TestEntity('foo', { aText: 'foo' }));

    it("adds the getter and setter for a text field from the schema definition to the entity", () => {
      expect(entity).toHaveProperty('aText', 'foo');
      entity.aText = 'baz';
      expect(entity.aText).toBe('baz');
    });
  });

  describe("that defines a tag", () => {

    interface TestEntity {
      aTag: string;
    }

    class TestEntity extends Entity {}

    let subject: Schema<TestEntity>;
    let entity: TestEntity;

    beforeAll(() => {
      subject = new Schema<TestEntity>(TestEntity, {
        aTag: new RedisTag()
      });
    });

    beforeEach(() => entity = new TestEntity('foo', { aTag: 'bar' }));

    it("adds the getter and setter for a tag field from the schema definition to the entity", () => {
      expect(entity).toHaveProperty('aTag', 'bar');
      entity.aTag = 'qux';
      expect(entity.aTag).toBe('qux');
    });
  });
});
