import { mocked } from 'jest-mock';

import RedisShim from '../../../lib/shims/redis-shim';
import Client from '../../../lib/client';

jest.mock('../../../lib/shims/redis-shim');


beforeEach(() => mocked(RedisShim).mockReset());

describe("Client", () => {

  let client: Client;
  let result: { [key: string]: any };

  beforeEach(async () => client = new Client());

  describe("#jsonget", () => {
    describe("when called on an open client", () => {
      beforeEach(async () => {
        await client.open();
        mocked(RedisShim.prototype.execute).mockResolvedValue('{ "foo": "bar", "bar": 42, "baz": true, "qux": null }');
        result = await client.jsonget('foo');
      });

      it("passes the command to the shim", async () => {
        expect(RedisShim.prototype.execute).toHaveBeenCalledWith(['JSON.GET', 'foo', '.']);
      });

      it("returns the JSON", async () => {
        expect(result).toEqual({ foo: 'bar', bar: 42, baz: true, qux: null });
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
