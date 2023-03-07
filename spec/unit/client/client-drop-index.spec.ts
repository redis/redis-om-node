import '../../helpers/custom-matchers'

import { ft } from '../helpers/mock-redis'

import { Client } from '$lib/client'
import { RedisOmError } from '$lib/error'


describe("Client", () => {

  let client: Client

  beforeEach(() => { client = new Client() })

  describe("#dropIndex", () => {
    describe("when called on an open client", () => {
      beforeEach(async () => {
        await client.open()
      })

      it("passes the command to redis", async () => {
        await client.dropIndex('index')
        expect(ft.dropIndex).toHaveBeenCalledWith('index')
      })
    })

    describe("when called on a closed client", () => {
      beforeEach(async () => {
        await client.open()
        await client.close()
      })

      it("errors when called on a closed client", () =>
        expect(async () => await client.dropIndex('index'))
          .rejects.toThrowErrorOfType(RedisOmError, "Redis connection needs to be open."))
    })

    it("errors when called on a new client", async () =>
      expect(async () => await client.dropIndex('index'))
        .rejects.toThrowErrorOfType(RedisOmError, "Redis connection needs to be open."))
  })
})
