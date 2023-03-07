import { redis, createClient } from '../helpers/mock-redis'
import { Client } from '$lib/client'

const BOGUS_CONNECTION = { THIS_IS_NOT: 'a real connection' }


describe("Client", () => {

  let client: Client, self: Client

  beforeEach(() => { client = new Client() })

  describe("#use", () => {
    describe("when not called", () => {
      it("is not open", () => {
        expect(client.isOpen()).toBe(false)
      })
    })

    describe("when called", () => {
      beforeEach(async () => {
        // @ts-ignore: no way to call createClient without actually connecting to Redis
        self = await client.use(BOGUS_CONNECTION)
      })

      it("creates a redis client with the connection", () => {
        expect(createClient).not.toHaveBeenCalled()
      })

      it("is open", () => {
        expect(client.isOpen()).toBe(true)
      })

      it("returns itself", async () => {
        expect(self).toBe(client)
      })
    })

    describe("when called on an open connection", () => {
      beforeEach(async () => {
        await client.open()
        // @ts-ignore: no way to call createClient without actually connecting to Redis
        self = await client.use(BOGUS_CONNECTION)
      })

      it("closes the existing redis connection", () => {
        expect(redis.quit).toHaveBeenCalled()
      })

      it("doesn't create a new redis client", () => {
        expect(createClient).not.toHaveBeenCalledWith()
      })

      it("is open", () => {
        expect(client.isOpen()).toBe(true)
      })

      it("returns itself", async () => {
        expect(self).toBe(client)
      })
    })
  })
})
