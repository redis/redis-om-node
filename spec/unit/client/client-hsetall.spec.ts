import { redis } from '../helpers/mock-redis'
import { Client } from '$lib/client';


describe("Client", () => {

  let client: Client;

  beforeEach(() => {
    client = new Client()
  });

  describe("#hsetall", () => {
    describe("when called on an open client", () => {
      beforeEach(async () => {
        await client.open();
      });

      it("passes the command to redis", async () => {
        await client.hsetall('foo', { foo: 'bar', baz: 'qux' });
        expect(redis.executeIsolated).toHaveBeenCalled();
        // TODO: test full behavior of client calls
        // expect(redis.executeIsolated).toHaveBeenCalledWith('foo', { foo: 'bar', baz: 'qux' });
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
