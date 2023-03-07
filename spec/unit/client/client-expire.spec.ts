import '../../helpers/custom-matchers'

import { redis } from '../helpers/mock-redis'

import { Client } from '$lib/client'
import { RedisOmError } from '$lib/error'

describe("Client", () => {

  let client: Client

  beforeEach(() => { client = new Client() })

  describe("#expire", () => {
    describe("when called on an open client", () => {
      beforeEach(async () => {
        await client.open()
      })

      it("passes the command to redis", async () => {
        await client.expire('foo', 60)
        expect(redis.expire).toHaveBeenCalledWith('foo', 60)
      })
    })

    describe("when called on a closed client", () => {
      beforeEach(async () => {
        await client.open()
        await client.close()
      })

      it("errors when called on a closed client", () =>
        expect(async () => await client.expire('foo', 60))
          .rejects.toThrowErrorOfType(RedisOmError, "Redis connection needs to be open."))
    })

    it("errors when called on a new client", async () =>
      expect(async () => await client.expire('foo', 60))
        .rejects.toThrowErrorOfType(RedisOmError, "Redis connection needs to be open."))
  })
})
