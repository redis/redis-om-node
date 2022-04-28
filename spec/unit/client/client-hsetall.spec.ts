import { mocked } from 'jest-mock';

import RedisShim from '../../../lib/shims/redis-shim';
import Client from '../../../lib/client';

jest.mock('../../../lib/shims/redis-shim');


beforeEach(() => mocked(RedisShim).mockReset());

describe("Client", () => {

  let client: Client;

  beforeEach(async () => client = new Client());

  describe("#hsetall", () => {
    describe("when called on an open client", () => {
      beforeEach(async () => {
        await client.open();
      });

      it("passes the command to the shim", async () => {
        await client.hsetall('foo', { foo: 'bar', baz: 'qux' });
        expect(RedisShim.prototype.hsetall).toHaveBeenCalledWith('foo', { foo: 'bar', baz: 'qux' });
      });
    });

    describe("when called on a closed client", () => {
      beforeEach(async () => {
        await client.open();
        await client.close();
      });

      it("errors when called on a closed client", () =>
        expect(async () => await client.hsetall('foo', { foo: 'bar', baz: 'qux' }))
          .rejects.toThrow("Redis connection needs to be open."));
    });

    it("errors when called on a new client", async () =>
      expect(async () => await client.hsetall('foo', { foo: 'bar', baz: 'qux' }))
        .rejects.toThrow("Redis connection needs to be open."));
  });
});
