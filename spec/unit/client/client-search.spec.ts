import { mocked } from 'jest-mock';

import RedisShim from '../../../lib/shims/redis-shim';
import Client from '../../../lib/client';

jest.mock('../../../lib/shims/redis-shim');


beforeEach(() => mocked(RedisShim).mockReset());

describe("Client", () => {

  let client: Client;

  beforeEach(async () => client = new Client());

  describe("#search", () => {
    describe("when called on an open client", () => {
      beforeEach(async () => {
        await client.open();
      });

      it("passes a command with neither limit nor sort options to the shim", async () => {
        await client.search({
          indexName: 'index',
          query: 'query'
        });
        expect(RedisShim.prototype.execute).toHaveBeenCalledWith([
          'FT.SEARCH', 'index', 'query']);
      });

      it("passes a command without sort options to the shim", async () => {
        await client.search({
          indexName: 'index',
          query: 'query',
          limit: { offset: 0, count: 5 }
        });
        expect(RedisShim.prototype.execute).toHaveBeenCalledWith([
          'FT.SEARCH', 'index', 'query', 'LIMIT', '0', '5']);
      });

      it("passes a command without limit options to the shim", async () => {
        await client.search({
          indexName: 'index',
          query: 'query',
          sort: { field: 'sortField', order: 'ASC' }
        });
        expect(RedisShim.prototype.execute).toHaveBeenCalledWith([
          'FT.SEARCH', 'index', 'query', 'SORTBY', 'sortField', 'ASC']);
      });

      it("passes a command with limit and sort options to the shim", async () => {
        await client.search({
          indexName: 'index',
          query: 'query',
          limit: { offset: 0, count: 5 },
          sort: { field: 'sortField', order: 'ASC' }
        });
        expect(RedisShim.prototype.execute).toHaveBeenCalledWith([
          'FT.SEARCH', 'index', 'query', 'LIMIT', '0', '5', 'SORTBY', 'sortField', 'ASC']);
      });
    });

    describe("when called on an unopened client", () => {
      it("throws an error", async () =>
        expect(async () => await client.search({ indexName: 'index', query: 'query' }))
          .rejects.toThrow("Redis connection needs to be open."));
    });

    describe("when called on a closed client", () => {
      beforeEach(async () => {
        await client.open();
        await client.close();
      });

      it("throws an error", () =>
        expect(async () => await client.search({ indexName: 'index', query: 'query' }))
          .rejects.toThrow("Redis connection needs to be open."));
    });
  });
});
