import '../../helpers/custom-matchers'

import { redis, multi } from '../helpers/mock-redis'

import { Client } from '$lib/client'
import { RedisOmError } from '$lib/error'

describe("Client", () => {

  let client: Client

  beforeEach(() => { client = new Client() })

  describe("#hsetall", () => {
    describe("when called on an open client", () => {
      beforeEach(async () => {
        await client.open()
      })

      it("passes the command to redis", async () => {
        // it's a bit of an ugly mirror but will do
        await client.hsetall('foo', { foo: 'bar', baz: 'qux' })
        expect(redis.multi).toHaveBeenCalled()
        expect(multi.unlink).toHaveBeenCalledWith('foo')
        expect(multi.hSet).toHaveBeenCalledWith('foo', { foo: 'bar', baz: 'qux' })
        expect(multi.exec).toHaveBeenCalled()
      })
    })

    describe("when called on a closed client", () => {
      beforeEach(async () => {
        await client.open()
        await client.close()
      })

      it("errors when called on a closed client", () =>
        expect(async () => await client.hsetall('foo', { foo: 'bar', baz: 'qux' }))
          .rejects.toThrowErrorOfType(RedisOmError, "Redis connection needs to be open."))
    })

    it("errors when called on a new client", async () =>
      expect(async () => await client.hsetall('foo', { foo: 'bar', baz: 'qux' }))
        .rejects.toThrowErrorOfType(RedisOmError, "Redis connection needs to be open."))
  })
})
