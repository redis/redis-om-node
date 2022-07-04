import { redis, commandOptions } from '../helpers/mock-redis'
import { Client, RedisHashData } from '$lib/client';


describe("Client", () => {

  let client: Client;
  let result: RedisHashData

  beforeEach(() => {
    client = new Client()
  });

  describe("#hgetall", () => {
    describe("when called on an open client", () => {
      beforeEach(async () => {
        await client.open();
        redis.hGetAll.mockResolvedValue({ foo: 'bar', baz: 'qux' });
        result = await client.hgetall('foo');
      });

      it("passes the command to redis", async () => {
        expect(redis.hGetAll).toHaveBeenCalledWith(commandOptions({ returnBuffers: true }), 'foo');
      });

      it("returns the value from redis", async () => {
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
