import { EntityId } from '../../lib/entity/entity-types';
import { AliasedEntity, SimpleEntity } from '../helpers/test-entity-and-schema';

describe("Entity", () => {

  let entityId: EntityId = 'foo';
  
  describe("without data", () => {

    let entity: SimpleEntity;

    beforeEach(() => entity = new SimpleEntity(entityId));
  
    it("has the passed in Redis ID", () => expect(entity.entityId).toBe(entityId));
    it("returns null for the number property", () => expect(entity.aNumber).toBeNull());
    it("returns null for the string property", () => expect(entity.aString).toBeNull());
    it("returns null for the boolean property", () => expect(entity.aBoolean).toBeNull());
    it("returns null for the array property", () => expect(entity.anArray).toBeNull());
  });

  describe("with data", () => {

    let entity: SimpleEntity;

    beforeEach(() => entity = new SimpleEntity(entityId,
      { aNumber: '42', aString: 'foo', aBoolean: '0', anArray: 'foo|bar|baz' }));

    it("has the passed in Redis ID", () => expect(entity.entityId).toBe(entityId));
    it("returns a number for the number property", () => expect(entity.aNumber).toBe(42));
    it("returns a string for the string property", () => expect(entity.aString).toBe('foo'));
    it("returns a boolean for the boolean property", () => expect(entity.aBoolean).toBe(false));
    it("returns an array for the array property", () => expect(entity.anArray).toEqual([ 'foo', 'bar', 'baz' ]));

    describe("changing the data", () => {
      it("stores a string when the number property is changed", () => {
        entity.aNumber = 13;
        expect(entity.entityData.aNumber).toBe('13');
      });

      it("stores a string when the string property is changed", () => {
        entity.aString = 'bar';
        expect(entity.entityData.aString).toBe('bar');
      });

      it("stores a string when the booelan property is changed to true", () => {
        entity.aBoolean = true;
        expect(entity.entityData.aBoolean).toBe('1');
      });

      it("stores a string when the booelan property is changed to false", () => {
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
        entity.anArray = null;
        expect(entity.entityData.aNumber).toBeUndefined();
        expect(entity.entityData.aString).toBeUndefined();
        expect(entity.entityData.aBoolean).toBeUndefined();
        expect(entity.entityData.anArray).toBeUndefined();
      });
      
      it("removes undefined properties", () => {
        entity.aNumber = undefined;
        entity.aString = undefined;
        entity.aBoolean = undefined;
        entity.anArray = undefined;
        expect(entity.entityData.aNumber).toBeUndefined();
        expect(entity.entityData.aString).toBeUndefined();
        expect(entity.entityData.aBoolean).toBeUndefined();
        expect(entity.entityData.anArray).toBeUndefined();
      });
    });
  });

  describe("with aliased data", () => {

    let entity: AliasedEntity;

    beforeEach(() => entity = new AliasedEntity(entityId,
      { anotherNumber: '23', anotherString: 'bar', anotherBoolean: '1', anotherArray: 'bar|baz|qux' }));

    it("has the passed in Redis ID", () => expect(entity.entityId).toBe(entityId));
    it("returns a number for the number property", () => expect(entity.aNumber).toBe(23));
    it("returns a string for the string property", () => expect(entity.aString).toBe('bar'));
    it("returns a boolean for the boolean property", () => expect(entity.aBoolean).toBe(true));
    it("returns an array for the array property", () => expect(entity.anArray).toEqual([ 'bar', 'baz', 'qux' ]));

    describe("changing the data", () => {
      it("stores a string when the number property is changed", () => {
        entity.aNumber = 13;
        expect(entity.entityData.anotherNumber).toBe('13');
      });

      it("stores a string when the string property is changed", () => {
        entity.aString = 'baz';
        expect(entity.entityData.anotherString).toBe('baz');
      });

      it("stores a string when the booelan property is changed to true", () => {
        entity.aBoolean = true;
        expect(entity.entityData.anotherBoolean).toBe('1');
      });

      it("stores a string when the booelan property is changed to false", () => {
        entity.aBoolean = false;
        expect(entity.entityData.anotherBoolean).toBe('0');
      });

      it("stores a string when the array property is changed", () => {
        entity.anArray = [ 'baz', 'qux', 'quux' ];
        expect(entity.entityData.anotherArray).toBe('baz|qux|quux');
      });
    });
  
    describe("deleting the data", () => {
      it("removes nulled properties", () => {
        entity.aNumber = null;
        entity.aString = null;
        entity.aBoolean = null;
        entity.anArray = null;
        expect(entity.entityData.anotherNumber).toBeUndefined();
        expect(entity.entityData.anotherString).toBeUndefined();
        expect(entity.entityData.anotherBoolean).toBeUndefined();
        expect(entity.entityData.anotherArray).toBeUndefined();
      });
      
      it("removes undefined properties", () => {
        entity.aNumber = undefined;
        entity.aString = undefined;
        entity.aBoolean = undefined;
        entity.anArray = undefined;
        expect(entity.entityData.anotherNumber).toBeUndefined();
        expect(entity.entityData.anotherString).toBeUndefined();
        expect(entity.entityData.anotherBoolean).toBeUndefined();
        expect(entity.entityData.anotherArray).toBeUndefined();
      });
    });
  });
});
