import '../../helpers/custom-matchers'

import { redis } from '../helpers/mock-redis'

import { Client } from '$lib/client'
import { RedisOmError } from '$lib/error'

describe("Client", () => {

  let client: Client

  beforeEach(() => { client = new Client() })

  describe("#unlink", () => {
    describe("when called on an open client", () => {
      beforeEach(async () => {
        await client.open()
      })

      it("doesn't call redis when passed no keys", async () => {
        await client.unlink()
        expect(redis.unlink).not.toHaveBeenCalled()
      })

      it("passes a single key to redis", async () => {
        await client.unlink('foo')
        expect(redis.unlink).toHaveBeenCalledWith(expect.arrayContaining(['foo']))
      })

      it("passes multiple keys to redis", async () => {
        await client.unlink('foo', 'bar', 'baz')
        expect(redis.unlink).toHaveBeenCalledWith(expect.arrayContaining(['foo', 'bar', 'baz']))
      })
    })

    describe("when called on a closed client", () => {
      beforeEach(async () => {
        await client.open()
        await client.close()
      })

      it("errors when called on a closed client", () =>
        expect(async () => await client.unlink('foo'))
          .rejects.toThrowErrorOfType(RedisOmError, "Redis connection needs to be open."))
    })

    it("errors when called on a new client", async () =>
      expect(async () => await client.unlink('foo'))
        .rejects.toThrowErrorOfType(RedisOmError, "Redis connection needs to be open."))
  })
})
