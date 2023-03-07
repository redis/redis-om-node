import '../helpers/mock-client'
import '../helpers/mock-redis'

import { createClient } from 'redis'

import { Client, RedisConnection } from '$lib/client'
import { Repository } from '$lib/repository'

import { simpleSchema } from '../helpers/test-entity-and-schema'


describe("Repository", () => {

  let client: Client
  let connection: RedisConnection
  let repository: Repository

  describe("when created with a Client", () => {
    beforeEach(() => {
      client = new Client()
      repository = new Repository(simpleSchema, client)
    })

    it("uses the client it is given", () => {
      // @ts-ignore
      expect(repository.client).toBe(client)
    })
  })

  describe("when created with a RedisConnection", () => {
    beforeEach(() => {
      connection = createClient()
      repository = new Repository(simpleSchema, connection)
    })

    it("creates a new client", () => {
      expect(Client).toHaveBeenCalled()
    })

    it("uses the RedisConnection", () => {
      // @ts-ignore
      expect(repository.client.useNoClose).toHaveBeenCalledWith(connection)
    })
  })
})
