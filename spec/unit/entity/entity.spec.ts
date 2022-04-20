import { RedisHashData, RedisJsonData } from '../../../lib';
import {
  A_STRING, ANOTHER_STRING,
  A_NUMBER, A_NUMBER_STRING, ANOTHER_NUMBER, ANOTHER_NUMBER_STRING,
  A_DATE, A_DATE_ISO, A_DATE_EPOCH, A_DATE_EPOCH_STRING,
  ANOTHER_DATE, ANOTHER_DATE_ISO, ANOTHER_DATE_EPOCH, ANOTHER_DATE_EPOCH_STRING,
  A_POINT, A_POINT_JSON, A_POINT_STRING, ANOTHER_POINT, ANOTHER_POINT_JSON, ANOTHER_POINT_STRING,
  SOME_STRINGS, SOME_STRINGS_JSON, SOME_STRINGS_JOINED,
  SOME_OTHER_STRINGS, SOME_OTHER_STRINGS_JSON, SOME_OTHER_STRINGS_JOINED,
  SOME_TEXT, SOME_OTHER_TEXT
} from '../../helpers/example-data';

import { AliasedEntity, aliasedSchema, SimpleEntity, simpleSchema } from '../helpers/test-entity-and-schema';

const ENTITY_ID = 'foo';

const EXPECTED_NULL_JSON = `{"entityId":"${ENTITY_ID}","aString":null,"someText":null,"aNumber":null,"aBoolean":null,"aPoint":null,"aDate":null,"someStrings":null}`;
const EXPECTED_JSON = `{"entityId":"${ENTITY_ID}","aString":"${A_STRING}","someText":"${SOME_TEXT}","aNumber":${A_NUMBER},"aBoolean":false,"aPoint":${A_POINT_JSON},"aDate":"${A_DATE_ISO}","someStrings":${SOME_STRINGS_JSON}}`;
const EXPECTED_ALIASED_JSON = `{"entityId":"${ENTITY_ID}","aString":"${ANOTHER_STRING}","someText":"${SOME_OTHER_TEXT}","aNumber":${ANOTHER_NUMBER},"aBoolean":true,"aPoint":${ANOTHER_POINT_JSON},"aDate":"${ANOTHER_DATE_ISO}","someStrings":${SOME_OTHER_STRINGS_JSON}}`;

const NULL_JSON_DATA: RedisJsonData = {};
const SIMPLE_JSON_DATA: RedisJsonData = {
  aBoolean: false, aDate: A_DATE_EPOCH, aNumber: A_NUMBER, aPoint: A_POINT_STRING,
  aString: A_STRING, someStrings: SOME_STRINGS, someText: SOME_TEXT
};
const ALIASED_JSON_DATA: RedisJsonData = {
  anotherBoolean: true, anotherDate: ANOTHER_DATE_EPOCH, anotherNumber: ANOTHER_NUMBER,
  anotherPoint: ANOTHER_POINT_STRING, anotherString: ANOTHER_STRING,
  someOtherStrings: SOME_OTHER_STRINGS, someOtherText: SOME_OTHER_TEXT
};

const NULL_HASH_DATA: RedisHashData = {};
const SIMPLE_HASH_DATA: RedisHashData = {
  aBoolean: '0', aDate: A_DATE_EPOCH_STRING, aNumber: A_NUMBER_STRING, aPoint: A_POINT_STRING,
  aString: A_STRING, someStrings: SOME_STRINGS_JOINED, someText: SOME_TEXT
};
const ALIASED_HASH_DATA: RedisHashData = {
  anotherBoolean: '1', anotherDate: ANOTHER_DATE_EPOCH_STRING, anotherNumber: ANOTHER_NUMBER_STRING,
  anotherPoint: ANOTHER_POINT_STRING, anotherString: ANOTHER_STRING,
  someOtherStrings: SOME_OTHER_STRINGS_JOINED, someOtherText: SOME_OTHER_TEXT
};

let entity: SimpleEntity;

