import { mocked } from 'jest-mock';

import Client from "../../../lib/client";
import { Search } from "../../../lib/search/search";

import { simpleHashSchema, SimpleHashEntity, SimpleJsonEntity, simpleJsonSchema } from "../helpers/test-entity-and-schema";

import {
  A_STRING, ANOTHER_STRING, A_THIRD_STRING,
  A_NUMBER, ANOTHER_NUMBER, A_THIRD_NUMBER,
  A_DATE, A_DATE_EPOCH, A_POINT } from '../../helpers/example-data';

jest.mock('../../../lib/client');


const POINT_LONGITUDE = A_POINT.longitude;
const POINT_LATITUDE = A_POINT.latitude;
const POINT_RADIUS = ANOTHER_NUMBER;
const POINT_UNITS = 'mi';

const EXPECTED_STRING_QUERY_1 = `@aString:{${A_STRING}}`;
const EXPECTED_STRING_QUERY_2 = `@aString:{${ANOTHER_STRING}}`;
const EXPECTED_STRING_QUERY_3 = `@aString:{${A_THIRD_STRING}}`;

const EXPECTED_NUMBER_QUERY_1 = `@aNumber:[${A_NUMBER} ${A_NUMBER}]`;
const EXPECTED_NUMBER_QUERY_2 = `@aNumber:[${ANOTHER_NUMBER} ${ANOTHER_NUMBER}]`;
const EXPECTED_NUMBER_QUERY_3 = `@aNumber:[${A_THIRD_NUMBER} ${A_THIRD_NUMBER}]`;

const EXPECTED_FALSE_HASH_QUERY = `@aBoolean:{0}`;
const EXPECTED_FALSE_JSON_QUERY = `@aBoolean:{false}`;
const EXPECTED_TRUE_HASH_QUERY = `@aBoolean:{1}`;
const EXPECTED_TRUE_JSON_QUERY = `@aBoolean:{true}`;

const EXPECTED_TEXT_QUERY = `@someText:'${A_STRING}'`;
const EXPECTED_POINT_QUERY = `@aPoint:[${POINT_LONGITUDE} ${POINT_LATITUDE} ${POINT_RADIUS} ${POINT_UNITS}]`;
const EXPECTED_DATE_QUERY = `@aDate:[${A_DATE_EPOCH} +inf]`;
const EXPECTED_ARRAY_QUERY = `@someStrings:{${A_STRING}|${ANOTHER_STRING}}`;

