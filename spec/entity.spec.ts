import Globals from './globals';
import { RedisNumber, RedisString, RedisBoolean, Schema } from '../lib/schema';
import { Entity } from '../lib/entity';

const globals: Globals = (globalThis as unknown) as Globals;

describe("Entity", () => {

  interface TestEntity {
    aNumber?: number | null;
    aString?: string | null;
    aBoolean?: boolean | null;
  }

  class TestEntity extends Entity {}

  let schema: Schema<TestEntity>;
  let entity: TestEntity;

  beforeAll(() => schema = new Schema<TestEntity>(TestEntity, {
    aNumber: new RedisNumber(),
    aString: new RedisString(),
    aBoolean: new RedisBoolean()
  }));

  describe("without data", () => {
    beforeEach(() => entity = new TestEntity('foo'));
  
    it("has the passed in Redis ID", () => expect(entity.redisId).toBe('foo'));
    it("returns null for the number property", () => expect(entity.aNumber).toBeNull());
    it("returns null for the string property", () => expect(entity.aString).toBeNull());
    it("returns null for the boolean property", () => expect(entity.aBoolean).toBeNull());
  });

  describe("with data", () => {
    beforeEach(() => entity = new TestEntity('foo', { aNumber: '42', aString: 'bar', aBoolean: '1' }));

    it("has the passed in Redis ID", () => expect(entity.redisId).toBe('foo'));

    describe("reading the data", () => {
      it("returns a number for the number property", () => expect(entity.aNumber).toBe(42));
      it("returns a string for the string property", () => expect(entity.aString).toBe('bar'));
      it("returns a boolean for the boolean property", () => expect(entity.aBoolean).toBe(true));
    });
  
    describe("changing the data", () => {
      it("stores a string when the number property is changed", () => {
        entity.aNumber = 23;
        expect(entity.redisData.aNumber).toBe('23');
      });

      it("stores a string when the string property is changed", () => {
        entity.aString = 'qux';
        expect(entity.redisData.aString).toBe('qux');
      });

      it("stores a string when the booelan property is changed", () => {
        entity.aBoolean = false;
        expect(entity.redisData.aBoolean).toBe('0');
      });
    });
  
    describe("deleting the data", () => {
      it("removes nulled properties", () => {
        entity.aNumber = null;
        entity.aString = null;
        entity.aBoolean = null;
        expect(entity.redisData.aNumber).toBeUndefined();
        expect(entity.redisData.aString).toBeUndefined();
        expect(entity.redisData.aBoolean).toBeUndefined();
      });

      it("removes undefined properties", () => {
        entity.aNumber = undefined;
        entity.aString = undefined;
        entity.aBoolean = undefined;
        expect(entity.redisData.aNumber).toBeUndefined();
        expect(entity.redisData.aString).toBeUndefined();
        expect(entity.redisData.aBoolean).toBeUndefined();
      });
    });
  });
});
