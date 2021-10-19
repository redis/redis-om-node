import { mocked } from 'ts-jest/utils';

import RedisShim from '../../lib/redis/redis-shim';
import Client from '../../lib/client';

jest.mock('../../lib/redis/redis-shim');


beforeEach(() => mocked(RedisShim).mockReset());

describe("Client", () => {

  let client: Client;

  beforeEach(async () => client = new Client());

  describe("#search", () => {
    describe("when called on an open client", () => {
      beforeEach(async () => {
        await client.open();
      });

      it("passes the command to the shim with specified limits", async () => {
        await client.search('index', 'query', 0, 5);
        expect(RedisShim.prototype.execute).toHaveBeenCalledWith([ 'FT.SEARCH', 'index', 'query', 'LIMIT', '0', '5' ]);
      });
    });

    describe("when called on a closed client", () => {
      beforeEach(async () => {
        await client.open();
        await client.close();
      });
      
      it("errors when called on a closed client", () => 
        expect(async () => await client.search('index', 'query', 0, 10))
          .rejects.toThrow("Redis connection needs opened."));
    });
    
    it("errors when called on a new client", async () =>
      expect(async () => await client.search('index', 'query', 0, 10))
        .rejects.toThrow("Redis connection needs opened."));
  });
});
