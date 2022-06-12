import { redis, createClient } from '../helpers/mock-redis'
import Client from '../../../lib/client';

const BOGUS_CONNECTION = { THIS_IS_NOT: 'a real connection' };


beforeEach(() => jest.clearAllMocks());

describe("Client", () => {

  let client: Client, self: Client;

  beforeEach(() => client = new Client());

  describe("#use", () => {
    describe("when not called", () => {
      it("is not open", () => {
        expect(client.isOpen()).toBe(false);
      });
    })

    describe("when called", () => {
      // @ts-ignore: no way to call createClient without actually connecting to Redis
      beforeEach(async () => self = await client.use(BOGUS_CONNECTION));

      it("constructs a new RedisShim with the connection", () => {
        expect(createClient).not.toHaveBeenCalled();
      });

      it("is open", () => {
        expect(client.isOpen()).toBe(true);
      });

      it("returns itself", async () => {
        expect(self).toBe(client);
      });
    });

    describe("when called on an open connection", () => {
      beforeEach(async () => {
        await client.open();
        // @ts-ignore: no way to call createClient without actually connecting to Redis
        self = await client.use(BOGUS_CONNECTION);
      });

      it("closes the existing shim", () => {
        expect(redis.quit).toHaveBeenCalled();
      })

      it("constructs a new RedisShim with the connection", () => {
        expect(createClient).not.toHaveBeenCalledWith();
      });

      it("is open", () => {
        expect(client.isOpen()).toBe(true);
      });

      it("returns itself", async () => {
        expect(self).toBe(client);
      });
    });
  });
});
