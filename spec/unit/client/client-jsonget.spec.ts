import '../../helpers/custom-matchers'

import { json } from '../helpers/mock-redis'

import { Client, RedisJsonData } from '$lib/client'
import { RedisOmError } from '$lib/error'

describe("Client", () => {

  let client: Client
  let result: RedisJsonData | null

  beforeEach(() => { client = new Client() })

  describe("#jsonget", () => {
    describe("when called on an open client", () => {
      beforeEach(async () => {
        await client.open()
        json.get.mockResolvedValue([ { "foo": "bar", "bar": 42, "baz": true, "qux": null } ])
        result = await client.jsonget('foo')
      })

      it("passes the command to redis", async () => {
        expect(json.get).toHaveBeenCalledWith('foo', { path: '$' })
      })

      it("returns the JSON", async () => {
        expect(result).toEqual({ foo: 'bar', bar: 42, baz: true, qux: null })
      })
    })

    describe("when called on a closed client", () => {
      beforeEach(async () => {
        await client.open()
        await client.close()
      })

      it("errors when called on a closed client", () =>
        expect(async () => await client.jsonget('foo'))
          .rejects.toThrowErrorOfType(RedisOmError, "Redis connection needs to be open."))
    })

    it("errors when called on a new client", async () =>
      expect(async () => await client.jsonget('foo'))
        .rejects.toThrowErrorOfType(RedisOmError, "Redis connection needs to be open."))
  })
})
