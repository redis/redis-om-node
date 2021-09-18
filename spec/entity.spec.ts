import Globals from './globals';
import { Schema } from '../lib/schema';
import { Entity } from '../lib/entity';

const globals: Globals = (globalThis as unknown) as Globals;

describe("Entity", () => {

  const REDIS_ID = 'foo';

  interface TestEntity {
    aNumber?: number | null;
    aString?: string | null;
    aBoolean?: boolean | null;
    anotherNumber?: number | null;
    anotherString?: string | null;
    anotherBoolean?: boolean | null;
  }

  class TestEntity extends Entity {}

  let schema: Schema<TestEntity>;
  let entity: TestEntity;

  beforeAll(() => schema = new Schema<TestEntity>(TestEntity, {
    aNumber: { type: 'number' },
    aString: { type: 'string' },
    aBoolean: { type: 'boolean' },
    anotherNumber: { type: 'number', alias: 'aliasedNumber' },
    anotherString: { type: 'string', alias: 'aliasedString' },
    anotherBoolean: { type: 'boolean', alias: 'aliasedBoolean' }
  }));

  describe("without data", () => {
    beforeEach(() => entity = new TestEntity(REDIS_ID));
  
    it("has the passed in Redis ID", () => expect(entity.redisId).toBe(REDIS_ID));
    it("returns null for the number property", () => expect(entity.aNumber).toBeNull());
    it("returns null for the string property", () => expect(entity.aString).toBeNull());
    it("returns null for the boolean property", () => expect(entity.aBoolean).toBeNull());
  });

  describe("with data", () => {
    beforeEach(() => entity = new TestEntity(REDIS_ID, { 
      aNumber: '42', aString: 'bar', aBoolean: '1',
      aliasedNumber: '23', aliasedString: 'baz', aliasedBoolean: '0',
    }));

    it("has the passed in Redis ID", () => expect(entity.redisId).toBe(REDIS_ID));

    describe("reading the data", () => {
      it("returns a number for the number property", () => expect(entity.aNumber).toBe(42));
      it("returns a string for the string property", () => expect(entity.aString).toBe('bar'));
      it("returns a boolean for the boolean property", () => expect(entity.aBoolean).toBe(true));
      it("returns a number for the aliased number property", () => expect(entity.anotherNumber).toBe(23));
      it("returns a string for the aliased string property", () => expect(entity.anotherString).toBe('baz'));
      it("returns a boolean for the aliased boolean property", () => expect(entity.anotherBoolean).toBe(false));
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
