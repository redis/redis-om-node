import { 
  A_STRING, ANOTHER_STRING, A_THIRD_STRING,
  A_NUMBER, ANOTHER_NUMBER, ANOTHER_NUMBER_STRING, A_THIRD_NUMBER, A_THIRD_NUMBER_STRING,
  A_DATE, A_DATE_ISO, ANOTHER_DATE, ANOTHER_DATE_EPOCH, ANOTHER_DATE_ISO, 
  A_THIRD_DATE, A_THIRD_DATE_EPOCH, A_THIRD_DATE_ISO,
  A_POINT, A_POINT_JSON, ANOTHER_POINT, ANOTHER_POINT_JSON, A_THIRD_POINT,
  SOME_STRINGS, SOME_STRINGS_JSON, SOME_OTHER_STRINGS, SOME_OTHER_STRINGS_JSON, SOME_MORE_STRINGS,
  SOME_TEXT, SOME_OTHER_TEXT, SOME_MORE_TEXT  } from '../../helpers/example-data';

import { AliasedEntity, aliasedSchema, SimpleEntity, simpleSchema } from '../helpers/test-entity-and-schema';

const ENTITY_ID = 'foo';
const EXPECTED_JSON = `{"entityId":"${ENTITY_ID}","aString":"${A_STRING}","someText":"${SOME_TEXT}","aNumber":${A_NUMBER},"aBoolean":false,"aPoint":${A_POINT_JSON},"aDate":"${A_DATE_ISO}","someStrings":${SOME_STRINGS_JSON}}`;
const EXPECTED_NULL_JSON = `{"entityId":"${ENTITY_ID}","aString":null,"someText":null,"aNumber":null,"aBoolean":null,"aPoint":null,"aDate":null,"someStrings":null}`;
const EXPECTED_ALIASED_JSON = `{"entityId":"${ENTITY_ID}","aString":"${ANOTHER_STRING}","someText":"${SOME_OTHER_TEXT}","aNumber":${ANOTHER_NUMBER},"aBoolean":true,"aPoint":${ANOTHER_POINT_JSON},"aDate":"${ANOTHER_DATE_ISO}","someStrings":${SOME_OTHER_STRINGS_JSON}}`;

let entity: SimpleEntity;

