import { mocked } from 'ts-jest/utils';

import Client from "../../../lib/client";
import Search from "../../../lib/search/search";

import { simpleHashSchema, SimpleHashEntity, SimpleJsonEntity, simpleJsonSchema } from "../helpers/test-entity-and-schema";
import { mockClientSearchToReturnNothing,
  mockClientSearchToReturnSingleHash, mockClientSearchToReturnSingleJsonString,
  mockClientSearchToReturnMultipleHashes, mockClientSearchToReturnMultipleJsonStrings,
  mockClientSearchToReturnPaginatedHashes, mockClientSearchToReturnPaginatedJsonStrings,
  SIMPLE_ENTITY_1, SIMPLE_ENTITY_2, SIMPLE_ENTITY_3, SIMPLE_ENTITY_4, SIMPLE_ENTITY_5 } from '../helpers/search-helpers';

jest.mock('../../../lib/client');


beforeEach(() => mocked(Client).mockReset());
beforeEach(() => mocked(Client.prototype.search).mockReset());

describe("Search", () => {

  let client: Client;

  describe("#returnAll", () => {

    beforeAll(() => client = new Client());

    describe("when running against hashes", () => {
      let search: Search<SimpleHashEntity>;
      let entities: SimpleHashEntity[];

      beforeEach(() => search = new Search<SimpleHashEntity>(simpleHashSchema, client));

      describe("when querying no results", () => {
        beforeEach(async () => {
          mockClientSearchToReturnNothing();
          entities = await search.returnAll();
        });

        it("askes the client for a single page of results", () => {
          expect(Client.prototype.search).toHaveBeenCalledTimes(1);
          expect(Client.prototype.search).toHaveBeenCalledWith(
            'SimpleHashEntity:index', '*', 0, 10);
        });

        it("returns no results", () => expect(entities).toHaveLength(0));
      });

      describe("when querying a single result", () => {
        beforeEach(async () => {
          mockClientSearchToReturnSingleHash();
          entities = await search.returnAll();
        });

        it("askes the client for a a single page of results", () => {
          expect(Client.prototype.search).toHaveBeenCalledTimes(1);
          expect(Client.prototype.search).toHaveBeenCalledWith(
            'SimpleHashEntity:index', '*', 0, 10);
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
          entities = await search.returnAll();
        });

        it("askes the client for a single page of results", () => {
          expect(Client.prototype.search).toHaveBeenCalledTimes(1);
          expect(Client.prototype.search).toHaveBeenCalledWith(
            'SimpleHashEntity:index', '*', 0, 10);
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

      describe("when querying multiple results that cross the page boundry", () => {
        beforeEach(async () => {
          mockClientSearchToReturnPaginatedHashes();
          entities = await search.returnAll({ pageSize: 2 });
        });

        it("askes the client for multiple pages of results", () => {
          expect(Client.prototype.search).toHaveBeenCalledTimes(3);
          expect(Client.prototype.search).toHaveBeenCalledWith(
            'SimpleHashEntity:index', '*', 0, 2);
          expect(Client.prototype.search).toHaveBeenCalledWith(
            'SimpleHashEntity:index', '*', 2, 2);
          expect(Client.prototype.search).toHaveBeenCalledWith(
            'SimpleHashEntity:index', '*', 4, 2);
        });

        it("returns all the results", async () => {
          expect(entities).toHaveLength(5);
          expect(entities).toEqual(expect.arrayContaining([
            expect.objectContaining(SIMPLE_ENTITY_1),
            expect.objectContaining(SIMPLE_ENTITY_2),
            expect.objectContaining(SIMPLE_ENTITY_3),
            expect.objectContaining(SIMPLE_ENTITY_4),
            expect.objectContaining(SIMPLE_ENTITY_5)
          ]));
        });
      });
    });

    describe("when running against JSON objects", () => {
      let search: Search<SimpleJsonEntity>;
      let entities: SimpleJsonEntity[];

      beforeEach(() => search = new Search<SimpleJsonEntity>(simpleJsonSchema, client));

      describe("when querying no results", () => {
        beforeEach(async () => {
          mockClientSearchToReturnNothing();
          entities = await search.returnAll();
        });

        it("askes the client for a single page of results", () => {
          expect(Client.prototype.search).toHaveBeenCalledTimes(1);
          expect(Client.prototype.search).toHaveBeenCalledWith(
            'SimpleJsonEntity:index', '*', 0, 10);
        });

        it("returns no results", () => expect(entities).toHaveLength(0))
      });

      describe("when querying a single result", () => {
        beforeEach(async () => {
          mockClientSearchToReturnSingleJsonString();
          entities = await search.returnAll();
        });

        it("askes the client for a single page of results", () => {
          expect(Client.prototype.search).toHaveBeenCalledTimes(1);
          expect(Client.prototype.search).toHaveBeenCalledWith(
            'SimpleJsonEntity:index', '*', 0, 10);
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
          entities = await search.returnAll();
        });

        it("askes the client for a single page of results", () => {
          expect(Client.prototype.search).toHaveBeenCalledTimes(1);
          expect(Client.prototype.search).toHaveBeenCalledWith(
            'SimpleJsonEntity:index', '*', 0, 10);
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

      describe("when querying multiple results that cross the page boundry", () => {
        beforeEach(async () => {
          mockClientSearchToReturnPaginatedJsonStrings();
          entities = await search.returnAll({ pageSize: 2 });
        });

        it("askes the client for a multiple pages of results", () => {
          expect(Client.prototype.search).toHaveBeenCalledTimes(3);
          expect(Client.prototype.search).toHaveBeenCalledWith(
            'SimpleJsonEntity:index', '*', 0, 2);
          expect(Client.prototype.search).toHaveBeenCalledWith(
            'SimpleJsonEntity:index', '*', 2, 2);
          expect(Client.prototype.search).toHaveBeenCalledWith(
            'SimpleJsonEntity:index', '*', 4, 2);
        });

        it("returns all the results", async () => {
          expect(entities).toHaveLength(5);
          expect(entities).toEqual(expect.arrayContaining([
            expect.objectContaining(SIMPLE_ENTITY_1),
            expect.objectContaining(SIMPLE_ENTITY_2),
            expect.objectContaining(SIMPLE_ENTITY_3),
            expect.objectContaining(SIMPLE_ENTITY_4),
            expect.objectContaining(SIMPLE_ENTITY_5)
          ]));
        });
      });
    });
  });
});
