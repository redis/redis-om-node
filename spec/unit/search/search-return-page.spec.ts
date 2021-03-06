import { client } from '../helpers/mock-client'
import { Client } from "$lib/client";
import { Search, RawSearch } from "$lib/search";

import { simpleHashSchema, SimpleHashEntity, SimpleJsonEntity, simpleJsonSchema } from "../helpers/test-entity-and-schema";
import { mockClientSearchToReturnNothing,
  mockClientSearchToReturnSingleHash, mockClientSearchToReturnSingleJsonString,
  mockClientSearchToReturnMultipleHashes, mockClientSearchToReturnMultipleJsonStrings,
  SIMPLE_ENTITY_1, SIMPLE_ENTITY_2, SIMPLE_ENTITY_3 } from '../helpers/search-helpers';


type HashSearch = Search<SimpleHashEntity> | RawSearch<SimpleHashEntity>;
type JsonSearch = Search<SimpleJsonEntity> | RawSearch<SimpleJsonEntity>;

describe.each([
  [ "FluentSearch",
    new Search<SimpleHashEntity>(simpleHashSchema, new Client()),
    new Search<SimpleJsonEntity>(simpleJsonSchema, new Client()) ],
  [ "RawSearch",
    new RawSearch<SimpleHashEntity>(simpleHashSchema, new Client()),
    new RawSearch<SimpleJsonEntity>(simpleJsonSchema, new Client()) ]
])("%s", (_, hashSearch: HashSearch, jsonSearch: JsonSearch) => {

  describe("#returnPage", () => {

    describe("when running against hashes", () => {
      let entities: SimpleHashEntity[];
      let indexName = 'SimpleHashEntity:index', query = '*';

      describe("when querying no results", () => {
        beforeEach(async () => {
          mockClientSearchToReturnNothing();
          entities = await hashSearch.return.page(0, 5);
        });

        it("askes the client for results", () => {
          expect(client.search).toHaveBeenCalledTimes(1);
          expect(client.search).toHaveBeenCalledWith({
            indexName, query, limit: { offset: 0, count: 5 }, keysOnly: false });
        });

        it("returns no results", () => expect(entities).toHaveLength(0));
      });

      describe("when querying a single result", () => {
        beforeEach(async () => {
          mockClientSearchToReturnSingleHash();
          entities = await hashSearch.return.page(0, 5);
        });

        it("askes the client for results", () => {
          expect(client.search).toHaveBeenCalledTimes(1);
          expect(client.search).toHaveBeenCalledWith({
            indexName, query, limit: { offset: 0, count: 5 }, keysOnly: false });
        });

        it("returns the expected single result", () => {
          expect(entities).toHaveLength(1);
          expect(entities).toEqual(expect.arrayContaining([
            expect.objectContaining(SIMPLE_ENTITY_1)
          ]));
        });
      });

      describe("when querying multiple results", () => {
        beforeEach(async () => {
          mockClientSearchToReturnMultipleHashes();
          entities = await hashSearch.return.page(0, 5);
        });

        it("askes the client for results", () => {
          expect(client.search).toHaveBeenCalledTimes(1);
          expect(client.search).toHaveBeenCalledWith({
            indexName, query, limit: { offset: 0, count: 5 }, keysOnly: false });
        });

        it("returns all the results", async () => {
          expect(entities).toHaveLength(3);
          expect(entities).toEqual(expect.arrayContaining([
            expect.objectContaining(SIMPLE_ENTITY_1),
            expect.objectContaining(SIMPLE_ENTITY_2),
            expect.objectContaining(SIMPLE_ENTITY_3)
          ]));
        });
      });
    });

    describe("when running against JSON objects", () => {
      let entities: SimpleJsonEntity[];
      let indexName = 'SimpleJsonEntity:index', query = '*';

      describe("when querying no results", () => {
        beforeEach(async () => {
          mockClientSearchToReturnNothing();
          entities = await jsonSearch.return.page(0, 5);
        });

        it("askes the client for results", () => {
          expect(client.search).toHaveBeenCalledTimes(1);
          expect(client.search).toHaveBeenCalledWith({
            indexName, query, limit: { offset: 0, count: 5 }, keysOnly: false });
        });

        it("returns no results", async () => expect(entities).toHaveLength(0));
      });

      describe("when querying a single result", () => {
        beforeEach(async () => {
          mockClientSearchToReturnSingleJsonString();
          entities = await jsonSearch.return.page(0, 5);
        });

        it("askes the client for results", () => {
          expect(client.search).toHaveBeenCalledTimes(1);
          expect(client.search).toHaveBeenCalledWith({
            indexName, query, limit: { offset: 0, count: 5 }, keysOnly: false });
        });

        it("returns the expected single result", () => {
          expect(entities).toHaveLength(1);
          expect(entities).toEqual(expect.arrayContaining([
            expect.objectContaining(SIMPLE_ENTITY_1)
          ]));
        });
      });

      describe("when querying multiple results", () => {
        beforeEach(async () => {
          mockClientSearchToReturnMultipleJsonStrings();
          entities = await jsonSearch.return.page(0, 5);
        });

        it("askes the client for results", () => {
          expect(client.search).toHaveBeenCalledTimes(1);
          expect(client.search).toHaveBeenCalledWith({
            indexName, query, limit: { offset: 0, count: 5 }, keysOnly: false });
        });

        it("returns all the expected results", () => {
          expect(entities).toHaveLength(3);
          expect(entities).toEqual(expect.arrayContaining([
            expect.objectContaining(SIMPLE_ENTITY_1),
            expect.objectContaining(SIMPLE_ENTITY_2),
            expect.objectContaining(SIMPLE_ENTITY_3)
          ]));
        });
      });
    });
  });
});
