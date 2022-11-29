import { client } from '../helpers/mock-client'
import { Client } from "$lib/client";
import { Search, RawSearch } from "$lib/search";

import { simpleHashSchema, simpleJsonSchema } from "../helpers/test-entity-and-schema";
import { mockClientSearchToReturnNothing, mockClientSearchToReturnSingleHash,
  mockClientSearchToReturnSingleJsonString, SIMPLE_ENTITY_1 } from '../helpers/search-helpers';

console.warn = vi.fn();


type HashSearch = Search | RawSearch;
type JsonSearch = Search | RawSearch;


describe.each([
  [ "FluentSearch",
    new Search(simpleHashSchema, new Client()),
    new Search(simpleJsonSchema, new Client()) ],
  [ "RawSearch",
    new RawSearch(simpleHashSchema, new Client()),
    new RawSearch(simpleJsonSchema, new Client()) ]
])("%s", (_, hashSearch: HashSearch, jsonSearch: JsonSearch) => {

  describe("#returnMin", () => {
    describe("when running against hashes", () => {
      let entity: object | null;
      let indexName = 'SimpleHashEntity:index', query = '*';

      describe("when querying no results", () => {
        beforeEach( async () => {
          mockClientSearchToReturnNothing();
          entity = await hashSearch.return.max('aNumber');
        });

        it("asks the client for the first result of a given repository", () => {
          expect(client.search).toHaveBeenCalledTimes(1);
          expect(client.search).toHaveBeenCalledWith({
            indexName,
            query,
            limit: { offset: 0, count: 1 },
            sort: { field: 'aNumber', order: 'DESC' },
            keysOnly: false
          });
        });

        it("return no result", () => expect(entity).toBe(null));
      });

      describe("when getting a result", () => {
        beforeEach(async () => {
          mockClientSearchToReturnSingleHash();
          entity = await hashSearch.return.max('aNumber');
        });

        it("asks the client for the first result of a given repository", () => {
          expect(client.search).toHaveBeenCalledTimes(1)
          expect(client.search).toHaveBeenCalledWith({
            indexName,
            query,
            limit: { offset: 0, count: 1 },
            sort: { field: 'aNumber', order: 'DESC' },
            keysOnly: false
          });
        });

        it("returns the first result of a given repository", () => {
          expect(entity?.aBoolean).toEqual(SIMPLE_ENTITY_1.aBoolean);
          expect(entity?.aNumber).toEqual(SIMPLE_ENTITY_1.aNumber);
          expect(entity?.aString).toEqual(SIMPLE_ENTITY_1.aString);
          expect(entity?.entityId).toEqual(SIMPLE_ENTITY_1.entityId);
        });
      });
    });

    describe("when running against JSON Objects", () => {
      let entity: object | null;
      let indexName = 'SimpleJsonEntity:index', query = '*';

      describe("when querying no results", () => {
        beforeEach( async () => {
          mockClientSearchToReturnNothing();
          entity = await jsonSearch.return.max('aNumber');
        });

        it("asks the client for the first result of a given repository", () => {
          expect(client.search).toHaveBeenCalledTimes(1);
          expect(client.search).toHaveBeenCalledWith({
            indexName,
            query,
            limit: { offset: 0, count: 1 },
            sort: { field: 'aNumber', order: 'DESC' },
            keysOnly: false
          });
        });

        it("return no result", () => expect(entity).toBe(null));
      });

      describe("when getting a result", () => {
        beforeEach(async () => {
          mockClientSearchToReturnSingleJsonString();
          entity = await jsonSearch.return.max('aNumber');
        });

        it("asks the client for the first result of a given repository", () => {
          expect(client.search).toHaveBeenCalledTimes(1)
          expect(client.search).toHaveBeenCalledWith({
            indexName,
            query,
            limit: { offset: 0, count: 1 },
            sort: { field: 'aNumber', order: 'DESC' },
            keysOnly: false
          });
        });

        it("returns the first result of a given repository", () => {
          expect(entity?.aBoolean).toEqual(SIMPLE_ENTITY_1.aBoolean);
          expect(entity?.aNumber).toEqual(SIMPLE_ENTITY_1.aNumber);
          expect(entity?.aString).toEqual(SIMPLE_ENTITY_1.aString);
          expect(entity?.entityId).toEqual(SIMPLE_ENTITY_1.entityId);
        });
      });
    });
  });
});
