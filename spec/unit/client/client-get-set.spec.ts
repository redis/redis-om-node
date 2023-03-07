import '../../helpers/custom-matchers'

import { redis } from '../helpers/mock-redis'

import { Client } from '$lib/client'
import { RedisOmError } from '$lib/error'

describe("Client", () => {

  let client: Client
  let result: string | null

  beforeEach(() => { client = new Client() })

  describe("#get", () => {
    describe("when called on an open client", () => {
      beforeEach(async () => {
        await client.open()
      })

      describe("and the result is a string", () => {
        beforeEach(async () => {
          redis.get.mockReturnValue('bar')
          result = await client.get('foo')
        })

        it("passes the command to redis", async () => {
          expect(redis.get).toHaveBeenCalledWith('foo')
        })

        it("returns the result", async () => expect(result).toBe('bar'))
      })

      describe("and the result is null", () => {
        beforeEach(async () => {
          redis.get.mockResolvedValue(null)
          result = await client.get('foo')
        })

        it("passes the command to redis", async () => {
          expect(redis.get).toHaveBeenCalledWith('foo')
        })

        it("returns the result", async () => expect(result).toBeNull())
      })
    })

    describe("when called on a closed client", () => {
      beforeEach(async () => {
        await client.open()
        await client.close()
      })

      it("errors when called on a closed client", () =>
        expect(async () => await client.get('foo'))
          .rejects.toThrowErrorOfType(RedisOmError, "Redis connection needs to be open."))
    })

    it("errors when called on a new client", async () =>
      expect(async () => await client.get('foo'))
        .rejects.toThrowErrorOfType(RedisOmError, "Redis connection needs to be open."))
  })

  describe("#set", () => {
    describe("when called on an open client", () => {
      beforeEach(async () => {
        await client.open()
        await client.set('foo', 'bar')
      })

      it("passes the command to redis", async () => {
        expect(redis.set).toHaveBeenCalledWith('foo', 'bar')
      })
    })

    describe("when called on a closed client", () => {
      beforeEach(async () => {
        await client.open()
        await client.close()
      })

      it("errors when called on a closed client", () =>
        expect(async () => await client.set('foo', 'bar'))
          .rejects.toThrowErrorOfType(RedisOmError, "Redis connection needs to be open."))
    })

    it("errors when called on a new client", async () =>
      expect(async () => await client.set('foo', 'bar'))
        .rejects.toThrowErrorOfType(RedisOmError, "Redis connection needs to be open."))
  })

})