describe("Entity", () => {
  describe("without data", () => {
    beforeEach(() => entity = new SimpleEntity(simpleSchema, ENTITY_ID));

    it("has the passed in Redis ID", () => expect(entity.entityId).toBe(ENTITY_ID));
    it("returns null for the number property", () => expect(entity.aNumber).toBeNull());
    it("returns null for the string property", () => expect(entity.aString).toBeNull());
    it("returns null for the boolean property", () => expect(entity.aBoolean).toBeNull());
    it("returns null for the text property", () => expect(entity.someText).toBeNull());
    it("returns null for the point property", () => expect(entity.aPoint).toBeNull());
    it("returns null for the date property", () => expect(entity.aDate).toBeNull());
    it("returns null for the string[] property", () => expect(entity.someStrings).toBeNull());
    it("returns the expected key name", () => expect(entity.keyName).toBe(`SimpleEntity:${ENTITY_ID}`));
    it("serializes to the expected JSON", () => expect(JSON.stringify(entity)).toBe(EXPECTED_NULL_JSON));
  });

  describe("with data", () => {
    beforeEach(() => entity = new SimpleEntity(simpleSchema, ENTITY_ID, {
      aNumber: A_NUMBER, aString: A_STRING, aBoolean: false, someText: SOME_TEXT, aPoint: A_POINT, aDate: A_DATE, someStrings: SOME_STRINGS }));

    it("has the passed in Redis ID", () => expect(entity.entityId).toBe(ENTITY_ID));
    it("returns a number for the number property", () => expect(entity.aNumber).toBe(A_NUMBER));
    it("returns a string for the string property", () => expect(entity.aString).toBe(A_STRING));
    it("returns a boolean for the boolean property", () => expect(entity.aBoolean).toBe(false));
    it("returns a string for the text property", () => expect(entity.someText).toBe(SOME_TEXT));
    it("returns a point for the point property", () => expect(entity.aPoint).toEqual(A_POINT));
    it("returns a date for the date property", () => expect(entity.aDate).toEqual(A_DATE));
    it("returns a string[] for the string[] property", () => expect(entity.someStrings).toEqual(SOME_STRINGS));
    it("returns the expected key name", () => expect(entity.keyName).toBe(`SimpleEntity:${ENTITY_ID}`));
    it("serializes to the expected JSON", () => expect(JSON.stringify(entity)).toBe(EXPECTED_JSON));

    describe("changing the data", () => {
      it("stores a number when the number property is changed", () => {
        entity.aNumber = ANOTHER_NUMBER;
        expect(entity.entityData.aNumber).toBe(ANOTHER_NUMBER);
      });

      it("stores a string when the string property is changed", () => {
        entity.aString = ANOTHER_STRING;
        expect(entity.entityData.aString).toBe(ANOTHER_STRING);
      });

      it("stores a string when the string property is changed to a number", () => {
        entity.aString = ANOTHER_NUMBER;
        expect(entity.entityData.aString).toBe(ANOTHER_NUMBER_STRING);
      });

      it("stores a string when the string property is changed to a boolean", () => {
        entity.aString = false;
        expect(entity.entityData.aString).toBe('false');
      });

      it("stores a boolean when the boolean property is changed to true", () => {
        entity.aBoolean = true;
        expect(entity.entityData.aBoolean).toBe(true);
      });

      it("stores a boolean when the booelan property is changed to false", () => {
        entity.aBoolean = false;
        expect(entity.entityData.aBoolean).toBe(false);
      });

      it("stores a string when the text property is changed to a string", () => {
        entity.someText = SOME_OTHER_TEXT;
        expect(entity.entityData.someText).toBe(SOME_OTHER_TEXT);
      });

      it("stores a string when the text property is changed to a number", () => {
        entity.someText = ANOTHER_NUMBER;
        expect(entity.entityData.someText).toBe(ANOTHER_NUMBER_STRING);
      });

      it("stores a string when the text property is changed to a boolean", () => {
        entity.someText = false;
        expect(entity.entityData.someText).toBe('false');
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
        entity.someStrings = SOME_OTHER_STRINGS;
        expect(entity.entityData.someStrings).toEqual(SOME_OTHER_STRINGS);
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
          .toThrow(`Expected value with type of 'number' but received 'foo'.`);
        // @ts-ignore: JavaScript
        expect(() => entity.aNumber = true)
          .toThrow(`Expected value with type of 'number' but received 'true'.`);
        // @ts-ignore: JavaScript
        expect(() => entity.aNumber = A_POINT)
          .toThrow(`Expected value with type of 'number' but received '${A_POINT}'.`);
        // @ts-ignore: JavaScript
        expect(() => entity.aNumber = A_DATE)
          .toThrow(`Expected value with type of 'number' but received '${A_DATE}'.`);
        // @ts-ignore: JavaScript
        expect(() => entity.aNumber = SOME_STRINGS)
          .toThrow(`Expected value with type of 'number' but received '${SOME_STRINGS}'.`);
        });
      
      it("complains when not a string", () => {
        // @ts-ignore: JavaScript
        expect(() => entity.aString = A_POINT)
          .toThrow(`Expected value with type of 'string' but received '${A_POINT}'.`);
        // @ts-ignore: JavaScript
        expect(() => entity.aString = A_DATE)
          .toThrow(`Expected value with type of 'string' but received '${A_DATE}'.`);
        // @ts-ignore: JavaScript
        expect(() => entity.aString = SOME_STRINGS)
          .toThrow(`Expected value with type of 'string' but received '${SOME_STRINGS}'.`);
      });

      it("complains when not a boolean", () => {
        // @ts-ignore: JavaScript
        expect(() => entity.aBoolean = 'foo')
          .toThrow(`Expected value with type of 'boolean' but received 'foo'`)
        // @ts-ignore: JavaScript
        expect(() => entity.aBoolean = 42)
          .toThrow(`Expected value with type of 'boolean' but received '42'`)
        // @ts-ignore: JavaScript
        expect(() => entity.aBoolean = A_POINT)
          .toThrow(`Expected value with type of 'boolean' but received '${A_POINT}'.`);
        // @ts-ignore: JavaScript
        expect(() => entity.aBoolean = A_DATE)
          .toThrow(`Expected value with type of 'boolean' but received '${A_DATE}'.`);
        // @ts-ignore: JavaScript
        expect(() => entity.aBoolean = SOME_STRINGS)
          .toThrow(`Expected value with type of 'boolean' but received '${SOME_STRINGS}'`)
      });

      it("complains when not a text", () => {
        // @ts-ignore: JavaScript
        expect(() => entity.someText = A_POINT)
          .toThrow(`Expected value with type of 'text' but received '${A_POINT}'.`);
        // @ts-ignore: JavaScript
        expect(() => entity.someText = A_DATE)
          .toThrow(`Expected value with type of 'text' but received '${A_DATE}'.`);
        // @ts-ignore: JavaScript
        expect(() => entity.someText = SOME_STRINGS)
          .toThrow(`Expected value with type of 'text' but received '${SOME_STRINGS}'.`);
      });

      it("complains when not a point", () => {
        // @ts-ignore: JavaScript
        expect(() => entity.aPoint = 'foo')
          .toThrow(`Expected value with type of 'point' but received 'foo'`)
        // @ts-ignore: JavaScript
        expect(() => entity.aPoint = 42)
          .toThrow(`Expected value with type of 'point' but received '42'`)
        // @ts-ignore: JavaScript
        expect(() => entity.aPoint = true)
          .toThrow(`Expected value with type of 'point' but received 'true'`)
        // @ts-ignore: JavaScript
        expect(() => entity.aPoint = A_DATE)
          .toThrow(`Expected value with type of 'point' but received '${A_DATE}'.`);
        // @ts-ignore: JavaScript
        expect(() => entity.aPoint = SOME_STRINGS)
          .toThrow(`Expected value with type of 'point' but received '${SOME_STRINGS}'`)
      });

      it("complains when not a date", () => {
        // @ts-ignore: JavaScript
        expect(() => entity.aDate = true)
          .toThrow(`Expected value with type of 'date' but received 'true'`)
        // @ts-ignore: JavaScript
        expect(() => entity.aDate = A_POINT)
          .toThrow(`Expected value with type of 'date' but received '${A_POINT}'.`);
        // @ts-ignore: JavaScript
        expect(() => entity.aDate = SOME_STRINGS)
          .toThrow(`Expected value with type of 'date' but received '${SOME_STRINGS}'.`)
      });

      it("complains when not an array", () => {
        // @ts-ignore: JavaScript
        expect(() => entity.someStrings = 'foo')
          .toThrow(`Expected value with type of 'string[]' but received 'foo'`)
        // @ts-ignore: JavaScript
        expect(() => entity.someStrings = 42)
          .toThrow(`Expected value with type of 'string[]' but received '42'`)
        // @ts-ignore: JavaScript
        expect(() => entity.someStrings = true)
          .toThrow(`Expected value with type of 'string[]' but received 'true'`)
        // @ts-ignore: JavaScript
        expect(() => entity.someStrings = A_POINT)
          .toThrow(`Expected value with type of 'string[]' but received '${A_POINT}'.`);
        // @ts-ignore: JavaScript
        expect(() => entity.someStrings = A_DATE)
          .toThrow(`Expected value with type of 'string[]' but received '${A_DATE}'.`);
      });
    });

    describe("deleting the data", () => {
      it("removes nulled properties", () => {
        entity.aNumber = null;
        entity.aString = null;
        entity.someText = null;
        entity.aBoolean = null;
        entity.aPoint = null;
        entity.aDate = null;
        entity.someStrings = null;
        expect(entity.entityData.aNumber).toBeUndefined();
        expect(entity.entityData.aString).toBeUndefined();
        expect(entity.entityData.aBoolean).toBeUndefined();
        expect(entity.entityData.someText).toBeUndefined();
        expect(entity.entityData.aPoint).toBeUndefined();
        expect(entity.entityData.aDate).toBeUndefined();
        expect(entity.entityData.someStrings).toBeUndefined();
      });

      it("throws error when setting to undefined", () => {
        expect(() => entity.aNumber = undefined)
          .toThrow(`Property cannot be set to undefined. Use null instead.`);

        expect(() => entity.aString = undefined)
          .toThrow(`Property cannot be set to undefined. Use null instead.`);

        expect(() => entity.someText = undefined)
          .toThrow(`Property cannot be set to undefined. Use null instead.`);

        expect(() => entity.aBoolean = undefined)
          .toThrow(`Property cannot be set to undefined. Use null instead.`);

        expect(() => entity.aPoint = undefined)
          .toThrow(`Property cannot be set to undefined. Use null instead.`);

        expect(() => entity.aDate = undefined)
          .toThrow(`Property cannot be set to undefined. Use null instead.`);

        expect(() => entity.someStrings = undefined)
          .toThrow(`Property cannot be set to undefined. Use null instead.`);
      });
    });
  });

  describe("with aliased data", () => {
    beforeEach(() => entity = new AliasedEntity(aliasedSchema, ENTITY_ID, {
      anotherNumber: ANOTHER_NUMBER, anotherString: ANOTHER_STRING,
      anotherBoolean: true, someOtherText: SOME_OTHER_TEXT,
      anotherPoint: ANOTHER_POINT, anotherDate: ANOTHER_DATE, someOtherStrings: SOME_OTHER_STRINGS }));

    it("has the passed in Redis ID", () => expect(entity.entityId).toBe(ENTITY_ID));
    it("returns a number for the number property", () => expect(entity.aNumber).toBe(ANOTHER_NUMBER));
    it("returns a string for the string property", () => expect(entity.aString).toBe(ANOTHER_STRING));
    it("returns a boolean for the boolean property", () => expect(entity.aBoolean).toBe(true));
    it("returns a string for the text property", () => expect(entity.someText).toBe(SOME_OTHER_TEXT));
    it("returns a point for the point property", () => expect(entity.aPoint).toEqual(ANOTHER_POINT));
    it("returns a date for the date property", () => expect(entity.aDate).toEqual(ANOTHER_DATE));
    it("returns a string[] for the string[] property", () => expect(entity.someStrings).toEqual(SOME_OTHER_STRINGS));
    it("returns the expected key name", () => expect(entity.keyName).toBe(`AliasedEntity:${ENTITY_ID}`));
    it("serializes to the expected JSON", () => expect(JSON.stringify(entity)).toBe(EXPECTED_ALIASED_JSON));

    describe("changing the data", () => {
      it("stores a number when the number property is changed", () => {
        entity.aNumber = A_THIRD_NUMBER;
        expect(entity.entityData.anotherNumber).toBe(A_THIRD_NUMBER);
      });

      it("stores a string when the string property is changed", () => {
        entity.aString = A_THIRD_STRING;
        expect(entity.entityData.anotherString).toBe(A_THIRD_STRING);
      });

      it("stores a string when the string property is changed to a number", () => {
        entity.aString = A_THIRD_NUMBER;
        expect(entity.entityData.anotherString).toBe(A_THIRD_NUMBER_STRING);
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

      it("stores a string when the text property is changed to a string", () => {
        entity.someText = SOME_MORE_TEXT;
        expect(entity.entityData.someOtherText).toBe(SOME_MORE_TEXT);
      });

      it("stores a string when the text property is changed to a number", () => {
        entity.someText = A_THIRD_NUMBER;
        expect(entity.entityData.someOtherText).toBe(A_THIRD_NUMBER_STRING);
      });

      it("stores a string when the text property is changed to a boolean", () => {
        entity.someText = false;
        expect(entity.entityData.someOtherText).toBe('false');
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
        entity.someStrings = SOME_MORE_STRINGS;
        expect(entity.entityData.someOtherStrings).toEqual(SOME_MORE_STRINGS);
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
        entity.someText = null;
        entity.aPoint = null;
        entity.aDate = null;
        entity.someStrings = null;
        expect(entity.entityData.anotherNumber).toBeUndefined();
        expect(entity.entityData.anotherString).toBeUndefined();
        expect(entity.entityData.anotherBoolean).toBeUndefined();
        expect(entity.entityData.someOtherText).toBeUndefined();
        expect(entity.entityData.anotherPoint).toBeUndefined();
        expect(entity.entityData.anotherDate).toBeUndefined();
        expect(entity.entityData.someOtherStrings).toBeUndefined();
      });

      it("errors when properties are set to undefined", () => {
        expect(() => entity.aNumber = undefined)
          .toThrow(`Property cannot be set to undefined. Use null instead.`);

        expect(() => entity.aString = undefined)
          .toThrow(`Property cannot be set to undefined. Use null instead.`);

        expect(() => entity.aBoolean = undefined)
          .toThrow(`Property cannot be set to undefined. Use null instead.`);

        expect(() => entity.someText = undefined)
          .toThrow(`Property cannot be set to undefined. Use null instead.`);

        expect(() => entity.aPoint = undefined)
          .toThrow(`Property cannot be set to undefined. Use null instead.`);

        expect(() => entity.aDate = undefined)
          .toThrow("Property cannot be set to undefined. Use null instead.");

        expect(() => entity.someStrings = undefined)
          .toThrow("Property cannot be set to undefined. Use null instead.");
      });
    });
  });
});
