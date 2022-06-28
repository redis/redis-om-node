import { client } from '../helpers/mock-client'
import { Client } from "$lib/client";
import { Search, RawSearch } from "$lib/search";

import { simpleHashSchema, SimpleHashEntity, SimpleJsonEntity, simpleJsonSchema } from "../helpers/test-entity-and-schema";
import { mockClientSearchToReturnCountOf } from "../helpers/search-helpers";


type HashSearch = Search<SimpleHashEntity> | RawSearch<SimpleHashEntity>;
type JsonSearch = Search<SimpleJsonEntity> | RawSearch<SimpleJsonEntity>;

describe("Search", () => {

  describe.each([
    [ "FluentSearch",
      new Search<SimpleHashEntity>(simpleHashSchema, new Client()),
      new Search<SimpleJsonEntity>(simpleJsonSchema, new Client()) ],
    [ "RawSearch",
      new RawSearch<SimpleHashEntity>(simpleHashSchema, new Client()),
      new RawSearch<SimpleJsonEntity>(simpleJsonSchema, new Client()) ]
  ])("%s", (_, hashSearch: HashSearch, jsonSearch: JsonSearch) => {

    let actualCount: number;

    describe("#returnCount", () => {
      let query = '*', offset = 0, count = 0;

      describe("when counting results from hashes", () => {

        beforeEach(async () => {
          mockClientSearchToReturnCountOf(3);
          actualCount = await hashSearch.return.count();
        });

        it("askes the client for results", () => {
          expect(client.search).toHaveBeenCalledTimes(1);
          expect(client.search).toHaveBeenCalledWith({
            indexName: 'SimpleHashEntity:index', query, limit: { offset, count }, keysOnly: false });
        });

        it("returns the expected count", () => expect(actualCount).toBe(3));
      });

      describe("when running against JSON objects", () => {
        beforeEach(async () => {
          mockClientSearchToReturnCountOf(3);
          actualCount = await jsonSearch.return.count();
        });

        it("askes the client for results", () => {
          expect(client.search).toHaveBeenCalledTimes(1);
          expect(client.search).toHaveBeenCalledWith({
            indexName: 'SimpleJsonEntity:index', query, limit: { offset, count }, keysOnly: false });
        });

        it("returns the expected count", () => expect(actualCount).toBe(3));
      });
    });
  });
});
