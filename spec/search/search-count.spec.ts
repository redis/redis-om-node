import { mocked } from 'ts-jest/utils';

import Client from "../../lib/client";
import Search from "../../lib/search/search";

import { simpleHashSchema, SimpleHashEntity, SimpleJsonEntity, simpleJsonSchema } from "../helpers/test-entity-and-schema";
import { mockClientSearchToReturnCountOf } from "../helpers/search-helpers";

jest.mock('../../lib/client');


beforeEach(() => mocked(Client).mockReset());
beforeEach(() => mocked(Client.prototype.search).mockReset());

describe("Search", () => {

  let client: Client;
  let count: number;

  describe("#count", () => {

    beforeAll(() => client = new Client());

    describe("when couting results from hashes", () => {
      let search: Search<SimpleHashEntity>;

      beforeEach(async () => {
        mockClientSearchToReturnCountOf(3);
        search = new Search<SimpleHashEntity>(simpleHashSchema, client)
        count = await search.count();
      });

      it("askes the client for results", () => {
        expect(Client.prototype.search).toHaveBeenCalledTimes(1);
        expect(Client.prototype.search).toHaveBeenCalledWith(
          'SimpleHashEntity:index', '*', 0, 0);
      });

      it("returns the expected count", () => expect(count).toBe(3));
    });

    describe("when running against JSON objects", () => {
      let search: Search<SimpleJsonEntity>;

      beforeEach(async () => {
        mockClientSearchToReturnCountOf(3);
        search = new Search<SimpleJsonEntity>(simpleJsonSchema, client)
        count = await search.count();
      });

      it("askes the client for results", () => {
        expect(Client.prototype.search).toHaveBeenCalledTimes(1);
        expect(Client.prototype.search).toHaveBeenCalledWith(
          'SimpleJsonEntity:index', '*', 0, 0);
      });

      it("returns the expected count", () => expect(count).toBe(3));
    });
  });
});
