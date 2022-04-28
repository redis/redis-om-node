import { mocked } from 'jest-mock';

import RedisShim from '../../../lib/shims/redis-shim';
import Client from '../../../lib/client';

jest.mock('../../../lib/shims/redis-shim');


beforeEach(() => mocked(RedisShim).mockReset());

describe("Client", () => {

  let client: Client;

  beforeEach(async () => client = new Client());

  describe("#execute", () => {
    describe("when called on an open client", () => {
      beforeEach(async () => {
        await client.open();
      });

      it("passes the command to the shim", async () => {
        await client.execute(['foo', 'bar', 'baz']);
        expect(RedisShim.prototype.execute).toHaveBeenCalledWith(['foo', 'bar', 'baz']);
      });

      it("transforms numbers to strings before giving them to the shim", async () => {
        await client.execute([1, 2, 3]);
        expect(RedisShim.prototype.execute).toHaveBeenCalledWith(['1', '2', '3']);
      });

      it("transforms booleans to strings before giving them to the shim", async () => {
        await client.execute([true, false, true]);
        expect(RedisShim.prototype.execute).toHaveBeenCalledWith(['1', '0', '1']);
      });

      it("returns what the shim returns", async () => {
        mocked(RedisShim.prototype.execute).mockResolvedValue('foo');
        let result = <string>await client.execute(['foo', 'bar', 'baz']);
        expect(result).toBe('foo');
      });
    });

    describe("when called on a closed client", () => {
      beforeEach(async () => {
        await client.open();
        await client.close();
      });

      it("errors when called on a closed client", () =>
        expect(async () => await client.execute(['foo', 'bar', 'baz']))
          .rejects.toThrow("Redis connection needs to be open."));
    });

    it("errors when called on a new client", async () =>
      expect(async () => await client.execute(['foo', 'bar', 'baz']))
        .rejects.toThrow("Redis connection needs to be open."));
  });
});
