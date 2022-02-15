import { 
  A_DATE, A_DATE_ISO,
  ANOTHER_DATE, ANOTHER_DATE_EPOCH, ANOTHER_DATE_ISO, 
  A_THIRD_DATE, A_THIRD_DATE_EPOCH, A_THIRD_DATE_ISO,
  A_POINT, A_POINT_JSON,
  ANOTHER_POINT, ANOTHER_POINT_JSON,
  A_THIRD_POINT,
  A_STRING_ARRAY, A_STRING_ARRAY_JSON,
  ANOTHER_STRING_ARRAY, ANOTHER_STRING_ARRAY_JSON,
  A_THIRD_STRING_ARRAY } from '../../helpers/example-data';

import { AliasedEntity, aliasedSchema, SimpleEntity, simpleSchema } from '../helpers/test-entity-and-schema';

const ENTITY_ID = 'foo';
const EXPECTED_JSON = `{"entityId":"${ENTITY_ID}","aString":"foo","aNumber":42,"aBoolean":false,"aPoint":${A_POINT_JSON},"aDate":"${A_DATE_ISO}","someStrings":${A_STRING_ARRAY_JSON}}`;
const EXPECTED_NULL_JSON = `{"entityId":"${ENTITY_ID}","aString":null,"aNumber":null,"aBoolean":null,"aPoint":null,"aDate":null,"someStrings":null}`;
const EXPECTED_ALIASED_JSON = `{"entityId":"${ENTITY_ID}","aString":"bar","aNumber":23,"aBoolean":true,"aPoint":${ANOTHER_POINT_JSON},"aDate":"${ANOTHER_DATE_ISO}","someStrings":${ANOTHER_STRING_ARRAY_JSON}}`;

let entity: SimpleEntity;

