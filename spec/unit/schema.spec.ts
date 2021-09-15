import Globals from '../globals';
import { RedisNumber, RedisTag, RedisText, Schema } from '../../lib/schema';
import { Entity } from '../../lib/entity';

const globals: Globals = (globalThis as unknown) as Globals;

describe("Schema", () => {

  describe("the simplest schema", () => {

    interface SimpleEntity {
      aNumber: number;
      aText: string;
      aTag: string;
    }

    class SimpleEntity extends Entity {}

    let subject: Schema<SimpleEntity>;

    beforeAll(async () => {
      subject = new Schema<SimpleEntity>(SimpleEntity, {
        aNumber: new RedisNumber(),
        aText: new RedisText(),
        aTag: new RedisTag()
      });
    });

    it("has the constructor for the entity",
      () => expect(subject.entityCtor).toBe(SimpleEntity));
      
    it("adds the getters from the schema definition to the entity", () => {
      let entity = new SimpleEntity('foo', { aNumber: '42', aText: 'foo', aTag: 'bar' });

      expect(entity).toHaveProperty('aNumber', 42);
      expect(entity).toHaveProperty('aText', 'foo');
      expect(entity).toHaveProperty('aTag', 'bar');
    });

    it("adds the setters from the schema definition to the entity", () => {
      let entity = new SimpleEntity('foo');

      entity.aNumber = 23;
      entity.aText = 'baz';
      entity.aTag = 'qux';
      
      expect(entity.aNumber).toBe(23);
      expect(entity.aText).toBe('baz');
      expect(entity.aTag).toBe('qux');
    });

    it("generates the keyspace prefix from the entity constructor name",
      () => expect(subject.prefix).toBe("EmptyEntity"));

    it("generates default Redis IDs", () => {
      let id = subject.generateId();
      expect(id).toHaveLength(22);
      expect(id).toMatch(/^[A-Za-z0-9+/]{22}$/);
    });
  });
});
