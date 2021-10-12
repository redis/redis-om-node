import { mocked } from 'ts-jest/utils';

import RedisShim from '../../lib/redis/redis-shim';
import Client from '../../lib/client';

jest.mock('../../lib/redis/redis-shim');


beforeEach(() => mocked(RedisShim).mockReset());

describe("Client", () => {

  let client: Client;

  beforeEach(async () => client = new Client());

  describe("#close", () => {
    describe("when called on an open client", () => {
      beforeEach(async () => {
        await client.open();
        await client.close();
      });
      
      it("closes the shim", () => expect(RedisShim.prototype.close).toHaveBeenCalled());
    });

    describe("when called on an already closed client", () => {
      beforeEach(async () => {
        await client.open();
        await client.close();
      });
      
      it("errors when called on a closed client", () => 
        expect(async () => await client.close())
          .rejects.toThrow("Redis connection needs opened."));
    });
    
    it("errors when called on a new client", async () =>
      expect(async () => await client.close())
        .rejects.toThrow("Redis connection needs opened."));
  });
});
