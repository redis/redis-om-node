import { RedisConnection } from '$lib/client'
import { EntityId } from '$lib/entity'
import { Search } from '$lib/search'

import { mockRedis } from '../helpers/mock-redis'
import { simpleHashSchema } from '../helpers/test-entity-and-schema'
import { mockSearchToReturnNothing, mockSearchToReturnSingleKey, SIMPLE_ENTITY_1 } from '../helpers/search-helpers'

describe('#returnFirstKey', () => {
  const indexName = 'SimpleHashEntity:index'
  const query = '*'

  let redis: RedisConnection
  let search: Search
  let id: string | null

  beforeEach(() => {
    redis = mockRedis()
    search = new Search(simpleHashSchema, redis)
  })

  describe('when querying no results', () => {
    beforeEach(async () => {
      mockSearchToReturnNothing(redis)
      id = await search.return.firstKey()
    })

    it('asks redis for the first result', () => {
      expect(redis.ft.search).toHaveBeenCalledTimes(1)
      expect(redis.ft.search).toHaveBeenCalledWith(indexName, query, {
        LIMIT: { from: 0, size: 1 },
        RETURN: []
      })
    })

    it('return no result', () => expect(id).toBe(null))
  })

  describe('when getting a result', () => {
    beforeEach(async () => {
      mockSearchToReturnSingleKey(redis)
      id = await search.return.firstKey()
    })

    it('asks redis for the first result', () => {
      expect(redis.ft.search).toHaveBeenCalledTimes(1)
      expect(redis.ft.search).toHaveBeenCalledWith(indexName, query, {
        LIMIT: { from: 0, size: 1 },
        RETURN: []
      })
    })

    it('returns the first result of a given repository', () => {
      expect(id).toEqual(`SimpleHashEntity:${SIMPLE_ENTITY_1[EntityId]}`)
    })
  })
})
