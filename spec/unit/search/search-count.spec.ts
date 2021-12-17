import { mocked } from 'ts-jest/utils';

import Client from "../../../lib/client";
import Search from "../../../lib/search/search";

import { simpleHashSchema, SimpleHashEntity, SimpleJsonEntity, simpleJsonSchema } from "../helpers/test-entity-and-schema";
import { mockClientSearchToReturnCountOf } from "../helpers/search-helpers";

jest.mock('../../../lib/client');


beforeEach(() => mocked(Client).mockReset());
beforeEach(() => mocked(Client.prototype.search).mockReset());

describe("Search", () => {
  let client: Client;
  let actualCount: number;

  describe("#count", () => {
    let query = '*', offset = 0, count = 0

    beforeAll(() => client = new Client());

    describe("when counting results from hashes", () => {
      let search: Search<SimpleHashEntity>;

      beforeEach(async () => {
        mockClientSearchToReturnCountOf(3);
        search = new Search<SimpleHashEntity>(simpleHashSchema, client)
        actualCount = await search.count();
      });

      it("askes the client for results", () => {
        expect(Client.prototype.search).toHaveBeenCalledTimes(1);
        expect(Client.prototype.search).toHaveBeenCalledWith({
          indexName: 'SimpleHashEntity:index', query, offset, count });
      });

      it("returns the expected count", () => expect(actualCount).toBe(3));
    });

    describe("when running against JSON objects", () => {
      let search: Search<SimpleJsonEntity>;

      beforeEach(async () => {
        mockClientSearchToReturnCountOf(3);
        search = new Search<SimpleJsonEntity>(simpleJsonSchema, client);
        actualCount = await search.count();
      });

      it("askes the client for results", () => {
        expect(Client.prototype.search).toHaveBeenCalledTimes(1);
        expect(Client.prototype.search).toHaveBeenCalledWith({
          indexName: 'SimpleJsonEntity:index', query, offset, count });
      });
  
      it("returns the expected count", () => expect(actualCount).toBe(3));
    });
  });
});
