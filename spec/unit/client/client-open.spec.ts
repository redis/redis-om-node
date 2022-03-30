import { mocked } from 'jest-mock';

import RedisShim from '../../../lib/shims/redis-shim';
import Client from '../../../lib/client';

jest.mock('../../../lib/shims/redis-shim');


beforeEach(() => mocked(RedisShim).mockReset());

describe("Client", () => {

  let client: Client, self: Client;

  beforeEach(() => client = new Client());

  describe("#open", () => {
    describe("when not called", () => {
      it("is not open", () => {
        expect(client.isOpen()).toBe(false);
      });
    })

    describe("when called without a url", () => {
      beforeEach(async () => self = await client.open());

      it("constructs a new RedisShim with the default url", () => {
        expect(RedisShim).toHaveBeenCalledWith('redis://localhost:6379');
      });

      it("opens the shim", async () => {
        expect(RedisShim.prototype.open).toHaveBeenCalled();
      });
      
      it("is open", () => {
        expect(client.isOpen()).toBe(true);
      });

      it("returns itself", async () => {
        expect(self).toBe(client);
      });

      describe("when trying to call it again", () => {
        beforeEach(async () => self = await client.open());

        it("doesn't reconstruct a RedisShim", () => {
          expect(RedisShim).toBeCalledTimes(1);
        });
  
        it("doesn't open the shim again", async () => {
          expect(RedisShim.prototype.open).toBeCalledTimes(1);
        });
  
        it("returns itself", async () => {
          expect(self).toBe(client);
        });
      });
    });

    describe("when called with a url", () => {
      beforeEach(async () => self = await client.open('foo'));

      it("constructs a new RedisShim with the provided url", () => {
        expect(RedisShim).toHaveBeenCalledWith('foo')
      });
      
      it("opens the shim", async () => {
        expect(RedisShim.prototype.open).toHaveBeenCalled();
      });

      it("is open", () => {
        expect(client.isOpen()).toBe(true);
      });

      it("returns itself", async () => {
        expect(self).toBe(client);
      });

      describe("when trying to call it again", () => {
        beforeEach(async () => self = await client.open('foo'));

        it("doesn't reconstruct a RedisShim", () => {
          expect(RedisShim).toBeCalledTimes(1);
        });
  
        it("doesn't open the shim again", async () => {
          expect(RedisShim.prototype.open).toBeCalledTimes(1);
        });
  
        it("returns itself", async () => {
          expect(self).toBe(client);
        });
      });
    });
  });
});
