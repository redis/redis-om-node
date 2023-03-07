import '../../helpers/custom-matchers'

import { RediSearchSchema, SchemaFieldTypes } from 'redis'

import { redis } from '../helpers/mock-redis'
import { Client, CreateOptions } from '$lib/client'
import { RedisOmError } from '$lib/error'



const schema: RediSearchSchema = {
  foo: { type: SchemaFieldTypes.TAG },
  bar: { type: SchemaFieldTypes.TEXT }
}

const options: CreateOptions = {
  ON: 'HASH',
  PREFIX: 'prefix',
  STOPWORDS: ['bar', 'baz', 'qux']
}

describe("Client", () => {

  let client: Client

  beforeEach(() => { client = new Client() })

  describe("#createIndex", () => {
    describe("when called on an open client", () => {
      beforeEach(async () => {
        await client.open()
      })

      it("passes a command to redis", async () => {
        await client.createIndex('index', schema, options)
        expect(redis.ft.create).toHaveBeenCalledWith('index', schema, options)
      })
    })

    describe("when called on a closed client", () => {
      beforeEach(async () => {
        await client.open()
        await client.close()
      })

      it("errors when called on a closed client", () =>
        expect(async () => await client.createIndex('index', schema, options))
          .rejects.toThrowErrorOfType(RedisOmError, "Redis connection needs to be open."))
    })

    it("errors when called on a new client", async () =>
      expect(async () => await client.createIndex('index', schema, options))
        .rejects.toThrowErrorOfType(RedisOmError, "Redis connection needs to be open."))
  })
})
