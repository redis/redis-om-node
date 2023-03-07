import '../helpers/mock-client'

import { Client } from '$lib/client'
import { Repository } from '$lib/repository'
import { Schema } from '$lib/schema'

const simpleSchema = new Schema("SimpleEntity", {}, { dataStructure: 'HASH' })

describe("Repository", () => {
  describe("#remove", () => {

    let client: Client
    let repository: Repository

    beforeAll(() => { client = new Client() })
    beforeEach(() => { repository = new Repository(simpleSchema, client) })

    it("removes no entities", async () => {
      await repository.remove()
      expect(client.unlink).not.toHaveBeenCalled()
    })

    it("removes a single entity", async () => {
      await repository.remove('foo')
      expect(client.unlink).toHaveBeenCalledWith('SimpleEntity:foo')
    })

    it("removes multiple entities", async () => {
      await repository.remove('foo', 'bar', 'baz')
      expect(client.unlink).toHaveBeenCalledWith(
        'SimpleEntity:foo', 'SimpleEntity:bar', 'SimpleEntity:baz'
      )
    })

    it("removes multiple entities discretely", async () => {
      await repository.remove(['foo', 'bar', 'baz'])
      expect(client.unlink).toHaveBeenCalledWith(
        'SimpleEntity:foo', 'SimpleEntity:bar', 'SimpleEntity:baz'
      )
    })
  })
})
