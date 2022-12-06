import { redis } from '../helpers/mock-redis'
import { Client } from '$lib/client'


describe("Client", () => {

  let client: Client

  beforeEach(() => { client = new Client() })

  describe("#execute", () => {
    describe("when called on an open client", () => {
      beforeEach(async () => {
        await client.open()
      })

      it("passes the command to redis", async () => {
        await client.execute(['foo', 'bar', 'baz'])
        expect(redis.sendCommand).toHaveBeenCalledWith(['foo', 'bar', 'baz'])
      })

      it("transforms numbers to strings before giving them to redis", async () => {
        await client.execute([1, 2, 3])
        expect(redis.sendCommand).toHaveBeenCalledWith(['1', '2', '3'])
      })

      it("transforms booleans to strings before giving them to redis", async () => {
        await client.execute([true, false, true])
        expect(redis.sendCommand).toHaveBeenCalledWith(['1', '0', '1'])
      })

      it("returns what redis returns", async () => {
        redis.sendCommand.mockReturnValue('foo')
        let result = <string>await client.execute(['foo', 'bar', 'baz'])
        expect(result).toBe('foo')
      })
    })

    describe("when called on a closed client", () => {
      beforeEach(async () => {
        await client.open()
        await client.close()
      })

      it("errors when called on a closed client", () =>
        expect(async () => await client.execute(['foo', 'bar', 'baz']))
          .rejects.toThrow("Redis connection needs to be open."))
    })

    it("errors when called on a new client", async () =>
      expect(async () => await client.execute(['foo', 'bar', 'baz']))
        .rejects.toThrow("Redis connection needs to be open."))
  })
})
