import Schema from '../../lib/schema/schema'
import Entity from '../../lib/entity/entity';
import { EntityId } from '../../lib/entity/entity-types';

describe("Entity", () => {

  const ENTITY_ID: EntityId = 'foo';

  interface TestEntity {
    aNumber?: number | null;
    aString?: string | null;
    aBoolean?: boolean | null;
    anArray?: string[] | null;
    anotherNumber?: number | null;
    anotherString?: string | null;
    anotherBoolean?: boolean | null;
    anotherArray?: string[] | null;
  }

  class TestEntity extends Entity {}

  let schema: Schema<TestEntity>;
  let entity: TestEntity;

  beforeAll(() => schema = new Schema<TestEntity>(TestEntity, {
    aNumber: { type: 'number' },
    aString: { type: 'string' },
    aBoolean: { type: 'boolean' },
    anArray: { type: 'array' },
    anotherNumber: { type: 'number', alias: 'aliasedNumber' },
    anotherString: { type: 'string', alias: 'aliasedString' },
    anotherBoolean: { type: 'boolean', alias: 'aliasedBoolean' },
    anotherArray: { type: 'array', alias: 'aliasedArray' }
  }));

  describe("without data", () => {
    beforeEach(() => entity = new TestEntity(ENTITY_ID));
  
    it("has the passed in Redis ID", () => expect(entity.entityId).toBe(ENTITY_ID));
    it("returns null for the number property", () => expect(entity.aNumber).toBeNull());
    it("returns null for the string property", () => expect(entity.aString).toBeNull());
    it("returns null for the boolean property", () => expect(entity.aBoolean).toBeNull());
    it("returns null for the array property", () => expect(entity.anArray).toBeNull());
  });

  describe("with data", () => {
    beforeEach(() => entity = new TestEntity(ENTITY_ID, { 
      aNumber: '42', aString: 'bar', aBoolean: '1', anArray: 'foo|bar|baz',
      aliasedNumber: '23', aliasedString: 'baz', aliasedBoolean: '0', aliasedArray: 'bar|baz|qux',
    }));

    it("has the passed in Redis ID", () => expect(entity.entityId).toBe(ENTITY_ID));

    describe("reading the data", () => {
      it("returns a number for the number property", () => expect(entity.aNumber).toBe(42));
      it("returns a string for the string property", () => expect(entity.aString).toBe('bar'));
      it("returns a boolean for the boolean property", () => expect(entity.aBoolean).toBe(true));
      it("returns an array for the array property", () => expect(entity.anArray).toEqual([ 'foo', 'bar', 'baz' ]));
      it("returns a number for the aliased number property", () => expect(entity.anotherNumber).toBe(23));
      it("returns a string for the aliased string property", () => expect(entity.anotherString).toBe('baz'));
      it("returns a boolean for the aliased boolean property", () => expect(entity.anotherBoolean).toBe(false));
      it("returns an array for the aliased array property", () => expect(entity.anotherArray).toEqual([ 'bar', 'baz', 'qux' ]));
    });
  
    describe("changing the data", () => {
      it("stores a string when the number property is changed", () => {
        entity.aNumber = 23;
        expect(entity.entityData.aNumber).toBe('23');
      });

      it("stores a string when the string property is changed", () => {
        entity.aString = 'qux';
        expect(entity.entityData.aString).toBe('qux');
      });

      it("stores a string when the booelan property is changed", () => {
        entity.aBoolean = false;
        expect(entity.entityData.aBoolean).toBe('0');
      });

      it("stores a string when the array property is changed", () => {
        entity.anArray = [ 'bar', 'baz', 'qux' ];
        expect(entity.entityData.anArray).toBe('bar|baz|qux');
      });
    });
  
    describe("deleting the data", () => {
      it("removes nulled properties", () => {
        entity.aNumber = null;
        entity.aString = null;
        entity.aBoolean = null;
        expect(entity.entityData.aNumber).toBeUndefined();
        expect(entity.entityData.aString).toBeUndefined();
        expect(entity.entityData.aBoolean).toBeUndefined();
      });

      it("removes undefined properties", () => {
        entity.aNumber = undefined;
        entity.aString = undefined;
        entity.aBoolean = undefined;
        expect(entity.entityData.aNumber).toBeUndefined();
        expect(entity.entityData.aString).toBeUndefined();
        expect(entity.entityData.aBoolean).toBeUndefined();
      });
    });
  });
});