describe("Search", () => {
  describe("#query", () => {

    let client: Client;

    beforeAll(() => client = new Client());
    beforeEach(() => mocked(Client).mockReset());

    describe("when querying against hashes", () => {

      let search: Search<SimpleHashEntity>;

      beforeEach(() => search = new Search<SimpleHashEntity>(simpleHashSchema, client));

      it("generates a query matching all items", () => {
        expect(search.query).toBe("*");
      });

      it("throws an exception when invoked with a missing field", () => {
        expect(() => search.where('missingString'))
          .toThrow("The field 'missingString' is not part of the schema.");
      });

      it("generates a query using .where", () => {
        let query = search
          .where('aString').eq(A_STRING)
          .where('aNumber').eq(A_NUMBER)
          .where('aBoolean').true()
          .where('someText').matches(A_STRING)
          .where('aPoint').inCircle(circle => circle.origin(A_POINT).radius(POINT_RADIUS).miles)
          .where('aDate').onOrAfter(A_DATE)
          .where('someStrings').containsOneOf(A_STRING, ANOTHER_STRING).query;
        expect(query).toBe(`( ( ( ( ( ( (${EXPECTED_STRING_QUERY_1}) (${EXPECTED_NUMBER_QUERY_1}) ) (${EXPECTED_TRUE_HASH_QUERY}) ) (${EXPECTED_TEXT_QUERY}) ) (${EXPECTED_POINT_QUERY}) ) (${EXPECTED_DATE_QUERY}) ) (${EXPECTED_ARRAY_QUERY}) )`);
      });

      it("generates a query using .and", () => {
        let query = search
          .where('aString').eq(A_STRING)
          .and('aNumber').eq(A_NUMBER)
          .and('aBoolean').true()
          .and('someText').matches(A_STRING)
          .and('aPoint').inCircle(circle => circle.origin(A_POINT).radius(POINT_RADIUS).miles)
          .and('aDate').onOrAfter(A_DATE)
          .and('someStrings').containsOneOf(A_STRING, ANOTHER_STRING).query;
          expect(query).toBe(`( ( ( ( ( ( (${EXPECTED_STRING_QUERY_1}) (${EXPECTED_NUMBER_QUERY_1}) ) (${EXPECTED_TRUE_HASH_QUERY}) ) (${EXPECTED_TEXT_QUERY}) ) (${EXPECTED_POINT_QUERY}) ) (${EXPECTED_DATE_QUERY}) ) (${EXPECTED_ARRAY_QUERY}) )`);
      });

      it("generates a query using .or", () => {
        let query = search
          .where('aString').eq(A_STRING)
          .or('aNumber').equals(A_NUMBER)
          .or('aBoolean').true()
          .or('someText').matches(A_STRING)
          .or('aPoint').inCircle(circle => circle.origin(A_POINT).radius(POINT_RADIUS).miles)
          .or('aDate').onOrAfter(A_DATE)
          .or('someStrings').containsOneOf(A_STRING, ANOTHER_STRING).query;
        expect(query).toBe(`( ( ( ( ( ( (${EXPECTED_STRING_QUERY_1}) | (${EXPECTED_NUMBER_QUERY_1}) ) | (${EXPECTED_TRUE_HASH_QUERY}) ) | (${EXPECTED_TEXT_QUERY}) ) | (${EXPECTED_POINT_QUERY}) ) | (${EXPECTED_DATE_QUERY}) ) | (${EXPECTED_ARRAY_QUERY}) )`);
      });

      it("generates a query using .and and .or", () => {
        let query = search
          .where('aString').eq(A_STRING)
          .and('aNumber').equals(A_NUMBER)
          .or('aBoolean').true().query;
        expect(query).toBe(`( ( (${EXPECTED_STRING_QUERY_1}) (${EXPECTED_NUMBER_QUERY_1}) ) | (${EXPECTED_TRUE_HASH_QUERY}) )`);
      });

      it("generates a query using .and with a function", () => {
        let query = search
          .where('aString').eq(A_STRING)
          .and(search => search 
            .where('aString').eq(ANOTHER_STRING)
            .and('aNumber').equals(A_NUMBER)
            .or('aBoolean').true()).query;
        expect(query).toBe(`( (${EXPECTED_STRING_QUERY_1}) ( ( (${EXPECTED_STRING_QUERY_2}) (${EXPECTED_NUMBER_QUERY_1}) ) | (${EXPECTED_TRUE_HASH_QUERY}) ) )`)
      });

      it("generates a query using .or with a function", () => {
        let query = search
          .where('aString').eq(A_STRING)
          .or(search => search
            .where('aString').eq(ANOTHER_STRING)
            .and('aNumber').equals(A_NUMBER)
            .or('aBoolean').true()).query;
        expect(query).toBe(`( (${EXPECTED_STRING_QUERY_1}) | ( ( (${EXPECTED_STRING_QUERY_2}) (${EXPECTED_NUMBER_QUERY_1}) ) | (${EXPECTED_TRUE_HASH_QUERY}) ) )`)
      });

      it("generates a query using .where with a function", () => {
        let query = search
          .where(search => search
            .where('aString').eq(A_STRING)
            .and('aNumber').equals(A_NUMBER)
            .or('aBoolean').true()).query;
        expect(query).toBe(`( ( (${EXPECTED_STRING_QUERY_1}) (${EXPECTED_NUMBER_QUERY_1}) ) | (${EXPECTED_TRUE_HASH_QUERY}) )`)
      });

      it("generates a complex query using all the things", () => {
        let query = search
          .where('aString').eq(A_STRING)
          .and('aNumber').equals(A_NUMBER)
          .or('aBoolean').true()
          .and('someText').matches(A_STRING)
          .and('aPoint').inCircle(circle => circle.origin(A_POINT).radius(POINT_RADIUS).miles)
          .or('aDate').onOrAfter(A_DATE)
          .and(search => search
            .where('aString').eq(ANOTHER_STRING)
            .and('aNumber').equals(ANOTHER_NUMBER)
            .and('aBoolean').false()
          )
          .or(search => search
            .where('aString').eq(A_THIRD_STRING)
            .or('aNumber').equals(A_THIRD_NUMBER)
            .or('aBoolean').true()
            .and(search => search
              .where('aString').eq(A_STRING)
              .and('aNumber').equals(A_NUMBER)
            )
          ).query;

        expect(query).toBe(`( ( ( ( ( ( ( (${EXPECTED_STRING_QUERY_1}) (${EXPECTED_NUMBER_QUERY_1}) ) | (${EXPECTED_TRUE_HASH_QUERY}) ) (${EXPECTED_TEXT_QUERY}) ) (${EXPECTED_POINT_QUERY}) ) | (${EXPECTED_DATE_QUERY}) ) ( ( (${EXPECTED_STRING_QUERY_2}) (${EXPECTED_NUMBER_QUERY_2}) ) (${EXPECTED_FALSE_HASH_QUERY}) ) ) | ( ( ( (${EXPECTED_STRING_QUERY_3}) | (${EXPECTED_NUMBER_QUERY_3}) ) | (${EXPECTED_TRUE_HASH_QUERY}) ) ( (${EXPECTED_STRING_QUERY_1}) (${EXPECTED_NUMBER_QUERY_1}) ) ) )`);
      });
    });

    describe("when querying against JSON objects", () => {

      let search: Search<SimpleJsonEntity>;
      
      beforeEach(() => search = new Search<SimpleJsonEntity>(simpleJsonSchema, client));
      
      it("generates a query matching all items", () => {
        expect(search.query).toBe("*");
      });

      it("throws an exception when invoked with a missing field", () => {
        expect(() => search.where('missingString'))
          .toThrow("The field 'missingString' is not part of the schema.");
      });

      it("generates a query using .where", () => {
        let query = search
          .where('aString').eq(A_STRING)
          .where('aNumber').eq(A_NUMBER)
          .where('aBoolean').true()
          .where('someText').matches(A_STRING)
          .where('aPoint').inCircle(circle => circle.origin(A_POINT).radius(POINT_RADIUS).miles)
          .where('aDate').onOrAfter(A_DATE)
          .where('someStrings').containsOneOf(A_STRING, ANOTHER_STRING).query;
        expect(query).toBe(`( ( ( ( ( ( (${EXPECTED_STRING_QUERY_1}) (${EXPECTED_NUMBER_QUERY_1}) ) (${EXPECTED_TRUE_JSON_QUERY}) ) (${EXPECTED_TEXT_QUERY}) ) (${EXPECTED_POINT_QUERY}) ) (${EXPECTED_DATE_QUERY}) ) (${EXPECTED_ARRAY_QUERY}) )`);
      });

      it("generates a query using .and", () => {
        let query = search
          .where('aString').eq(A_STRING)
          .and('aNumber').eq(A_NUMBER)
          .and('aBoolean').true()
          .and('someText').matches(A_STRING)
          .and('aPoint').inCircle(circle => circle.origin(A_POINT).radius(POINT_RADIUS).miles)
          .and('aDate').onOrAfter(A_DATE)
          .and('someStrings').containsOneOf(A_STRING, ANOTHER_STRING).query;
          expect(query).toBe(`( ( ( ( ( ( (${EXPECTED_STRING_QUERY_1}) (${EXPECTED_NUMBER_QUERY_1}) ) (${EXPECTED_TRUE_JSON_QUERY}) ) (${EXPECTED_TEXT_QUERY}) ) (${EXPECTED_POINT_QUERY}) ) (${EXPECTED_DATE_QUERY}) ) (${EXPECTED_ARRAY_QUERY}) )`);
      });

      it("generates a query using .or", () => {
        let query = search
          .where('aString').eq(A_STRING)
          .or('aNumber').equals(A_NUMBER)
          .or('aBoolean').true()
          .or('someText').matches(A_STRING)
          .or('aPoint').inCircle(circle => circle.origin(A_POINT).radius(POINT_RADIUS).miles)
          .or('aDate').onOrAfter(A_DATE)
          .or('someStrings').containsOneOf(A_STRING, ANOTHER_STRING).query;
        expect(query).toBe(`( ( ( ( ( ( (${EXPECTED_STRING_QUERY_1}) | (${EXPECTED_NUMBER_QUERY_1}) ) | (${EXPECTED_TRUE_JSON_QUERY}) ) | (${EXPECTED_TEXT_QUERY}) ) | (${EXPECTED_POINT_QUERY}) ) | (${EXPECTED_DATE_QUERY}) ) | (${EXPECTED_ARRAY_QUERY}) )`);
      });

      it("generates a query using .and and .or", () => {
        let query = search
          .where('aString').eq(A_STRING)
          .and('aNumber').equals(A_NUMBER)
          .or('aBoolean').true().query;
        expect(query).toBe(`( ( (${EXPECTED_STRING_QUERY_1}) (${EXPECTED_NUMBER_QUERY_1}) ) | (${EXPECTED_TRUE_JSON_QUERY}) )`);
      });

      it("generates a query using .and with a function", () => {
        let query = search
          .where('aString').eq(A_STRING)
          .and(search => search 
            .where('aString').eq(ANOTHER_STRING)
            .and('aNumber').equals(A_NUMBER)
            .or('aBoolean').true()).query;
        expect(query).toBe(`( (${EXPECTED_STRING_QUERY_1}) ( ( (${EXPECTED_STRING_QUERY_2}) (${EXPECTED_NUMBER_QUERY_1}) ) | (${EXPECTED_TRUE_JSON_QUERY}) ) )`);
      });

      it("generates a query using .or with a function", () => {
        let query = search
          .where('aString').eq(A_STRING)
          .or(search => search
            .where('aString').eq(ANOTHER_STRING)
            .and('aNumber').equals(A_NUMBER)
            .or('aBoolean').true()).query;
        expect(query).toBe(`( (${EXPECTED_STRING_QUERY_1}) | ( ( (${EXPECTED_STRING_QUERY_2}) (${EXPECTED_NUMBER_QUERY_1}) ) | (${EXPECTED_TRUE_JSON_QUERY}) ) )`);
      });

      it("generates a query using .where with a function", () => {
        let query = search
          .where(search => search
            .where('aString').eq(A_STRING)
            .and('aNumber').equals(A_NUMBER)
            .or('aBoolean').true()).query;
        expect(query).toBe(`( ( (${EXPECTED_STRING_QUERY_1}) (${EXPECTED_NUMBER_QUERY_1}) ) | (${EXPECTED_TRUE_JSON_QUERY}) )`);
      });

      it("generates a complex query using all the things", () => {
        let query = search
          .where('aString').eq(A_STRING)
          .and('aNumber').equals(A_NUMBER)
          .or('aBoolean').true()
          .and('someText').matches(A_STRING)
          .and('aPoint').inCircle(circle => circle.origin(A_POINT).radius(POINT_RADIUS).miles)
          .or('aDate').onOrAfter(A_DATE)
          .and(search => search
            .where('aString').eq(ANOTHER_STRING)
            .and('aNumber').equals(ANOTHER_NUMBER)
            .and('aBoolean').false()
          )
          .or(search => search
            .where('aString').eq(A_THIRD_STRING)
            .or('aNumber').equals(A_THIRD_NUMBER)
            .or('aBoolean').true()
            .and(search => search
              .where('aString').eq(A_STRING)
              .and('aNumber').equals(A_NUMBER)
            )
          ).query;

        expect(query).toBe(`( ( ( ( ( ( ( (${EXPECTED_STRING_QUERY_1}) (${EXPECTED_NUMBER_QUERY_1}) ) | (${EXPECTED_TRUE_JSON_QUERY}) ) (${EXPECTED_TEXT_QUERY}) ) (${EXPECTED_POINT_QUERY}) ) | (${EXPECTED_DATE_QUERY}) ) ( ( (${EXPECTED_STRING_QUERY_2}) (${EXPECTED_NUMBER_QUERY_2}) ) (${EXPECTED_FALSE_JSON_QUERY}) ) ) | ( ( ( (${EXPECTED_STRING_QUERY_3}) | (${EXPECTED_NUMBER_QUERY_3}) ) | (${EXPECTED_TRUE_JSON_QUERY}) ) ( (${EXPECTED_STRING_QUERY_1}) (${EXPECTED_NUMBER_QUERY_1}) ) ) )`);
      });
    });
  });
});
