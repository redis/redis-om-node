import { RedisConnection } from '$lib/client'
import { EntityId } from '$lib/entity'
import { Search } from '$lib/search'

import { mockRedis } from '../helpers/mock-redis'
import { simpleHashSchema } from '../helpers/test-entity-and-schema'
import { mockSearchToReturnNothing, mockSearchToReturnSingleKey, SIMPLE_ENTITY_1 } from '../helpers/search-helpers'

describe('#returnMinKey', () => {
  const indexName = 'SimpleHashEntity:index'
  const query = '*'

  let redis: RedisConnection
  let search: Search
  let key: string | null

  beforeEach(() => {
    redis = mockRedis()
    search = new Search(simpleHashSchema, redis)
  })

  describe('when querying no results', () => {
    beforeEach(async () => {
      mockSearchToReturnNothing(redis)
      key = await search.return.minKey('aNumber')
    })

    it('asks the client for the first result of a given repository', () => {
      expect(redis.ft.search).toHaveBeenCalledTimes(1)
      expect(redis.ft.search).toHaveBeenCalledWith(indexName, query, {
        LIMIT: { from: 0, size: 1 },
        SORTBY: { BY: 'aNumber', DIRECTION: 'ASC' },
        RETURN: []
      })
    })

    it('return no result', () => expect(key).toBe(null))
  })

  describe('when getting a result', () => {
    beforeEach(async () => {
      mockSearchToReturnSingleKey(redis)
      key = await search.return.minKey('aNumber')
    })

    it('asks the client for the first result of a given repository', () => {
      expect(redis.ft.search).toHaveBeenCalledTimes(1)
      expect(redis.ft.search).toHaveBeenCalledWith(indexName, query, {
        LIMIT: { from: 0, size: 1 },
        SORTBY: { BY: 'aNumber', DIRECTION: 'ASC' },
        RETURN: []
      })
    })

    it('returns the first result of a given repository', () => {
      expect(key).toEqual(`SimpleHashEntity:${SIMPLE_ENTITY_1[EntityId]}`)
    })
  })
})
