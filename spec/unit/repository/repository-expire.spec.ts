import '../helpers/mock-client'

import { Client } from '$lib/client'
import { Repository } from '$lib/repository'
import { Schema } from '$lib/schema'

const simpleSchema = new Schema("SimpleEntity", {}, { dataStructure: 'HASH' })

describe("Repository", () => {
  describe("#expire", () => {

    let client: Client
    let repository: Repository

    beforeAll(() => { client = new Client() })
    beforeEach(() => { repository = new Repository(simpleSchema, client) })

    it("expires a single entity", async () => {
      await repository.expire('foo', 60)
      expect(client.expire).toHaveBeenCalledWith('SimpleEntity:foo', 60)
    })

    it("expires a multiple entities", async () => {
      await repository.expire(['foo', 'bar', 'baz'], 60)
      expect(client.expire).toHaveBeenNthCalledWith(1, 'SimpleEntity:foo', 60)
      expect(client.expire).toHaveBeenNthCalledWith(2, 'SimpleEntity:bar', 60)
      expect(client.expire).toHaveBeenNthCalledWith(3, 'SimpleEntity:baz', 60)
    })
  })
})
