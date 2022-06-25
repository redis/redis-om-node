import { redis } from '../helpers/mock-redis'
import { Client } from '../../../lib/client';


describe("Client", () => {

  let client: Client;

  beforeEach(() => {
    client = new Client()
  });

  describe("#close", () => {
    describe("when called on an open client", () => {
      beforeEach(async () => {
        client.open();
        client.close();
      });

      it("closes the connection", async () => {
        expect(redis.quit).toHaveBeenCalled();
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
