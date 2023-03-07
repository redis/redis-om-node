import '../../helpers/custom-matchers'

import { redis } from '../helpers/mock-redis'

import { Client } from '$lib/client'
import { RedisOmError } from '$lib/error'

describe("Client", () => {

  let client: Client
  let result: { [key: string]: string }

  beforeEach(() => { client = new Client() })

  describe("#hgetall", () => {
    describe("when called on an open client", () => {
      beforeEach(async () => {
        await client.open()
        redis.hGetAll.mockResolvedValue({ foo: 'bar', baz: 'qux' })
        result = await client.hgetall('foo')
      })

      it("passes the command to redis", async () => {
        expect(redis.hGetAll).toHaveBeenCalledWith('foo')
      })

      it("returns the value from redis", async () => {
        expect(result).toEqual({ foo: 'bar', baz: 'qux' })
      })
    })

    describe("when called on a closed client", () => {
      beforeEach(async () => {
        await client.open()
        await client.close()
      })

      it("errors when called on a closed client", () =>
        expect(async () => await client.hgetall('foo'))
          .rejects.toThrowErrorOfType(RedisOmError, "Redis connection needs to be open."))
    })

    it("errors when called on a new client", async () =>
      expect(async () => await client.hgetall('foo'))
        .rejects.toThrowErrorOfType(RedisOmError, "Redis connection needs to be open."))
  })
})
