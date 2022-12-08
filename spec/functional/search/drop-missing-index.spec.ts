import { Client, Repository, Schema } from '$lib/index'

import { createHashEntitySchema } from '../helpers/data-helper'
import { fetchIndexInfo  } from '../helpers/redis-helper'

describe("drop missing index on hash", () => {

  let client: Client
  let repository: Repository
  let schema: Schema

  beforeAll(async () => {
    client = new Client()
    await client.open()

    schema = createHashEntitySchema('drop-missing')
    repository = client.fetchRepository(schema)
  })

  afterAll(async () => await client.close())

  describe("when the index is dropped", () => {
    beforeEach(async () => {
      await repository.dropIndex()
    })

    it("the index still doesn't exists", () => {
      expect(async () => await fetchIndexInfo(client, 'drop-missing:index'))
        .rejects.toThrow("Unknown Index name")
    })
  })
})
