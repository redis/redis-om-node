import Globals from '../globals';
import { RedisNumber, RedisTag, RedisText, Schema } from '../../lib/schema';
import { Entity } from '../../lib/entity';

const globals: Globals = (globalThis as unknown) as Globals;

describe("Entity", () => {

  interface TestEntity {
    aNumber?: number | null;
    aText?: string | null;
    aTag?: string | null;
  }

  class TestEntity extends Entity {}

  let schema: Schema<TestEntity>;
  let entity: TestEntity;

  beforeAll(() => schema = new Schema<TestEntity>(TestEntity, {
    aNumber: new RedisNumber(),
    aText: new RedisText(),
    aTag: new RedisTag()
  }));

  describe("without data", () => {
    beforeEach(() => entity = new TestEntity('foo'));
  
    it("has the passed in Redis ID", () => expect(entity.redisId).toBe('foo'));
    it("returns null for the number property", () => expect(entity.aNumber).toBeNull());
    it("returns null for the text property", () => expect(entity.aText).toBeNull());
    it("returns null for the tag property", () => expect(entity.aTag).toBeNull());
  });

  describe("with data", () => {
    beforeEach(() => entity = new TestEntity('foo', { aNumber: '42', aText: 'bar', aTag: 'baz' }));

    it("has the passed in Redis ID", () => expect(entity.redisId).toBe('foo'));

    describe("reading the data", () => {
      it("returns a number for the number property", () => expect(entity.aNumber).toBe(42));
      it("returns a string for the text property", () => expect(entity.aText).toBe('bar'));
      it("returns a string for the tag property", () => expect(entity.aTag).toBe('baz'));
    });
  
    describe("changing the data", () => {
      it("stores a string when the number property is changed", () => {
        entity.aNumber = 23;
        expect(entity.redisData.aNumber).toBe('23');
      });

      it("stores a string when the text property is changed", () => {
        entity.aText = 'qux';
        expect(entity.redisData.aText).toBe('qux');
      });

      it("stores a string when the tag property is changed", () => {
        entity.aTag = 'quux';
        expect(entity.redisData.aTag).toBe('quux');
      });
    });
  
    describe("deleting the data", () => {
      it("removes nulled properties", () => {
        entity.aNumber = null;
        entity.aText = null;
        entity.aTag = null;
        expect(entity.redisData.aNumber).toBeUndefined();
        expect(entity.redisData.aText).toBeUndefined();
        expect(entity.redisData.aTag).toBeUndefined();
      });

      it("removes undefined properties", () => {
        entity.aNumber = undefined;
        entity.aText = undefined;
        entity.aTag = undefined;
        expect(entity.redisData.aNumber).toBeUndefined();
        expect(entity.redisData.aText).toBeUndefined();
        expect(entity.redisData.aTag).toBeUndefined();
      });
    });
  });
});
