import { mocked } from 'jest-mock';

import RedisShim from '../../../lib/shims/redis-shim';
import Client from '../../../lib/client';

jest.mock('../../../lib/shims/redis-shim');


beforeEach(() => mocked(RedisShim).mockReset());

describe("Client", () => {

  let client: Client;

  beforeEach(async () => client = new Client());

  describe("#createIndex", () => {
    describe("when called on an open client", () => {
      beforeEach(async () => {
        await client.open();
      });

      it("passes a command to the shim", async () => {
        await client.createIndex({
          indexName: 'index', dataStructure: 'HASH', prefix: 'prefix',
          schema: ['foo', 'bar', 'baz']
        });
        expect(RedisShim.prototype.execute).toHaveBeenCalledWith([
          'FT.CREATE', 'index',
          'ON', 'HASH',
          'PREFIX', '1', 'prefix',
          'SCHEMA', 'foo', 'bar', 'baz'
        ]);
      });

      it("passes a command with stop words to the shim", async () => {
        await client.createIndex({
          indexName: 'index', dataStructure: 'HASH', prefix: 'prefix',
          schema: ['foo', 'bar', 'baz'], stopWords: ['bar', 'baz', 'qux']
        });
        expect(RedisShim.prototype.execute).toHaveBeenCalledWith([
          'FT.CREATE', 'index',
          'ON', 'HASH',
          'PREFIX', '1', 'prefix',
          'STOPWORDS', '3', 'bar', 'baz', 'qux',
          'SCHEMA', 'foo', 'bar', 'baz'
        ]);
      });

      it("passes a command with zero stop words to the shim", async () => {
        await client.createIndex({
          indexName: 'index', dataStructure: 'HASH', prefix: 'prefix',
          schema: ['foo', 'bar', 'baz'], stopWords: []
        });
        expect(RedisShim.prototype.execute).toHaveBeenCalledWith([
          'FT.CREATE', 'index',
          'ON', 'HASH',
          'PREFIX', '1', 'prefix',
          'STOPWORDS', '0',
          'SCHEMA', 'foo', 'bar', 'baz'
        ]);
      });
    });

    describe("when called on a closed client", () => {
      beforeEach(async () => {
        await client.open();
        await client.close();
      });

      it("errors when called on a closed client", () =>
        expect(async () => await client.createIndex({
          indexName: 'index', dataStructure: 'HASH', prefix: 'prefix',
          schema: ['foo', 'bar', 'baz']
        }))
          .rejects.toThrow("Redis connection needs to be open."));
    });

    it("errors when called on a new client", async () =>
      expect(async () => await client.createIndex({
        indexName: 'index', dataStructure: 'HASH', prefix: 'prefix',
        schema: ['foo', 'bar', 'baz']
      }))
        .rejects.toThrow("Redis connection needs to be open."));
  });
});
