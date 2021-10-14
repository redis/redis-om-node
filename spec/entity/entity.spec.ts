import { AliasedEntity, SimpleEntity } from '../helpers/test-entity-and-schema';

describe("Entity", () => {

  let entityId = 'foo';
  
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
      { aNumber: 42, aString: 'foo', aBoolean: false, anArray: [ "foo", "bar", "baz"] }));

    it("has the passed in Redis ID", () => expect(entity.entityId).toBe(entityId));
    it("returns a number for the number property", () => expect(entity.aNumber).toBe(42));
    it("returns a string for the string property", () => expect(entity.aString).toBe('foo'));
    it("returns a boolean for the boolean property", () => expect(entity.aBoolean).toBe(false));
    it("returns an array for the array property", () => expect(entity.anArray).toEqual([ 'foo', 'bar', 'baz' ]));

    describe("changing the data", () => {
      it("stores a number when the number property is changed", () => {
        entity.aNumber = 13;
        expect(entity.entityData.aNumber).toBe(13);
      });

      it("stores a string when the string property is changed", () => {
        entity.aString = 'bar';
        expect(entity.entityData.aString).toBe('bar');
      });

      it("stores a boolean when the booelan property is changed to true", () => {
        entity.aBoolean = true;
        expect(entity.entityData.aBoolean).toBe(true);
      });

      it("stores a boolean when the booelan property is changed to false", () => {
        entity.aBoolean = false;
        expect(entity.entityData.aBoolean).toBe(false);
      });

      it("stores an array when the array property is changed", () => {
        entity.anArray = [ 'bar', 'baz', 'qux' ];
        expect(entity.entityData.anArray).toEqual([ 'bar', 'baz', 'qux' ]);
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

      it("throws error when setting to undefined", () => {
        expect(() => entity.aNumber = undefined)
          .toThrow("Property 'aNumber' on entity of type 'SimpleEntity' cannot be set to undefined. Use null instead.");

        expect(() => entity.aString = undefined)
          .toThrow("Property 'aString' on entity of type 'SimpleEntity' cannot be set to undefined. Use null instead.");

        expect(() => entity.aBoolean = undefined)
          .toThrow("Property 'aBoolean' on entity of type 'SimpleEntity' cannot be set to undefined. Use null instead.");

        expect(() => entity.anArray = undefined)
          .toThrow("Property 'anArray' on entity of type 'SimpleEntity' cannot be set to undefined. Use null instead.");
      });
    });
  });

  describe("with aliased data", () => {

    let entity: AliasedEntity;

    beforeEach(() => entity = new AliasedEntity(entityId,
      { anotherNumber: 23, anotherString: 'bar', anotherBoolean: true, anotherArray: [ "bar", "baz", "qux" ] }));

    it("has the passed in Redis ID", () => expect(entity.entityId).toBe(entityId));
    it("returns a number for the number property", () => expect(entity.aNumber).toBe(23));
    it("returns a string for the string property", () => expect(entity.aString).toBe('bar'));
    it("returns a boolean for the boolean property", () => expect(entity.aBoolean).toBe(true));
    it("returns an array for the array property", () => expect(entity.anArray).toEqual([ 'bar', 'baz', 'qux' ]));

    describe("changing the data", () => {
      it("stores a number when the number property is changed", () => {
        entity.aNumber = 13;
        expect(entity.entityData.anotherNumber).toBe(13);
      });

      it("stores a string when the string property is changed", () => {
        entity.aString = 'baz';
        expect(entity.entityData.anotherString).toBe('baz');
      });

      it("stores a boolean when the booelan property is changed to true", () => {
        entity.aBoolean = true;
        expect(entity.entityData.anotherBoolean).toBe(true);
      });

      it("stores a boolean when the booelan property is changed to false", () => {
        entity.aBoolean = false;
        expect(entity.entityData.anotherBoolean).toBe(false);
      });

      it("stores an array when the array property is changed", () => {
        entity.anArray = [ 'baz', 'qux', 'quux' ];
        expect(entity.entityData.anotherArray).toEqual([ 'baz', 'qux', 'quux' ]);
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
      
      it("errors when properties are set to undefined", () => {
        expect(() => entity.aNumber = undefined)
          .toThrow("Property 'aNumber' on entity of type 'AliasedEntity' cannot be set to undefined. Use null instead.");

        expect(() => entity.aString = undefined)
          .toThrow("Property 'aString' on entity of type 'AliasedEntity' cannot be set to undefined. Use null instead.");

        expect(() => entity.aBoolean = undefined)
          .toThrow("Property 'aBoolean' on entity of type 'AliasedEntity' cannot be set to undefined. Use null instead.");

        expect(() => entity.anArray = undefined)
          .toThrow("Property 'anArray' on entity of type 'AliasedEntity' cannot be set to undefined. Use null instead.");
      });
    });
  });
});
