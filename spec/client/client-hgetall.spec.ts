import { mocked } from 'ts-jest/utils';

import RedisShim from '../../lib/redis/redis-shim';
import Client from '../../lib/client';

jest.mock('../../lib/redis/redis-shim');


beforeEach(() => mocked(RedisShim).mockReset());

describe("Client", () => {

  let client: Client;

  beforeEach(async () => client = new Client());

  describe("#hgetall", () => {
    describe("when called on an open client", () => {
      beforeEach(async () => {
        await client.open();
      });

      it("passes the command to the shim", async () => {
        await client.hgetall('foo');
        expect(RedisShim.prototype.hgetall).toHaveBeenCalledWith('foo');
      });
    });

    describe("when called on a closed client", () => {
      beforeEach(async () => {
        await client.open();
        await client.close();
      });
      
      it("errors when called on a closed client", () => 
        expect(async () => await client.hgetall('foo'))
          .rejects.toThrow("Redis connection needs opened."));
    });
    
    it("errors when called on a new client", async () =>
      expect(async () => await client.hgetall('foo'))
        .rejects.toThrow("Redis connection needs opened."));
  });
});
