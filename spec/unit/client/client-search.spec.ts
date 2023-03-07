import '../../helpers/custom-matchers'

import { redis } from '../helpers/mock-redis'

import { Client } from '$lib/client'
import { RedisOmError } from '$lib/error'

describe("Client", () => {

  let client: Client

  beforeEach(() => { client = new Client() })

  describe("#search", () => {
    describe("when called on an open client", () => {
      beforeEach(async () => {
        await client.open()
      })

      it("sends the expected command when given minimal options", async () => {
        await client.search('index', 'query')
        expect(redis.ft.search).toHaveBeenCalledWith('index', 'query')
      })

      it("sends the expected command when given some options", async () => {
        await client.search('index', 'query', { LIMIT: { from: 0, size: 5 } })
        expect(redis.ft.search).toHaveBeenCalledWith('index', 'query', { LIMIT: { from: 0, size: 5 } })
      })
    })

    describe("when called on an unopened client", () => {
      it("throws an error", async () => expect(async () => await client.search('index', 'query'))
        .rejects.toThrowErrorOfType(RedisOmError, "Redis connection needs to be open."))
    })

    describe("when called on a closed client", () => {
      beforeEach(async () => {
        await client.open()
        await client.close()
      })

      it("throws an error", () => expect(async () => await client.search('index', 'query'))
        .rejects.toThrowErrorOfType(RedisOmError, "Redis connection needs to be open."))
    })
  })
})