describe("Entity", () => {
  describe("without data", () => {
    beforeEach(() => entity = new SimpleEntity(simpleSchema.definition, ENTITY_ID));

    it("has the passed in Redis ID", () => expect(entity.entityId).toBe(ENTITY_ID));
    it("returns null for the number property", () => expect(entity.aNumber).toBeNull());
    it("returns null for the string property", () => expect(entity.aString).toBeNull());
    it("returns null for the boolean property", () => expect(entity.aBoolean).toBeNull());
    it("returns null for the point property", () => expect(entity.aPoint).toBeNull());
    it("returns null for the date property", () => expect(entity.aDate).toBeNull());
    it("returns null for the string[] property", () => expect(entity.someStrings).toBeNull());
    it("serializes to the expected JSON", () => expect(JSON.stringify(entity)).toBe(EXPECTED_NULL_JSON));
  });

  describe("with data", () => {
    beforeEach(() => entity = new SimpleEntity(simpleSchema.definition, ENTITY_ID, {
      aNumber: 42, aString: 'foo', aBoolean: false, aPoint: A_POINT, aDate: A_DATE, someStrings: A_STRING_ARRAY }));

    it("has the passed in Redis ID", () => expect(entity.entityId).toBe(ENTITY_ID));
    it("returns a number for the number property", () => expect(entity.aNumber).toBe(42));
    it("returns a string for the string property", () => expect(entity.aString).toBe('foo'));
    it("returns a boolean for the boolean property", () => expect(entity.aBoolean).toBe(false));
    it("returns a point for the point property", () => expect(entity.aPoint).toEqual(A_POINT));
    it("returns a date for the date property", () => expect(entity.aDate).toEqual(A_DATE));
    it("returns a string[] for the string[] property", () => expect(entity.someStrings).toEqual(A_STRING_ARRAY));
    it("serializes to the expected JSON", () => expect(JSON.stringify(entity)).toBe(EXPECTED_JSON));

    describe("changing the data", () => {
      it("stores a number when the number property is changed", () => {
        entity.aNumber = 13;
        expect(entity.entityData.aNumber).toBe(13);
      });

      it("stores a string when the string property is changed", () => {
        entity.aString = 'bar';
        expect(entity.entityData.aString).toBe('bar');
      });

      it("stores a string when the string property is changed to a number", () => {
        entity.aString = 23;
        expect(entity.entityData.aString).toBe('23');
      });

      it("stores a string when the string property is changed to a boolean", () => {
        entity.aString = false;
        expect(entity.entityData.aString).toBe('false');
      });

      it("stores a boolean when the boolaan property is changed to true", () => {
        entity.aBoolean = true;
        expect(entity.entityData.aBoolean).toBe(true);
      });

      it("stores a boolean when the booelan property is changed to false", () => {
        entity.aBoolean = false;
        expect(entity.entityData.aBoolean).toBe(false);
      });

      it("stores a point when the point property is changed", () => {
        entity.aPoint = ANOTHER_POINT;
        expect(entity.entityData.aPoint).toEqual(ANOTHER_POINT);
      });

      it("stores a date when the date property is changed", () => {
        entity.aDate = ANOTHER_DATE;
        expect(entity.entityData.aDate).toEqual(ANOTHER_DATE);
      });

      it("stores a date when the date property is changed to a UNIX epoch", () => {
        entity.aDate = ANOTHER_DATE_EPOCH;
        expect(entity.entityData.aDate).toEqual(ANOTHER_DATE);
      });

      it("stores a date when the date property is changed to a ISO date", () => {
        entity.aDate = ANOTHER_DATE_ISO;
        expect(entity.entityData.aDate).toEqual(ANOTHER_DATE);
      });

      it("stores a string[] when the string[] property is changed", () => {
        entity.someStrings = ANOTHER_STRING_ARRAY;
        expect(entity.entityData.someStrings).toEqual(ANOTHER_STRING_ARRAY);
      });

      it("stores a string[] when the string[] property is changed to an any[]", () => {
        entity.someStrings = [ 42, true, 23, false ];
        expect(entity.entityData.someStrings).toEqual([ '42', 'true', '23', 'false' ])
      });
    });

    describe("changing to mismatched types", () => {
      it("complains when not a number", () => {
        // @ts-ignore: JavaScript
        expect(() => entity.aNumber = 'foo')
          .toThrow(`Property 'aNumber' expected type of 'number' but received value of 'foo'.`);
        // @ts-ignore: JavaScript
        expect(() => entity.aNumber = true)
          .toThrow(`Property 'aNumber' expected type of 'number' but received value of 'true'.`);
        // @ts-ignore: JavaScript
        expect(() => entity.aNumber = A_POINT)
          .toThrow(`Property 'aNumber' expected type of 'number' but received value of '${A_POINT}'.`);
        // @ts-ignore: JavaScript
        expect(() => entity.aNumber = A_DATE)
          .toThrow(`Property 'aNumber' expected type of 'number' but received value of '${A_DATE}'.`);
        // @ts-ignore: JavaScript
        expect(() => entity.aNumber = A_STRING_ARRAY)
          .toThrow(`Property 'aNumber' expected type of 'number' but received value of '${A_STRING_ARRAY}'.`);
        });
      
      it("complains when not a string", () => {
        // @ts-ignore: JavaScript
        expect(() => entity.aString = A_POINT)
          .toThrow(`Property 'aString' expected type of 'string' but received value of '${A_POINT}'.`);
        // @ts-ignore: JavaScript
        expect(() => entity.aString = A_DATE)
          .toThrow(`Property 'aString' expected type of 'string' but received value of '${A_DATE}'.`);
        // @ts-ignore: JavaScript
        expect(() => entity.aString = A_STRING_ARRAY)
          .toThrow(`Property 'aString' expected type of 'string' but received value of '${A_STRING_ARRAY}'.`);
      });

      it("complains when not a boolean", () => {
        // @ts-ignore: JavaScript
        expect(() => entity.aBoolean = 'foo')
          .toThrow(`Property 'aBoolean' expected type of 'boolean' but received value of 'foo'`)
        // @ts-ignore: JavaScript
        expect(() => entity.aBoolean = 42)
          .toThrow(`Property 'aBoolean' expected type of 'boolean' but received value of '42'`)
        // @ts-ignore: JavaScript
        expect(() => entity.aBoolean = A_POINT)
          .toThrow(`Property 'aBoolean' expected type of 'boolean' but received value of '${A_POINT}'.`);
        // @ts-ignore: JavaScript
        expect(() => entity.aBoolean = A_DATE)
          .toThrow(`Property 'aBoolean' expected type of 'boolean' but received value of '${A_DATE}'.`);
        // @ts-ignore: JavaScript
        expect(() => entity.aBoolean = A_STRING_ARRAY)
          .toThrow(`Property 'aBoolean' expected type of 'boolean' but received value of '${A_STRING_ARRAY}'`)
      });
      
      it("complains when not a point", () => {
        // @ts-ignore: JavaScript
        expect(() => entity.aPoint = 'foo')
          .toThrow(`Property 'aPoint' expected type of 'point' but received value of 'foo'`)
        // @ts-ignore: JavaScript
        expect(() => entity.aPoint = 42)
          .toThrow(`Property 'aPoint' expected type of 'point' but received value of '42'`)
        // @ts-ignore: JavaScript
        expect(() => entity.aPoint = true)
          .toThrow(`Property 'aPoint' expected type of 'point' but received value of 'true'`)
        // @ts-ignore: JavaScript
        expect(() => entity.aPoint = A_DATE)
          .toThrow(`Property 'aPoint' expected type of 'point' but received value of '${A_DATE}'.`);
        // @ts-ignore: JavaScript
        expect(() => entity.aPoint = A_STRING_ARRAY)
          .toThrow(`Property 'aPoint' expected type of 'point' but received value of '${A_STRING_ARRAY}'`)
      });

      it("complains when not a date", () => {
        // @ts-ignore: JavaScript
        expect(() => entity.aDate = true)
          .toThrow(`Property 'aDate' expected type of 'date' but received value of 'true'`)
        // @ts-ignore: JavaScript
        expect(() => entity.aDate = A_POINT)
          .toThrow(`Property 'aDate' expected type of 'date' but received value of '${A_POINT}'.`);
        // @ts-ignore: JavaScript
        expect(() => entity.aDate = A_STRING_ARRAY)
          .toThrow(`Property 'aDate' expected type of 'date' but received value of '${A_STRING_ARRAY}'.`)
      });

      it("complains when not an array", () => {
        // @ts-ignore: JavaScript
        expect(() => entity.someStrings = 'foo')
          .toThrow(`Property 'someStrings' expected type of 'string[]' but received value of 'foo'`)
        // @ts-ignore: JavaScript
        expect(() => entity.someStrings = 42)
          .toThrow(`Property 'someStrings' expected type of 'string[]' but received value of '42'`)
        // @ts-ignore: JavaScript
        expect(() => entity.someStrings = true)
          .toThrow(`Property 'someStrings' expected type of 'string[]' but received value of 'true'`)
        // @ts-ignore: JavaScript
        expect(() => entity.someStrings = A_POINT)
          .toThrow(`Property 'someStrings' expected type of 'string[]' but received value of '${A_POINT}'.`);
        // @ts-ignore: JavaScript
        expect(() => entity.someStrings = A_DATE)
          .toThrow(`Property 'someStrings' expected type of 'string[]' but received value of '${A_DATE}'.`);
      });
    });

    describe("deleting the data", () => {
      it("removes nulled properties", () => {
        entity.aNumber = null;
        entity.aString = null;
        entity.aBoolean = null;
        entity.aPoint = null;
        entity.aDate = null;
        entity.someStrings = null;
        expect(entity.entityData.aNumber).toBeUndefined();
        expect(entity.entityData.aString).toBeUndefined();
        expect(entity.entityData.aBoolean).toBeUndefined();
        expect(entity.entityData.aPoint).toBeUndefined();
        expect(entity.entityData.aDate).toBeUndefined();
        expect(entity.entityData.someStrings).toBeUndefined();
      });

      it("throws error when setting to undefined", () => {
        expect(() => entity.aNumber = undefined)
          .toThrow(`Property 'aNumber' on entity of type 'SimpleEntity' cannot be set to undefined. Use null instead.`);

        expect(() => entity.aString = undefined)
          .toThrow(`Property 'aString' on entity of type 'SimpleEntity' cannot be set to undefined. Use null instead.`);

        expect(() => entity.aBoolean = undefined)
          .toThrow(`Property 'aBoolean' on entity of type 'SimpleEntity' cannot be set to undefined. Use null instead.`);

        expect(() => entity.aPoint = undefined)
          .toThrow(`Property 'aPoint' on entity of type 'SimpleEntity' cannot be set to undefined. Use null instead.`);

        expect(() => entity.aDate = undefined)
          .toThrow(`Property 'aDate' on entity of type 'SimpleEntity' cannot be set to undefined. Use null instead.`);

        expect(() => entity.someStrings = undefined)
          .toThrow(`Property 'someStrings' on entity of type 'SimpleEntity' cannot be set to undefined. Use null instead.`);
      });
    });
  });

  describe("with aliased data", () => {
    beforeEach(() => entity = new AliasedEntity(aliasedSchema.definition, ENTITY_ID, {
      anotherNumber: 23, anotherString: 'bar', anotherBoolean: true,
      anotherPoint: ANOTHER_POINT, anotherDate: ANOTHER_DATE, someOtherStrings: ANOTHER_STRING_ARRAY }));

    it("has the passed in Redis ID", () => expect(entity.entityId).toBe(ENTITY_ID));
    it("returns a number for the number property", () => expect(entity.aNumber).toBe(23));
    it("returns a string for the string property", () => expect(entity.aString).toBe('bar'));
    it("returns a boolean for the boolean property", () => expect(entity.aBoolean).toBe(true));
    it("returns a point for the point property", () => expect(entity.aPoint).toEqual(ANOTHER_POINT));
    it("returns a date for the date property", () => expect(entity.aDate).toEqual(ANOTHER_DATE));
    it("returns a string[] for the string[] property", () => expect(entity.someStrings).toEqual(ANOTHER_STRING_ARRAY));
    it("serializes to the expected JSON", () => expect(JSON.stringify(entity)).toBe(EXPECTED_ALIASED_JSON));

    describe("changing the data", () => {
      it("stores a number when the number property is changed", () => {
        entity.aNumber = 13;
        expect(entity.entityData.anotherNumber).toBe(13);
      });

      it("stores a string when the string property is changed", () => {
        entity.aString = 'baz';
        expect(entity.entityData.anotherString).toBe('baz');
      });

      it("stores a string when the string property is changed to a number", () => {
        entity.aString = 13;
        expect(entity.entityData.anotherString).toBe('13');
      });

      it("stores a string when the string property is changed to a boolean", () => {
        entity.aString = true;
        expect(entity.entityData.anotherString).toBe('true');
      });

      it("stores a boolean when the booelan property is changed to true", () => {
        entity.aBoolean = true;
        expect(entity.entityData.anotherBoolean).toBe(true);
      });

      it("stores a boolean when the booelan property is changed to false", () => {
        entity.aBoolean = false;
        expect(entity.entityData.anotherBoolean).toBe(false);
      });

      it("stores a point when the point property is changed", () => {
        entity.aPoint = A_THIRD_POINT;
        expect(entity.entityData.anotherPoint).toEqual(A_THIRD_POINT);
      });

      it("stores a date when the date property is changed", () => {
        entity.aDate = A_THIRD_DATE;
        expect(entity.entityData.anotherDate).toEqual(A_THIRD_DATE);
      });

      it("stores a date when the date property is changed to a UNIX epoch", () => {
        entity.aDate = A_THIRD_DATE_EPOCH;
        expect(entity.entityData.anotherDate).toEqual(A_THIRD_DATE);
      });

      it("stores a date when the date property is changed to a ISO date", () => {
        entity.aDate = A_THIRD_DATE_ISO;
        expect(entity.entityData.anotherDate).toEqual(A_THIRD_DATE);
      });

      it("stores a string[] when the string[] property is changed", () => {
        entity.someStrings = A_THIRD_STRING_ARRAY;
        expect(entity.entityData.someOtherStrings).toEqual(A_THIRD_STRING_ARRAY);
      });

      it("stores a string[] when the string[] property is changed to an any[]", () => {
        entity.someStrings = [ 42, true, 23, false ];
        expect(entity.entityData.someOtherStrings).toEqual([ '42', 'true', '23', 'false' ])
      });
    });
  
    describe("deleting the data", () => {
      it("removes nulled properties", () => {
        entity.aNumber = null;
        entity.aString = null;
        entity.aBoolean = null;
        entity.aPoint = null;
        entity.aDate = null;
        entity.someStrings = null;
        expect(entity.entityData.anotherNumber).toBeUndefined();
        expect(entity.entityData.anotherString).toBeUndefined();
        expect(entity.entityData.anotherBoolean).toBeUndefined();
        expect(entity.entityData.anotherPoint).toBeUndefined();
        expect(entity.entityData.anotherDate).toBeUndefined();
        expect(entity.entityData.someOtherStrings).toBeUndefined();
      });
      
      it("errors when properties are set to undefined", () => {
        expect(() => entity.aNumber = undefined)
          .toThrow(`Property 'aNumber' on entity of type 'AliasedEntity' cannot be set to undefined. Use null instead.`);

        expect(() => entity.aString = undefined)
          .toThrow(`Property 'aString' on entity of type 'AliasedEntity' cannot be set to undefined. Use null instead.`);

        expect(() => entity.aBoolean = undefined)
          .toThrow(`Property 'aBoolean' on entity of type 'AliasedEntity' cannot be set to undefined. Use null instead.`);

        expect(() => entity.aPoint = undefined)
          .toThrow(`Property 'aPoint' on entity of type 'AliasedEntity' cannot be set to undefined. Use null instead.`);

        expect(() => entity.aDate = undefined)
          .toThrow("Property 'aDate' on entity of type 'AliasedEntity' cannot be set to undefined. Use null instead.");

        expect(() => entity.someStrings = undefined)
          .toThrow("Property 'someStrings' on entity of type 'AliasedEntity' cannot be set to undefined. Use null instead.");
      });
    });
  });
});
