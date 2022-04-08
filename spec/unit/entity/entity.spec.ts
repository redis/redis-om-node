import {
  A_STRING, ANOTHER_STRING, A_THIRD_STRING,
  A_NUMBER, ANOTHER_NUMBER, A_THIRD_NUMBER,
  A_DATE, A_DATE_ISO, A_DATE_EPOCH, ANOTHER_DATE, ANOTHER_DATE_ISO, ANOTHER_DATE_EPOCH, A_THIRD_DATE,
  A_POINT, A_POINT_JSON, A_POINT_STRING, ANOTHER_POINT, ANOTHER_POINT_JSON, ANOTHER_POINT_STRING, A_THIRD_POINT,
  SOME_STRINGS, SOME_STRINGS_JSON, SOME_OTHER_STRINGS, SOME_OTHER_STRINGS_JSON, SOME_MORE_STRINGS,
  SOME_TEXT, SOME_OTHER_TEXT, SOME_MORE_TEXT, A_DATE_EPOCH_STRING, A_NUMBER_STRING, SOME_STRINGS_JOINED, ANOTHER_DATE_EPOCH_STRING, ANOTHER_NUMBER_STRING, SOME_OTHER_STRINGS_JOINED } from '../../helpers/example-data';

import { AliasedEntity, aliasedSchema, SimpleEntity, simpleSchema } from '../helpers/test-entity-and-schema';

const ENTITY_ID = 'foo';

const EXPECTED_NULL_JSON = `{"entityId":"${ENTITY_ID}","aString":null,"someText":null,"aNumber":null,"aBoolean":null,"aPoint":null,"aDate":null,"someStrings":null}`;
const EXPECTED_JSON = `{"entityId":"${ENTITY_ID}","aString":"${A_STRING}","someText":"${SOME_TEXT}","aNumber":${A_NUMBER},"aBoolean":false,"aPoint":${A_POINT_JSON},"aDate":"${A_DATE_ISO}","someStrings":${SOME_STRINGS_JSON}}`;
const EXPECTED_ALIASED_JSON = `{"entityId":"${ENTITY_ID}","aString":"${ANOTHER_STRING}","someText":"${SOME_OTHER_TEXT}","aNumber":${ANOTHER_NUMBER},"aBoolean":true,"aPoint":${ANOTHER_POINT_JSON},"aDate":"${ANOTHER_DATE_ISO}","someStrings":${SOME_OTHER_STRINGS_JSON}}`;

const EXPECTED_NULL_JSON_DATA = {};
const EXPECTED_JSON_DATA = { aBoolean: false, aDate: A_DATE_EPOCH, aNumber: A_NUMBER,
  aPoint: A_POINT_STRING, aString: A_STRING, someStrings: SOME_STRINGS, someText: SOME_TEXT };
const EXPECTED_ALIASED_JSON_DATA = { anotherBoolean: true, anotherDate: ANOTHER_DATE_EPOCH,
  anotherNumber: ANOTHER_NUMBER, anotherPoint: ANOTHER_POINT_STRING, anotherString: ANOTHER_STRING,
  someOtherStrings: SOME_OTHER_STRINGS, someOtherText: SOME_OTHER_TEXT };

const EXPECTED_NULL_HASH_DATA = {};
const EXPECTED_HASH_DATA = { aBoolean: '0', aDate: A_DATE_EPOCH_STRING, aNumber: A_NUMBER_STRING,
  aPoint: A_POINT_STRING, aString: A_STRING, someStrings: SOME_STRINGS_JOINED, someText: SOME_TEXT };
const EXPECTED_ALIASED_HASH_DATA = { anotherBoolean: '1', anotherDate: ANOTHER_DATE_EPOCH_STRING,
  anotherNumber: ANOTHER_NUMBER_STRING, anotherPoint: ANOTHER_POINT_STRING, anotherString: ANOTHER_STRING,
  someOtherStrings: SOME_OTHER_STRINGS_JOINED, someOtherText: SOME_OTHER_TEXT };


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
    it("converts to the expected Redis JSON data", () => expect(entity.toRedisJson()).toEqual(EXPECTED_NULL_JSON_DATA));
    it("converts to the expected Redis Hash data", () => expect(entity.toRedisHash()).toEqual(EXPECTED_NULL_HASH_DATA));
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
    it("converts to the expected Redis JSON data", () => expect(entity.toRedisJson()).toEqual(EXPECTED_JSON_DATA));
    it("converts to the expected Redis Hash data", () => expect(entity.toRedisHash()).toEqual(EXPECTED_HASH_DATA));

    describe("changing the data", () => {
      it("stores a number when the number property is changed", () => {
        entity.aNumber = ANOTHER_NUMBER;
        expect(entity.entityData.aNumber).toBe(ANOTHER_NUMBER);
      });

      it("stores a string when the string property is changed", () => {
        entity.aString = ANOTHER_STRING;
        expect(entity.entityData.aString).toBe(ANOTHER_STRING);
      });

      it("stores a boolean when the boolean property is changed", () => {
        entity.aBoolean = true;
        expect(entity.entityData.aBoolean).toBe(true);
      });

      it("stores a string when the text property is changed to a string", () => {
        entity.someText = SOME_OTHER_TEXT;
        expect(entity.entityData.someText).toBe(SOME_OTHER_TEXT);
      });

      it("stores a point when the point property is changed", () => {
        entity.aPoint = ANOTHER_POINT;
        expect(entity.entityData.aPoint).toEqual(ANOTHER_POINT);
      });

      it("stores a date when the date property is changed", () => {
        entity.aDate = ANOTHER_DATE;
        expect(entity.entityData.aDate).toEqual(ANOTHER_DATE);
      });

      it("stores a string[] when the string[] property is changed", () => {
        entity.someStrings = SOME_OTHER_STRINGS;
        expect(entity.entityData.someStrings).toEqual(SOME_OTHER_STRINGS);
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
    it("converts to the expected Redis JSON data", () => expect(entity.toRedisJson()).toEqual(EXPECTED_ALIASED_JSON_DATA));
    it("converts to the expected Redis Hash data", () => expect(entity.toRedisHash()).toEqual(EXPECTED_ALIASED_HASH_DATA));

    describe("changing the data", () => {
      it("stores a number when the number property is changed", () => {
        entity.aNumber = A_THIRD_NUMBER;
        expect(entity.entityData.anotherNumber).toBe(A_THIRD_NUMBER);
      });

      it("stores a string when the string property is changed", () => {
        entity.aString = A_THIRD_STRING;
        expect(entity.entityData.anotherString).toBe(A_THIRD_STRING);
      });

      it("stores a boolean when the booelan property is changed", () => {
        entity.aBoolean = true;
        expect(entity.entityData.anotherBoolean).toBe(true);
      });

      it("stores a string when the text property is changed", () => {
        entity.someText = SOME_MORE_TEXT;
        expect(entity.entityData.someOtherText).toBe(SOME_MORE_TEXT);
      });

      it("stores a point when the point property is changed", () => {
        entity.aPoint = A_THIRD_POINT;
        expect(entity.entityData.anotherPoint).toEqual(A_THIRD_POINT);
      });

      it("stores a date when the date property is changed", () => {
        entity.aDate = A_THIRD_DATE;
        expect(entity.entityData.anotherDate).toEqual(A_THIRD_DATE);
      });

      it("stores a string[] when the string[] property is changed", () => {
        entity.someStrings = SOME_MORE_STRINGS;
        expect(entity.entityData.someOtherStrings).toEqual(SOME_MORE_STRINGS);
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
    });
  });
});
