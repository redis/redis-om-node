import Globals from '../globals';
import { RedisNumber, RedisTag, RedisText, Schema } from '../../lib/schema';
import { Entity } from '../../lib/entity';

const globals: Globals = (globalThis as unknown) as Globals;

describe("Schema", () => {

  describe("the simplest schema", () => {

    class EmptyEntity extends Entity {}

    let subject: Schema<EmptyEntity>;

    beforeAll(async () => {
      subject = new Schema<EmptyEntity>(EmptyEntity, {
        aNumber: new RedisNumber(),
        aText: new RedisText(),
        aTag: new RedisTag()
      });
    });

    it("has the constructor for the entity",
      () => expect(subject.entityCtor).toBe(EmptyEntity));

    it("generates the keyspace prefix from the entity constructor name",
      () => expect(subject.prefix).toBe("EmptyEntity"));

    it("generates default Redis IDs", () => {
      let id = subject.generateId();
      expect(id).toHaveLength(22);
      expect(id).toMatch(/^[A-Za-z0-9+/]{22}$/);
    });
  });
});
