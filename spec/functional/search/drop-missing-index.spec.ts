import { createClient } from 'redis'

import { RedisConnection, Repository, Schema } from '$lib/index'

import { createHashEntitySchema } from '../helpers/data-helper'
import { fetchIndexInfo  } from '../helpers/redis-helper'

describe("drop missing index on hash", () => {

  let redis: RedisConnection
  let repository: Repository
  let schema: Schema

  beforeAll(async () => {
    redis = createClient()
    await redis.connect()

    schema = createHashEntitySchema('drop-missing')
    repository = new Repository(schema, redis)
  })

  afterAll(async () => {
    await redis.quit()
  })

  describe("when the index is dropped", () => {
    beforeEach(async () => {
      await repository.dropIndex()
    })

    it("the index still doesn't exists", () => {
      expect(async () => await fetchIndexInfo(redis, 'drop-missing:index'))
        .rejects.toThrow("Unknown Index name")
    })
  })
})
