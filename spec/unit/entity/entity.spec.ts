import { AliasedEntity, aliasedSchema, ANOTHER_TEST_DATE, A_TEST_DATE, A_TEST_DATE_ISO, SimpleEntity, simpleSchema } from '../helpers/test-entity-and-schema';

describe("Entity", () => {

  let entityId = 'foo';
  
  describe("without data", () => {

    let entity: SimpleEntity;

    beforeEach(() => entity = new SimpleEntity(simpleSchema.definition, entityId));
  
    it("has the passed in Redis ID", () => expect(entity.entityId).toBe(entityId));
    it("returns null for the number property", () => expect(entity.aNumber).toBeNull());
    it("returns null for the string property", () => expect(entity.aString).toBeNull());
    it("returns null for the boolean property", () => expect(entity.aBoolean).toBeNull());
    it("returns null for the geopoint property", () => expect(entity.aGeoPoint).toBeNull());
    it("returns null for the date property", () => expect(entity.aDate).toBeNull());
    it("returns null for the array property", () => expect(entity.anArray).toBeNull());
    it("serializes to the expected JSON", () => expect(JSON.stringify(entity))
      .toBe('{"entityId":"foo","aString":null,"aNumber":null,"aBoolean":null,"aGeoPoint":null,"aDate":null,"anArray":null}'));
  });

  describe("with data", () => {

    let entity: SimpleEntity;

    beforeEach(() => entity = new SimpleEntity(simpleSchema.definition, entityId,
      { aNumber: 42, aString: 'foo', aBoolean: false,
        aGeoPoint: { longitude: 12.34, latitude: 56.78 }, aDate: A_TEST_DATE,
        anArray: [ "foo", "bar", "baz"] }));

    it("has the passed in Redis ID", () => expect(entity.entityId).toBe(entityId));
    it("returns a number for the number property", () => expect(entity.aNumber).toBe(42));
    it("returns a string for the string property", () => expect(entity.aString).toBe('foo'));
    it("returns a boolean for the boolean property", () => expect(entity.aBoolean).toBe(false));
    it("returns a geopoint for the geopoint property", () => expect(entity.aGeoPoint).toEqual({ longitude: 12.34, latitude: 56.78 }));
    it("returns a date for the date property", () => expect(entity.aDate).toEqual(A_TEST_DATE));
    it("returns an array for the array property", () => expect(entity.anArray).toEqual([ 'foo', 'bar', 'baz' ]));
    it("serializes to the expected JSON", () => expect(JSON.stringify(entity))
      .toBe(`{"entityId":"foo","aString":"foo","aNumber":42,"aBoolean":false,"aGeoPoint":{"longitude":12.34,"latitude":56.78},"aDate":"${A_TEST_DATE_ISO}","anArray":["foo","bar","baz"]}`));

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

      it("stores a geopoint when the geopoint property is changed", () => {
        entity.aGeoPoint = { longitude: 23.45, latitude: 67.89 };
        expect(entity.entityData.aGeoPoint).toEqual({ longitude: 23.45, latitude: 67.89 });
      });

      it("stores a date when the date property is changed", () => {
        entity.aDate = ANOTHER_TEST_DATE;
        expect(entity.entityData.aDate).toEqual(ANOTHER_TEST_DATE);
      });

      it("stores an array when the array property is changed", () => {
        entity.anArray = [ 'bar', 'baz', 'qux' ];
        expect(entity.entityData.anArray).toEqual([ 'bar', 'baz', 'qux' ]);
      });
    });

    describe("changing to mismatched types", () => {
      it("complains when not a number", () => {
        // @ts-ignore: JavaScript
        expect(() => entity.aNumber = 'foo')
          .toThrow("Property 'aNumber' expected type of 'number' but received type of 'string'.");
        // @ts-ignore: JavaScript
        expect(() => entity.aNumber = true)
          .toThrow("Property 'aNumber' expected type of 'number' but received type of 'boolean'.");
        // @ts-ignore: JavaScript
        expect(() => entity.aNumber = { longitude: 12.34, latitude: 56.78 })
          .toThrow("Property 'aNumber' expected type of 'number' but received type of 'geopoint'.");
        // @ts-ignore: JavaScript
        expect(() => entity.aNumber = A_TEST_DATE)
          .toThrow("Property 'aNumber' expected type of 'number' but received type of 'date'.");
        // @ts-ignore: JavaScript
        expect(() => entity.aNumber = [ ' bar', 'baz', 'qux '])
          .toThrow("Property 'aNumber' expected type of 'number' but received type of 'array'.");
        });
      
      it("complains when not a string", () => {
        // @ts-ignore: JavaScript
        expect(() => entity.aString = true)
          .toThrow("Property 'aString' expected type of 'string' but received type of 'boolean'.");
        // @ts-ignore: JavaScript
        expect(() => entity.aString = 42)
          .toThrow("Property 'aString' expected type of 'string' but received type of 'number'.");
        // @ts-ignore: JavaScript
        expect(() => entity.aString = { longitude: 12.34, latitude: 56.78 })
          .toThrow("Property 'aString' expected type of 'string' but received type of 'geopoint'.");
        // @ts-ignore: JavaScript
        expect(() => entity.aString = A_TEST_DATE)
          .toThrow("Property 'aString' expected type of 'string' but received type of 'date'.");
        // @ts-ignore: JavaScript
        expect(() => entity.aString = [ ' bar', 'baz', 'qux '])
          .toThrow("Property 'aString' expected type of 'string' but received type of 'array'.");
      });

      it("complains when not a boolean", () => {
        // @ts-ignore: JavaScript
        expect(() => entity.aBoolean = 'foo')
          .toThrow("Property 'aBoolean' expected type of 'boolean' but received type of 'string'.")
        // @ts-ignore: JavaScript
        expect(() => entity.aBoolean = 42)
          .toThrow("Property 'aBoolean' expected type of 'boolean' but received type of 'number'.")
        // @ts-ignore: JavaScript
        expect(() => entity.aBoolean = { longitude: 12.34, latitude: 56.78 })
          .toThrow("Property 'aBoolean' expected type of 'boolean' but received type of 'geopoint'.");
        // @ts-ignore: JavaScript
        expect(() => entity.aBoolean = A_TEST_DATE)
          .toThrow("Property 'aBoolean' expected type of 'boolean' but received type of 'date'.");
        // @ts-ignore: JavaScript
        expect(() => entity.aBoolean = [ 'bar', 'baz', 'qux' ])
          .toThrow("Property 'aBoolean' expected type of 'boolean' but received type of 'array'.")
      });
      
      it("complains when not a geopoint", () => {
        // @ts-ignore: JavaScript
        expect(() => entity.aGeoPoint = 'foo')
          .toThrow("Property 'aGeoPoint' expected type of 'geopoint' but received type of 'string'.")
        // @ts-ignore: JavaScript
        expect(() => entity.aGeoPoint = 42)
          .toThrow("Property 'aGeoPoint' expected type of 'geopoint' but received type of 'number'.")
        // @ts-ignore: JavaScript
        expect(() => entity.aGeoPoint = true)
          .toThrow("Property 'aGeoPoint' expected type of 'geopoint' but received type of 'boolean'.")
        // @ts-ignore: JavaScript
        expect(() => entity.aGeoPoint = A_TEST_DATE)
          .toThrow("Property 'aGeoPoint' expected type of 'geopoint' but received type of 'date'.");
        // @ts-ignore: JavaScript
        expect(() => entity.aGeoPoint = [ 'bar', 'baz', 'qux' ])
          .toThrow("Property 'aGeoPoint' expected type of 'geopoint' but received type of 'array'.")
      });

      it("complains when not a date", () => {
        // @ts-ignore: JavaScript
        expect(() => entity.aDate = 'foo')
          .toThrow("Property 'aDate' expected type of 'date' but received type of 'string'.")
        // @ts-ignore: JavaScript
        expect(() => entity.aDate = 42)
          .toThrow("Property 'aDate' expected type of 'date' but received type of 'number'.")
        // @ts-ignore: JavaScript
        expect(() => entity.aDate = true)
          .toThrow("Property 'aDate' expected type of 'date' but received type of 'boolean'.")
        // @ts-ignore: JavaScript
        expect(() => entity.aDate = { longitude: 12.34, latitude: 56.78 })
          .toThrow("Property 'aDate' expected type of 'date' but received type of 'geopoint'.");
        // @ts-ignore: JavaScript
        expect(() => entity.aDate = [ 'bar', 'baz', 'qux' ])
          .toThrow("Property 'aDate' expected type of 'date' but received type of 'array'.")
      });

      it("complains when not an array", () => {
        // @ts-ignore: JavaScript
        expect(() => entity.anArray = 'foo')
          .toThrow("Property 'anArray' expected type of 'array' but received type of 'string'.")
        // @ts-ignore: JavaScript
        expect(() => entity.anArray = 42)
          .toThrow("Property 'anArray' expected type of 'array' but received type of 'number'.")
        // @ts-ignore: JavaScript
        expect(() => entity.anArray = true)
          .toThrow("Property 'anArray' expected type of 'array' but received type of 'boolean'.")
        // @ts-ignore: JavaScript
        expect(() => entity.anArray = { longitude: 12.34, latitude: 56.78 })
          .toThrow("Property 'anArray' expected type of 'array' but received type of 'geopoint'.");
        // @ts-ignore: JavaScript
        expect(() => entity.anArray = A_TEST_DATE)
          .toThrow("Property 'anArray' expected type of 'array' but received type of 'date'.");
      });

      it("converts non-string values in arrays to strings", () => {
        // @ts-ignore: JavaScript
        entity.anArray = [ 42, true, 23, false ];
        expect(entity.entityData.anArray).toEqual([ '42', 'true', '23', 'false' ])
      });
    });

    describe("deleting the data", () => {
      it("removes nulled properties", () => {
        entity.aNumber = null;
        entity.aString = null;
        entity.aBoolean = null;
        entity.aGeoPoint = null;
        entity.aDate = null;
        entity.anArray = null;
        expect(entity.entityData.aNumber).toBeUndefined();
        expect(entity.entityData.aString).toBeUndefined();
        expect(entity.entityData.aBoolean).toBeUndefined();
        expect(entity.entityData.aGeoPoint).toBeUndefined();
        expect(entity.entityData.aDate).toBeUndefined();
        expect(entity.entityData.anArray).toBeUndefined();
      });

      it("throws error when setting to undefined", () => {
        expect(() => entity.aNumber = undefined)
          .toThrow("Property 'aNumber' on entity of type 'SimpleEntity' cannot be set to undefined. Use null instead.");

        expect(() => entity.aString = undefined)
          .toThrow("Property 'aString' on entity of type 'SimpleEntity' cannot be set to undefined. Use null instead.");

        expect(() => entity.aBoolean = undefined)
          .toThrow("Property 'aBoolean' on entity of type 'SimpleEntity' cannot be set to undefined. Use null instead.");

        expect(() => entity.aGeoPoint = undefined)
          .toThrow("Property 'aGeoPoint' on entity of type 'SimpleEntity' cannot be set to undefined. Use null instead.");

        expect(() => entity.aDate = undefined)
          .toThrow("Property 'aDate' on entity of type 'SimpleEntity' cannot be set to undefined. Use null instead.");

        expect(() => entity.anArray = undefined)
          .toThrow("Property 'anArray' on entity of type 'SimpleEntity' cannot be set to undefined. Use null instead.");
      });
    });
  });

  describe("with aliased data", () => {

    let entity: AliasedEntity;

    beforeEach(() => entity = new AliasedEntity(aliasedSchema.definition, entityId,
      { anotherNumber: 23, anotherString: 'bar', anotherBoolean: true,
        anotherGeoPoint: { longitude: 23.45, latitude: 67.89 }, anotherDate: A_TEST_DATE,
        anotherArray: [ "bar", "baz", "qux" ] }));

    it("has the passed in Redis ID", () => expect(entity.entityId).toBe(entityId));
    it("returns a number for the number property", () => expect(entity.aNumber).toBe(23));
    it("returns a string for the string property", () => expect(entity.aString).toBe('bar'));
    it("returns a boolean for the boolean property", () => expect(entity.aBoolean).toBe(true));
    it("returns a geopoint for the geopoint property", () => expect(entity.aGeoPoint).toEqual({ longitude: 23.45, latitude: 67.89 }));
    it("returns a date for the date property", () => expect(entity.aDate).toEqual(A_TEST_DATE));
    it("returns an array for the array property", () => expect(entity.anArray).toEqual([ 'bar', 'baz', 'qux' ]));
    it("serializes to the expected JSON", () => expect(JSON.stringify(entity))
      .toBe(`{"entityId":"foo","aString":"bar","aNumber":23,"aBoolean":true,"aGeoPoint":{"longitude":23.45,"latitude":67.89},"aDate":"${A_TEST_DATE_ISO}","anArray":["bar","baz","qux"]}`));

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

      it("stores a geopoint when the geopoint property is changed", () => {
        entity.aGeoPoint = { longitude: 23.45, latitude: 67.89 };
        expect(entity.entityData.anotherGeoPoint).toEqual({ longitude: 23.45, latitude: 67.89 });
      });

      it("stores a date when the date property is changed", () => {
        entity.aDate = ANOTHER_TEST_DATE;
        expect(entity.entityData.anotherDate).toEqual(ANOTHER_TEST_DATE);
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
        entity.aGeoPoint = null;
        entity.aDate = null;
        entity.anArray = null;
        expect(entity.entityData.anotherNumber).toBeUndefined();
        expect(entity.entityData.anotherString).toBeUndefined();
        expect(entity.entityData.anotherBoolean).toBeUndefined();
        expect(entity.entityData.anotherGeoPoint).toBeUndefined();
        expect(entity.entityData.anotherDate).toBeUndefined();
        expect(entity.entityData.anotherArray).toBeUndefined();
      });
      
      it("errors when properties are set to undefined", () => {
        expect(() => entity.aNumber = undefined)
          .toThrow("Property 'aNumber' on entity of type 'AliasedEntity' cannot be set to undefined. Use null instead.");

        expect(() => entity.aString = undefined)
          .toThrow("Property 'aString' on entity of type 'AliasedEntity' cannot be set to undefined. Use null instead.");

        expect(() => entity.aBoolean = undefined)
          .toThrow("Property 'aBoolean' on entity of type 'AliasedEntity' cannot be set to undefined. Use null instead.");

        expect(() => entity.aGeoPoint = undefined)
          .toThrow("Property 'aGeoPoint' on entity of type 'AliasedEntity' cannot be set to undefined. Use null instead.");

        expect(() => entity.aDate = undefined)
          .toThrow("Property 'aDate' on entity of type 'AliasedEntity' cannot be set to undefined. Use null instead.");

        expect(() => entity.anArray = undefined)
          .toThrow("Property 'anArray' on entity of type 'AliasedEntity' cannot be set to undefined. Use null instead.");
      });
    });
  });
});
