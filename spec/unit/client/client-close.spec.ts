import { mocked } from 'jest-mock';

import RedisShim from '../../../lib/shims/redis-shim';
import Client from '../../../lib/client';

jest.mock('../../../lib/shims/redis-shim');


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
      
      it("closes the shim", () => {
        expect(RedisShim.prototype.close).toHaveBeenCalled();
        expect(client.isOpen()).toBe(false);
      });
    });

    describe("when called on an already closed client", () => {
      beforeEach(async () => {
        await client.open();
        await client.close();
      });
      
      it("happily closes it anyways", async () => {
        await client.close();
        expect(client.isOpen()).toBe(false);
      });
    });
    
    it("happily closes an unopened client", async () => {
      await client.close();
      expect(client.isOpen()).toBe(false);
    });
  });
});
