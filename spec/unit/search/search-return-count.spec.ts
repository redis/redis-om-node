import { RedisConnection } from '$lib/client'
import { Search } from '$lib/search'

import { mockRedis } from '../helpers/mock-redis'
import { simpleHashSchema } from '../helpers/test-entity-and-schema'
import { mockSearchToReturnCountOf } from '../helpers/search-helpers'

describe('Search', () => {
  let actualCount: number

  describe('#returnCount', () => {
    let redis: RedisConnection
    let search: Search

    const query = '*'
    const offset = 0
    const count = 0

    beforeEach(async () => {
      redis = mockRedis()
      search = new Search(simpleHashSchema, redis)
      mockSearchToReturnCountOf(redis, 3)
      actualCount = await search.return.count()
    })

    it('asks the client for results', () => {
      expect(redis.ft.search).toHaveBeenCalledTimes(1)
      expect(redis.ft.search).toHaveBeenCalledWith('SimpleHashEntity:index', query, {
        LIMIT: { from: offset, size: count }
      })
    })

    it('returns the expected count', () => expect(actualCount).toBe(3))
  })
})
