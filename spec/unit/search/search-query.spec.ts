import { mocked } from 'ts-jest/utils';

import Client from "../../../lib/client";
import Search from "../../../lib/search/search";

import { simpleHashSchema, SimpleHashEntity, SimpleJsonEntity, simpleJsonSchema } from "../helpers/test-entity-and-schema";

jest.mock('../../../lib/client');


beforeEach(() => mocked(Client).mockReset());

describe("Search", () => {
  
  describe("#query", () => {

    let client: Client;
    beforeAll(() => client = new Client());

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
          .where('aString').eq('foo')
          .where('aNumber').eq(42)
          .where('aBoolean').true()
          .where('anArray').containsOneOf('foo', 'bar').query;
        expect(query).toBe("( ( ( (@aString:{foo}) (@aNumber:[42 42]) ) (@aBoolean:{1}) ) (@anArray:{foo|bar}) )");
      });

      it("generates a query using .noStopWords", () => {
        let query = search.where('aString').eq('foo').noStopWords().query;
        expect(query).toBe("(@aString:{foo}) NOSTOPWORDS");
      });

      it("generates a query using .and", () => {
        let query = search
          .where('aString').eq('foo')
          .and('aNumber').eq(42)
          .and('aBoolean').true()
          .and('anArray').containsOneOf('foo', 'bar').query;
          expect(query).toBe("( ( ( (@aString:{foo}) (@aNumber:[42 42]) ) (@aBoolean:{1}) ) (@anArray:{foo|bar}) )");
      });

      it("generates a query using .or", () => {
        let query = search
          .where('aString').eq('foo')
          .or('aNumber').equals(42)
          .or('aBoolean').true()
          .or('anArray').containsOneOf('foo', 'bar').query;
        expect(query).toBe("( ( ( (@aString:{foo}) | (@aNumber:[42 42]) ) | (@aBoolean:{1}) ) | (@anArray:{foo|bar}) )");
      });

      it("generates a query using .and and .or", () => {
        let query = search
          .where('aString').eq('foo')
          .and('aNumber').equals(42)
          .or('aBoolean').true().query;
        expect(query).toBe("( ( (@aString:{foo}) (@aNumber:[42 42]) ) | (@aBoolean:{1}) )");
      });

      it("generates a query using .and with a function", () => {
        let query = search
          .where('aString').eq('foo')
          .and(search => search 
            .where('aString').eq('bar')
            .and('aNumber').equals(42)
            .or('aBoolean').true()).query;
        expect(query).toBe("( (@aString:{foo}) ( ( (@aString:{bar}) (@aNumber:[42 42]) ) | (@aBoolean:{1}) ) )")
      });

      it("generates a query using .or with a function", () => {
        let query = search
          .where('aString').eq('foo')
          .or(search => search
            .where('aString').eq('bar')
            .and('aNumber').equals(42)
            .or('aBoolean').true()).query;
        expect(query).toBe("( (@aString:{foo}) | ( ( (@aString:{bar}) (@aNumber:[42 42]) ) | (@aBoolean:{1}) ) )")
      });

      it("generates a query using .where with a function", () => {
        let query = search
          .where(search => search
            .where('aString').eq('foo')
            .and('aNumber').equals(42)
            .or('aBoolean').true()).query;
        expect(query).toBe("( ( (@aString:{foo}) (@aNumber:[42 42]) ) | (@aBoolean:{1}) )")
      });

      it("generates a complex query using all the things", () => {
        let query = search
          .where('aString').eq('foo')
          .and('aNumber').equals(42)
          .or('aBoolean').true()
          .and(search => search
            .where('aString').eq('bar')
            .and('aNumber').equals(23)
            .and('aBoolean').false()
          )
          .or(search => search
            .where('aString').eq('baz')
            .or('aNumber').equals(13)
            .or('aBoolean').true()
            .and(search => search
              .where('aString').eq('qux')
              .and('aNumber').equals(7)
            )
          ).query;

        expect(query).toBe("( ( ( ( (@aString:{foo}) (@aNumber:[42 42]) ) | (@aBoolean:{1}) ) ( ( (@aString:{bar}) (@aNumber:[23 23]) ) (@aBoolean:{0}) ) ) | ( ( ( (@aString:{baz}) | (@aNumber:[13 13]) ) | (@aBoolean:{1}) ) ( (@aString:{qux}) (@aNumber:[7 7]) ) ) )");
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
          .where('aString').eq('foo')
          .where('aNumber').eq(42)
          .where('aBoolean').true()
          .where('anArray').containsOneOf('foo', 'bar').query;
        expect(query).toBe("( ( ( (@aString:{foo}) (@aNumber:[42 42]) ) (@aBoolean:{true}) ) (@anArray:{foo|bar}) )");
      });

      it("generates a query using .and", () => {
        let query = search
          .where('aString').eq('foo')
          .and('aNumber').eq(42)
          .and('aBoolean').true()
          .and('anArray').containsOneOf('foo', 'bar').query;
          expect(query).toBe("( ( ( (@aString:{foo}) (@aNumber:[42 42]) ) (@aBoolean:{true}) ) (@anArray:{foo|bar}) )");
      });

      it("generates a query using .or", () => {
        let query = search
          .where('aString').eq('foo')
          .or('aNumber').equals(42)
          .or('aBoolean').true()
          .or('anArray').containsOneOf('foo', 'bar').query;
        expect(query).toBe("( ( ( (@aString:{foo}) | (@aNumber:[42 42]) ) | (@aBoolean:{true}) ) | (@anArray:{foo|bar}) )");
      });

      it("generates a query using .and and .or", () => {
        let query = search
          .where('aString').eq('foo')
          .and('aNumber').equals(42)
          .or('aBoolean').true().query;
        expect(query).toBe("( ( (@aString:{foo}) (@aNumber:[42 42]) ) | (@aBoolean:{true}) )");
      });

      it("generates a query using .and with a function", () => {
        let query = search
          .where('aString').eq('foo')
          .and(search => search 
            .where('aString').eq('bar')
            .and('aNumber').equals(42)
            .or('aBoolean').true()).query;
        expect(query).toBe("( (@aString:{foo}) ( ( (@aString:{bar}) (@aNumber:[42 42]) ) | (@aBoolean:{true}) ) )")
      });

      it("generates a query using .or with a function", () => {
        let query = search
          .where('aString').eq('foo')
          .or(search => search
            .where('aString').eq('bar')
            .and('aNumber').equals(42)
            .or('aBoolean').true()).query;
        expect(query).toBe("( (@aString:{foo}) | ( ( (@aString:{bar}) (@aNumber:[42 42]) ) | (@aBoolean:{true}) ) )")
      });

      it("generates a query using .where with a function", () => {
        let query = search
          .where(search => search
            .where('aString').eq('foo')
            .and('aNumber').equals(42)
            .or('aBoolean').true()).query;
        expect(query).toBe("( ( (@aString:{foo}) (@aNumber:[42 42]) ) | (@aBoolean:{true}) )")
      });

      it("generates a complex query using all the things", () => {
        let query = search
          .where('aString').eq('foo')
          .and('aNumber').equals(42)
          .or('aBoolean').true()
          .and(search => search
            .where('aString').eq('bar')
            .and('aNumber').equals(23)
            .and('aBoolean').false()
          )
          .or(search => search
            .where('aString').eq('baz')
            .or('aNumber').equals(13)
            .or('aBoolean').true()
            .and(search => search
              .where('aString').eq('qux')
              .and('aNumber').equals(7)
            )
          ).query;

        expect(query).toBe("( ( ( ( (@aString:{foo}) (@aNumber:[42 42]) ) | (@aBoolean:{true}) ) ( ( (@aString:{bar}) (@aNumber:[23 23]) ) (@aBoolean:{false}) ) ) | ( ( ( (@aString:{baz}) | (@aNumber:[13 13]) ) | (@aBoolean:{true}) ) ( (@aString:{qux}) (@aNumber:[7 7]) ) ) )");
      });
    });
  });
});
