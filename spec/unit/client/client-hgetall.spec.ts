import { mocked } from 'jest-mock';

import RedisShim from '../../../lib/shims/redis-shim';
import Client from '../../../lib/client';

jest.mock('../../../lib/shims/redis-shim');


beforeEach(() => mocked(RedisShim).mockReset());

describe("Client", () => {

  let client: Client;
  let result: { [key: string]: string };

  beforeEach(async () => client = new Client());

  describe("#hgetall", () => {
    describe("when called on an open client", () => {
      beforeEach(async () => {
        await client.open();
        mocked(RedisShim.prototype.hgetall).mockResolvedValue({ foo: 'bar', baz: 'qux' });
        result = await client.hgetall('foo');
      });

      it("passes the command to the shim", async () => {
        expect(RedisShim.prototype.hgetall).toHaveBeenCalledWith('foo');
      });

      it("returns the value from the shim", async () => {
        expect(result).toEqual({ foo: 'bar', baz: 'qux' });
      });
    });

    describe("when called on a closed client", () => {
      beforeEach(async () => {
        await client.open();
        await client.close();
      });

      it("errors when called on a closed client", () =>
        expect(async () => await client.hgetall('foo'))
          .rejects.toThrow("Redis connection needs to be open."));
    });

    it("errors when called on a new client", async () =>
      expect(async () => await client.hgetall('foo'))
        .rejects.toThrow("Redis connection needs to be open."));
  });
});
