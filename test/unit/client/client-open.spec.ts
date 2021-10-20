import { mocked } from 'ts-jest/utils';

import RedisShim from '../../../src/redis/redis-shim';
import Client from '../../../src/client';

jest.mock('../../../src/redis/redis-shim');


beforeEach(() => mocked(RedisShim).mockReset());

describe("Client", () => {

  let client: Client;

  beforeEach(async () => client = new Client());

  describe("#open", () => {
    describe("when called without a url", () => {
      beforeEach(async () => await client.open());

      it("constructs a new RedisShim", () => expect(RedisShim).toHaveBeenCalled());
      it("opens the shim with the default url", async () =>
        expect(RedisShim.prototype.open).toHaveBeenCalledWith('redis://localhost:6379'));
    });

    describe("when called with a url", () => {
      beforeEach(async () => await client.open('foo'));

      it("constructs a new RedisShim", () => expect(RedisShim).toHaveBeenCalled());
      it("opens the shim with the default url", async () =>
        expect(RedisShim.prototype.open).toHaveBeenCalledWith('foo'));
    });

    describe("when called on an already open client", () => {
      beforeEach(async () => await client.open('foo'));

      it("errors when called on an open client", async () =>
        expect(async () => await client.open())
          .rejects.toThrow("Redis connection is already open."));
    });
  });
});