describe("Entity", () => {
  describe("when not aliased", () => {
    describe("without data", () => {
      beforeEach(() => entity = new SimpleEntity(simpleSchema, ENTITY_ID));
      it("has the passed in Redis ID", () => expect(entity.entityId).toBe(ENTITY_ID));
      it("returns null for the number property", () => expect(entity.aNumber).toBeNull());
      it("returns null for the string property", () => expect(entity.aString).toBeNull());
      it("returns null for the boolean property", () => expect(entity.aBoolean).toBeNull());
      it("returns null for the text property", () => expect(entity.someText).toBeNull());
      it("returns null for the point property", () => expect(entity.aPoint).toBeNull());
      it("returns null for the date property", () => expect(entity.aDate).toBeNull());
      it("returns null for the array property", () => expect(entity.someStrings).toBeNull());
      it("returns the expected key name", () => expect(entity.keyName).toBe(`SimpleEntity:${ENTITY_ID}`));

      it("serializes to the expected JSON", () => expect(JSON.stringify(entity)).toBe(EXPECTED_NULL_JSON));

      it("converts to the expected Redis JSON data", () => expect(entity.toRedisJson()).toEqual(NULL_JSON_DATA));
      it("converts to the expected Redis Hash data", () => expect(entity.toRedisHash()).toEqual(NULL_HASH_DATA));

      describe("when loaded from Redis JSON data", () => {
        beforeEach(() => entity.fromRedisJson(SIMPLE_JSON_DATA));
        it("returns a number for the number property", () => expect(entity.aNumber).toBe(A_NUMBER));
        it("returns a string for the string property", () => expect(entity.aString).toBe(A_STRING));
        it("returns a boolean for the boolean property", () => expect(entity.aBoolean).toBe(false));
        it("returns a string for the text property", () => expect(entity.someText).toBe(SOME_TEXT));
        it("returns a point for the point property", () => expect(entity.aPoint).toEqual(A_POINT));
        it("returns a date for the date property", () => expect(entity.aDate).toEqual(A_DATE));
        it("returns a array for the array property", () => expect(entity.someStrings).toEqual(SOME_STRINGS));
      });

      describe("when loaded from Redis Hash data", () => {
        beforeEach(() => entity.fromRedisHash(SIMPLE_HASH_DATA));
        it("returns a number for the number property", () => expect(entity.aNumber).toBe(A_NUMBER));
        it("returns a string for the string property", () => expect(entity.aString).toBe(A_STRING));
        it("returns a boolean for the boolean property", () => expect(entity.aBoolean).toBe(false));
        it("returns a string for the text property", () => expect(entity.someText).toBe(SOME_TEXT));
        it("returns a point for the point property", () => expect(entity.aPoint).toEqual(A_POINT));
        it("returns a date for the date property", () => expect(entity.aDate).toEqual(A_DATE));
        it("returns a array for the array property", () => expect(entity.someStrings).toEqual(SOME_STRINGS));
      });
    });

    describe("with data", () => {
      beforeEach(() => entity = new SimpleEntity(simpleSchema, ENTITY_ID, {
        aNumber: A_NUMBER, aString: A_STRING, aBoolean: false, someText: SOME_TEXT,
        aPoint: A_POINT, aDate: A_DATE, someStrings: SOME_STRINGS
      }));

      it("has the passed in Redis ID", () => expect(entity.entityId).toBe(ENTITY_ID));
      it("returns a number for the number property", () => expect(entity.aNumber).toBe(A_NUMBER));
      it("returns a string for the string property", () => expect(entity.aString).toBe(A_STRING));
      it("returns a boolean for the boolean property", () => expect(entity.aBoolean).toBe(false));
      it("returns a string for the text property", () => expect(entity.someText).toBe(SOME_TEXT));
      it("returns a point for the point property", () => expect(entity.aPoint).toEqual(A_POINT));
      it("returns a date for the date property", () => expect(entity.aDate).toEqual(A_DATE));
      it("returns a array for the array property", () => expect(entity.someStrings).toEqual(SOME_STRINGS));
      it("returns the expected key name", () => expect(entity.keyName).toBe(`SimpleEntity:${ENTITY_ID}`));

      it("serializes to the expected JSON", () => expect(JSON.stringify(entity)).toBe(EXPECTED_JSON));

      it("converts to the expected Redis JSON data", () => expect(entity.toRedisJson()).toEqual(SIMPLE_JSON_DATA));
      it("converts to the expected Redis Hash data", () => expect(entity.toRedisHash()).toEqual(SIMPLE_HASH_DATA));

      describe("changing the data", () => {
        it("stores a number when the number property is changed", () => {
          entity.aNumber = ANOTHER_NUMBER;
          expect(entity.aNumber).toBe(ANOTHER_NUMBER);
        });

        it("stores a string when the string property is changed", () => {
          entity.aString = ANOTHER_STRING;
          expect(entity.aString).toBe(ANOTHER_STRING);
        });

        it("stores a boolean when the boolean property is changed", () => {
          entity.aBoolean = true;
          expect(entity.aBoolean).toBe(true);
        });

        it("stores a string when the text property is changed to a string", () => {
          entity.someText = SOME_OTHER_TEXT;
          expect(entity.someText).toBe(SOME_OTHER_TEXT);
        });

        it("stores a point when the point property is changed", () => {
          entity.aPoint = ANOTHER_POINT;
          expect(entity.aPoint).toEqual(ANOTHER_POINT);
        });

        it("stores a date when the date property is changed", () => {
          entity.aDate = ANOTHER_DATE;
          expect(entity.aDate).toEqual(ANOTHER_DATE);
        });

        it("stores a array when the array property is changed", () => {
          entity.someStrings = SOME_OTHER_STRINGS;
          expect(entity.someStrings).toEqual(SOME_OTHER_STRINGS);
        });
      });
    });
  });

  describe("when aliased", () => {
    describe("without data", () => {
      beforeEach(() => entity = new AliasedEntity(aliasedSchema, ENTITY_ID));
      it("has the passed in Redis ID", () => expect(entity.entityId).toBe(ENTITY_ID));
      it("returns null for the number property", () => expect(entity.aNumber).toBeNull());
      it("returns null for the string property", () => expect(entity.aString).toBeNull());
      it("returns null for the boolean property", () => expect(entity.aBoolean).toBeNull());
      it("returns null for the text property", () => expect(entity.someText).toBeNull());
      it("returns null for the point property", () => expect(entity.aPoint).toBeNull());
      it("returns null for the date property", () => expect(entity.aDate).toBeNull());
      it("returns null for the array property", () => expect(entity.someStrings).toBeNull());
      it("returns the expected key name", () => expect(entity.keyName).toBe(`AliasedEntity:${ENTITY_ID}`));

      it("serializes to the expected JSON", () => expect(JSON.stringify(entity)).toBe(EXPECTED_NULL_JSON));

      it("converts to the expected Redis JSON data", () => expect(entity.toRedisJson()).toEqual(NULL_JSON_DATA));
      it("converts to the expected Redis Hash data", () => expect(entity.toRedisHash()).toEqual(NULL_HASH_DATA));

      describe("when loaded from Redis JSON data", () => {
        beforeEach(() => entity.fromRedisJson(ALIASED_JSON_DATA));
        it("returns a number for the number property", () => expect(entity.aNumber).toBe(ANOTHER_NUMBER));
        it("returns a string for the string property", () => expect(entity.aString).toBe(ANOTHER_STRING));
        it("returns a boolean for the boolean property", () => expect(entity.aBoolean).toBe(true));
        it("returns a string for the text property", () => expect(entity.someText).toBe(SOME_OTHER_TEXT));
        it("returns a point for the point property", () => expect(entity.aPoint).toEqual(ANOTHER_POINT));
        it("returns a date for the date property", () => expect(entity.aDate).toEqual(ANOTHER_DATE));
        it("returns a array for the array property", () => expect(entity.someStrings).toEqual(SOME_OTHER_STRINGS));
      });

      describe("when loaded from Redis Hash data", () => {
        beforeEach(() => entity.fromRedisHash(ALIASED_HASH_DATA));
        it("returns a number for the number property", () => expect(entity.aNumber).toBe(ANOTHER_NUMBER));
        it("returns a string for the string property", () => expect(entity.aString).toBe(ANOTHER_STRING));
        it("returns a boolean for the boolean property", () => expect(entity.aBoolean).toBe(true));
        it("returns a string for the text property", () => expect(entity.someText).toBe(SOME_OTHER_TEXT));
        it("returns a point for the point property", () => expect(entity.aPoint).toEqual(ANOTHER_POINT));
        it("returns a date for the date property", () => expect(entity.aDate).toEqual(ANOTHER_DATE));
        it("returns a array for the array property", () => expect(entity.someStrings).toEqual(SOME_OTHER_STRINGS));
      });

      describe("with data", () => {
        beforeEach(() => entity = new AliasedEntity(aliasedSchema, ENTITY_ID, {
          anotherNumber: ANOTHER_NUMBER, anotherString: ANOTHER_STRING,
          anotherBoolean: true, someOtherText: SOME_OTHER_TEXT,
          anotherPoint: ANOTHER_POINT, anotherDate: ANOTHER_DATE, someOtherStrings: SOME_OTHER_STRINGS
        }));

        it("has the passed in Redis ID", () => expect(entity.entityId).toBe(ENTITY_ID));
        it("returns a number for the number property", () => expect(entity.aNumber).toBe(ANOTHER_NUMBER));
        it("returns a string for the string property", () => expect(entity.aString).toBe(ANOTHER_STRING));
        it("returns a boolean for the boolean property", () => expect(entity.aBoolean).toBe(true));
        it("returns a string for the text property", () => expect(entity.someText).toBe(SOME_OTHER_TEXT));
        it("returns a point for the point property", () => expect(entity.aPoint).toEqual(ANOTHER_POINT));
        it("returns a date for the date property", () => expect(entity.aDate).toEqual(ANOTHER_DATE));
        it("returns a array for the array property", () => expect(entity.someStrings).toEqual(SOME_OTHER_STRINGS));
        it("returns the expected key name", () => expect(entity.keyName).toBe(`AliasedEntity:${ENTITY_ID}`));

        it("serializes to the expected JSON", () => expect(JSON.stringify(entity)).toBe(EXPECTED_ALIASED_JSON));

        it("converts to the expected Redis JSON data", () => expect(entity.toRedisJson()).toEqual(ALIASED_JSON_DATA));
        it("converts to the expected Redis Hash data", () => expect(entity.toRedisHash()).toEqual(ALIASED_HASH_DATA));
      });
    });
  });
});
