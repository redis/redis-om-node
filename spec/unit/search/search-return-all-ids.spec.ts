import { client } from '../helpers/mock-client'
import Client from "../../../lib/client";
import { Search, RawSearch } from "../../../lib/search/search";

import { simpleHashSchema, SimpleHashEntity } from "../helpers/test-entity-and-schema";
import { mockClientSearchToReturnNothing, mockClientSearchToReturnSingleKey, mockClientSearchToReturnMultipleKeys,
  mockClientSearchToReturnPaginatedKeys,
  SIMPLE_ENTITY_1, SIMPLE_ENTITY_2, SIMPLE_ENTITY_3, SIMPLE_ENTITY_4, SIMPLE_ENTITY_5 } from '../helpers/search-helpers';


type HashSearch = Search<SimpleHashEntity> | RawSearch<SimpleHashEntity>;

describe("Search", () => {

  describe.each([
    [ "FluentSearch",
      new Search<SimpleHashEntity>(simpleHashSchema, new Client()) ],
    [ "RawSearch",
      new RawSearch<SimpleHashEntity>(simpleHashSchema, new Client()) ]
  ])("%s", (_, search: HashSearch) => {

    describe("#returnAllIds", () => {
      let ids: string[];
      let indexName = 'SimpleHashEntity:index', query = '*';

      describe("when querying no results", () => {
        beforeEach(async () => {
          mockClientSearchToReturnNothing();
          ids = await search.return.allIds();
        });

        it("askes the client for a single page of results", () => {
          expect(client.search).toHaveBeenCalledTimes(1);
          expect(client.search).toHaveBeenCalledWith({
            indexName, query, limit: { offset: 0, count: 10 }, keysOnly: true });
        });

        it("returns no results", () => expect(ids).toHaveLength(0));
      });

      describe("when querying a single result", () => {
        beforeEach(async () => {
          mockClientSearchToReturnSingleKey();
          ids = await search.return.allIds();
        });

        it("askes the client for a a single page of results", () => {
          expect(client.search).toHaveBeenCalledTimes(1);
          expect(client.search).toHaveBeenCalledWith({
            indexName, query, limit: { offset: 0, count: 10 }, keysOnly: true });
        });

        it("returns the expected single result", () => {
          expect(ids).toHaveLength(1);
          expect(ids).toEqual(expect.arrayContaining([
            SIMPLE_ENTITY_1.entityId
          ]));
        });
      });

      describe("when querying multiple results", () => {
        beforeEach(async () => {
          mockClientSearchToReturnMultipleKeys();
          ids = await search.return.allIds();
        });

        it("askes the client for a single page of results", () => {
          expect(client.search).toHaveBeenCalledTimes(1);
          expect(client.search).toHaveBeenCalledWith({
            indexName, query, limit: { offset: 0, count: 10 }, keysOnly: true });
        });

        it("returns all the results", async () => {
          expect(ids).toHaveLength(3);
          expect(ids).toEqual(expect.arrayContaining([
            SIMPLE_ENTITY_1.entityId,
            SIMPLE_ENTITY_2.entityId,
            SIMPLE_ENTITY_3.entityId
          ]));
        });
      });

      describe("when querying multiple results that cross the page boundry", () => {
        beforeEach(async () => {
          mockClientSearchToReturnPaginatedKeys();
          ids = await search.return.allIds({ pageSize: 2 });
        });

        it("askes the client for multiple pages of results", () => {
          expect(client.search).toHaveBeenCalledTimes(3);
          expect(client.search).toHaveBeenCalledWith({
            indexName, query, limit: { offset: 0, count: 2 }, keysOnly: true });
        });

        it("returns all the results", async () => {
          expect(ids).toHaveLength(5);
          expect(ids).toEqual(expect.arrayContaining([
            SIMPLE_ENTITY_1.entityId,
            SIMPLE_ENTITY_2.entityId,
            SIMPLE_ENTITY_3.entityId,
            SIMPLE_ENTITY_4.entityId,
            SIMPLE_ENTITY_5.entityId
          ]));
        });
      });
    });
  });
});
