import { redis } from '../helpers/mock-redis'
import { Client } from '$lib/client';


describe("Client", () => {

  let client: Client;

  beforeEach(() => {
    client = new Client()
  });

  describe("#jsonset", () => {
    describe("when called on an open client", () => {
      beforeEach(async () => {
        await client.open();
        await client.jsonset('foo', { foo: 'bar', bar: 42, baz: true, qux: null });
      });

      it("passes the command to redis", async () => {
        expect(redis.sendCommand).toHaveBeenCalledWith([
          'JSON.SET', 'foo', '.', '{"foo":"bar","bar":42,"baz":true,"qux":null}']);
      });
    });

    describe("when called on a closed client", () => {
      beforeEach(async () => {
        await client.open();
        await client.close();
      });

      it("errors when called on a closed client", () =>
        expect(async () => await client.jsonget('foo'))
          .rejects.toThrow("Redis connection needs to be open."));
    });

    it("errors when called on a new client", async () =>
      expect(async () => await client.jsonget('foo'))
        .rejects.toThrow("Redis connection needs to be open."));
  });
});
