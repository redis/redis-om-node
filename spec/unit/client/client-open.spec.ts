import { redis, createClient } from '../helpers/mock-redis'
import { Client } from '$lib/client'

describe("Client", () => {

  let client: Client, self: Client

  beforeEach(() => { client = new Client() })

  describe("#open", () => {
    describe("when not called", () => {
      it("is not open", () => {
        expect(client.isOpen()).toBe(false)
      })
    })

    describe("when called without a url", () => {
      beforeEach(async () => {self = await client.open()})

      it("creates a redis client with the default url", () => {
        expect(createClient).toHaveBeenCalledWith({ url: 'redis://localhost:6379' })
      })

      it("connects to redis", async () => {
        expect(redis.connect).toHaveBeenCalled()
      })

      it("is open", () => {
        expect(client.isOpen()).toBe(true)
      })

      it("returns itself", async () => {
        expect(self).toBe(client)
      })

      describe("when trying to call it again", () => {
        beforeEach(async () => {self = await client.open()})

        it("doesn't re-create a redis client", () => {
          expect(createClient).toBeCalledTimes(1)
        })

        it("doesn't open redis again", async () => {
          expect(redis.connect).toBeCalledTimes(1)
        })

        it("returns itself", async () => {
          expect(self).toBe(client)
        })
      })
    })

    describe("when called with a url", () => {
      beforeEach(async () => {self = await client.open('foo')})

      it("creates a new redis client with the provided url", () => {
        expect(createClient).toHaveBeenCalledWith({ url: 'foo' })
      })

      it("connects to redis", async () => {
        expect(redis.connect).toHaveBeenCalled()
      })

      it("is open", () => {
        expect(client.isOpen()).toBe(true)
      })

      it("returns itself", async () => {
        expect(self).toBe(client)
      })

      describe("when trying to call it again", () => {
        beforeEach(async () => {self = await client.open('foo')})

        it("doesn't re-create a redis client", () => {
          expect(createClient).toBeCalledTimes(1)
        })

        it("doesn't open redis again", async () => {
          expect(redis.connect).toBeCalledTimes(1)
        })

        it("returns itself", async () => {
          expect(self).toBe(client)
        })
      })
    })
  })
})
