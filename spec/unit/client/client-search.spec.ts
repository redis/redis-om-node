import { redis } from '../helpers/mock-redis'
import { Client } from '../../../lib/client';


describe("Client", () => {

  let client: Client;

  beforeEach(() => {
    client = new Client()
  });

  describe("#search", () => {
    describe("when called on an open client", () => {
      beforeEach(async () => {
        await client.open();
      });

      it("sends the expect command when given minimal options", async () => {
        await client.search({
          indexName: 'index',
          query: 'query'
        });
        expect(redis.sendCommand).toHaveBeenCalledWith([
          'FT.SEARCH', 'index', 'query']);
      });

      it("sends the expect command when given a limit", async () => {
        await client.search({
          indexName: 'index',
          query: 'query',
          limit: { offset: 0, count: 5 }
        });
        expect(redis.sendCommand).toHaveBeenCalledWith([
          'FT.SEARCH', 'index', 'query', 'LIMIT', '0', '5']);
      });

      it("sends the expected command when given a sort", async () => {
        await client.search({
          indexName: 'index',
          query: 'query',
          sort: { field: 'sortField', order: 'ASC' }
        });
        expect(redis.sendCommand).toHaveBeenCalledWith([
          'FT.SEARCH', 'index', 'query', 'SORTBY', 'sortField', 'ASC']);
      });

      it("sends the expected command when keysOnly is set to false", async () => {
        await client.search({
          indexName: 'index',
          query: 'query',
          keysOnly: false
        });
        expect(redis.sendCommand).toHaveBeenCalledWith([
          'FT.SEARCH', 'index', 'query']);
      });

      it("sends the expected command when keysOnly is set to true", async () => {
        await client.search({
          indexName: 'index',
          query: 'query',
          keysOnly: true
        });
        expect(redis.sendCommand).toHaveBeenCalledWith([
          'FT.SEARCH', 'index', 'query', 'RETURN', '0']);
      });

      it("sends the expected command with all options", async () => {
        await client.search({
          indexName: 'index',
          query: 'query',
          limit: { offset: 0, count: 5 },
          sort: { field: 'sortField', order: 'ASC' },
          keysOnly: true
        });
        expect(redis.sendCommand).toHaveBeenCalledWith([
          'FT.SEARCH', 'index', 'query', 'LIMIT', '0', '5',
          'SORTBY', 'sortField', 'ASC', 'RETURN', '0']);
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
