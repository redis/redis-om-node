import { mocked } from 'jest-mock';

import Client from "../../../lib/client";
import { Search, RawSearch } from "../../../lib/search/search";

import { simpleHashSchema, SimpleHashEntity } from "../helpers/test-entity-and-schema";
import { mockClientSearchToReturnNothing, mockClientSearchToReturnSingleKey,
  SIMPLE_ENTITY_1 } from '../helpers/search-helpers';

jest.mock('../../../lib/client');
jest.mock('../../../lib/shims/logger')


type HashSearch = Search<SimpleHashEntity> | RawSearch<SimpleHashEntity>;

beforeEach(() => {
  mocked(Client).mockReset();
  mocked(Client.prototype.search).mockReset();
});

describe.each([
  [ "FluentSearch",
    new Search<SimpleHashEntity>(simpleHashSchema, new Client()) ],
  [ "RawSearch",
    new RawSearch<SimpleHashEntity>(simpleHashSchema, new Client()) ]
])("%s", (_, search: HashSearch) => {

  describe("#returnMinId", () => {
    let id: string | null;
    let indexName = 'SimpleHashEntity:index', query = '*';

    describe("when querying no results", () => {
      beforeEach( async () => {
        mockClientSearchToReturnNothing();
        id = await search.return.minId('aNumber');
      });

      it("asks the client for the first result of a given repository", () => {
        expect(Client.prototype.search).toHaveBeenCalledTimes(1);
        expect(Client.prototype.search).toHaveBeenCalledWith({
          indexName,
          query,
          limit: { offset: 0, count: 1 },
          sort: { field: 'aNumber', order: 'ASC' },
          keysOnly: true
        });
      });

      it("return no result", () => expect(id).toBe(null));
    });

    describe("when getting a result", () => {
      beforeEach(async () => {
        mockClientSearchToReturnSingleKey();
        id = await search.return.minId('aNumber');
      });

      it("asks the client for the first result of a given repository", () => {
        expect(Client.prototype.search).toHaveBeenCalledTimes(1)
        expect(Client.prototype.search).toHaveBeenCalledWith({
          indexName,
          query,
          limit: { offset: 0, count: 1 },
          sort: { field: 'aNumber', order: 'ASC' },
          keysOnly: true
        });
      });

      it("returns the first result of a given repository", () => {
        expect(id).toEqual(SIMPLE_ENTITY_1.entityId);
      });
    });
  });
});
