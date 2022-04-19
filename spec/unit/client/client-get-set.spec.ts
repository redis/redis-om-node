import { mocked } from 'jest-mock';

import RedisShim from '../../../lib/shims/redis-shim';
import Client from '../../../lib/client';

jest.mock('../../../lib/shims/redis-shim');


beforeEach(() => mocked(RedisShim).mockReset());

describe("Client", () => {

  let client: Client;
  let result: string | null;

  beforeEach(async () => client = new Client());

  describe("#get", () => {
    describe("when called on an open client", () => {
      beforeEach(async () => await client.open());

      describe("and the result is a string", () => {
        beforeEach(async () => {
          mocked(RedisShim.prototype.get).mockResolvedValue('bar');
          result = await client.get('foo');
        });

        it("passes the command to the shim", async () => {
          expect(RedisShim.prototype.get).toHaveBeenCalledWith('foo');
        });

        it("returns the result", async () => expect(result).toBe('bar'));
      });

      describe("and the result is null", () => {
        beforeEach(async () => {
          mocked(RedisShim.prototype.get).mockResolvedValue(null);
          result = await client.get('foo');
        });

        it("passes the command to the shim", async () => {
          expect(RedisShim.prototype.get).toHaveBeenCalledWith('foo');
        });

        it("returns the result", async () => expect(result).toBeNull());
      });
    });

    describe("when called on a closed client", () => {
      beforeEach(async () => {
        await client.open();
        await client.close();
      });

      it("errors when called on a closed client", () =>
        expect(async () => await client.get('foo'))
          .rejects.toThrow("Redis connection needs to be open."));
    });

    it("errors when called on a new client", async () =>
      expect(async () => await client.get('foo'))
        .rejects.toThrow("Redis connection needs to be open."));
  });

  describe("#set", () => {
    describe("when called on an open client", () => {
      beforeEach(async () => {
        await client.open();
        await client.set('foo', 'bar');
      });

      it("passes the command to the shim", async () => {
        expect(RedisShim.prototype.set).toHaveBeenCalledWith('foo', 'bar');
      });
    });

    describe("when called on a closed client", () => {
      beforeEach(async () => {
        await client.open();
        await client.close();
      });

      it("errors when called on a closed client", () =>
        expect(async () => await client.set('foo', 'bar'))
          .rejects.toThrow("Redis connection needs to be open."));
    });

    it("errors when called on a new client", async () =>
      expect(async () => await client.set('foo', 'bar'))
        .rejects.toThrow("Redis connection needs to be open."));
  });

});
