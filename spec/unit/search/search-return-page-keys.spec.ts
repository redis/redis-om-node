import { mocked } from 'jest-mock';

import Client from "../../../lib/client";
import { Search, RawSearch } from "../../../lib/search/search";

import { simpleHashSchema, SimpleHashEntity, SimpleJsonEntity, simpleJsonSchema } from "../helpers/test-entity-and-schema";
import { mockClientSearchToReturnNothing,
  mockClientSearchToReturnSingleKey, mockClientSearchToReturnMultipleKeys,
  SIMPLE_ENTITY_1, SIMPLE_ENTITY_2, SIMPLE_ENTITY_3 } from '../helpers/search-helpers';

jest.mock('../../../lib/client');


type HashSearch = Search<SimpleHashEntity> | RawSearch<SimpleHashEntity>;
type JsonSearch = Search<SimpleJsonEntity> | RawSearch<SimpleJsonEntity>;

beforeEach(() => {
  mocked(Client).mockReset();
  mocked(Client.prototype.search).mockReset();
});

describe.each([
  [ "FluentSearch",
    new Search<SimpleHashEntity>(simpleHashSchema, new Client()) ],
  [ "RawSearch",
    new RawSearch<SimpleHashEntity>(simpleHashSchema, new Client()) ]
])("%s", (_, hashSearch: HashSearch) => {

  describe("#returnPageKeys", () => {

    describe("when running against hashes", () => {
      let keys: string[];
      let indexName = 'SimpleHashEntity:index', query = '*';

      describe("when querying no results", () => {
        beforeEach(async () => {
          mockClientSearchToReturnNothing();
          keys = await hashSearch.return.pageKeys(0, 5);
        });

        it("askes the client for results", () => {
          expect(Client.prototype.search).toHaveBeenCalledTimes(1);
          expect(Client.prototype.search).toHaveBeenCalledWith({
            indexName, query, limit: { offset: 0, count: 5 }, keysOnly: true });
        });

        it("returns no results", () => expect(keys).toHaveLength(0));
      });

      describe("when querying a single result", () => {
        beforeEach(async () => {
          mockClientSearchToReturnSingleKey();
          keys = await hashSearch.return.pageKeys(0, 5);
        });

        it("askes the client for results", () => {
          expect(Client.prototype.search).toHaveBeenCalledTimes(1);
          expect(Client.prototype.search).toHaveBeenCalledWith({
            indexName, query, limit: { offset: 0, count: 5 }, keysOnly: true });
        });

        it("returns the expected single result", () => {
          expect(keys).toHaveLength(1);
          expect(keys).toEqual(expect.arrayContaining([
            `SimpleHashEntity:${SIMPLE_ENTITY_1.entityId}`
          ]));
        });
      });

      describe("when querying multiple results", () => {
        beforeEach(async () => {
          mockClientSearchToReturnMultipleKeys();
          keys = await hashSearch.return.pageKeys(0, 5);
        });

        it("askes the client for results", () => {
          expect(Client.prototype.search).toHaveBeenCalledTimes(1);
          expect(Client.prototype.search).toHaveBeenCalledWith({
            indexName, query, limit: { offset: 0, count: 5 }, keysOnly: true });
        });

        it("returns all the results", async () => {
          expect(keys).toHaveLength(3);
          expect(keys).toEqual(expect.arrayContaining([
            `SimpleHashEntity:${SIMPLE_ENTITY_1.entityId}`,
            `SimpleHashEntity:${SIMPLE_ENTITY_2.entityId}`,
            `SimpleHashEntity:${SIMPLE_ENTITY_3.entityId}`
          ]));
        });
      });
    });
  });
});
