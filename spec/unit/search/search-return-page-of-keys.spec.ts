import { RedisConnection } from '$lib/client'
import { EntityId } from '$lib/entity'
import { Search } from '$lib/search'

import { mockRedis } from '../helpers/mock-redis'
import { simpleHashSchema } from '../helpers/test-entity-and-schema'
import {
  mockSearchToReturnNothing,
  mockSearchToReturnSingleKey,
  mockSearchToReturnMultipleKeys,
  SIMPLE_ENTITY_1,
  SIMPLE_ENTITY_2,
  SIMPLE_ENTITY_3
} from '../helpers/search-helpers'

describe('#returnPageOfKeys', () => {
  const indexName = 'SimpleHashEntity:index'
  const query = '*'

  let redis: RedisConnection
  let search: Search
  let keys: string[]

  beforeEach(() => {
    redis = mockRedis()
    search = new Search(simpleHashSchema, redis)
  })

  describe('when querying no results', () => {
    beforeEach(async () => {
      mockSearchToReturnNothing(redis)
      keys = await search.return.pageOfKeys(0, 5)
    })

    it('asks redis for results', () => {
      expect(redis.ft.search).toHaveBeenCalledTimes(1)
      expect(redis.ft.search).toHaveBeenCalledWith(indexName, query, {
        LIMIT: { from: 0, size: 5 },
        RETURN: []
      })
    })

    it('returns no results', () => expect(keys).toHaveLength(0))
  })

  describe('when querying a single result', () => {
    beforeEach(async () => {
      mockSearchToReturnSingleKey(redis)
      keys = await search.return.pageOfKeys(0, 5)
    })

    it('asks redis for results', () => {
      expect(redis.ft.search).toHaveBeenCalledTimes(1)
      expect(redis.ft.search).toHaveBeenCalledWith(indexName, query, {
        LIMIT: { from: 0, size: 5 },
        RETURN: []
      })
    })

    it('returns the expected single result', () => {
      expect(keys).toHaveLength(1)
      expect(keys).toEqual(expect.arrayContaining([`SimpleHashEntity:${SIMPLE_ENTITY_1[EntityId]}`]))
    })
  })

  describe('when querying multiple results', () => {
    beforeEach(async () => {
      mockSearchToReturnMultipleKeys(redis)
      keys = await search.return.pageOfKeys(0, 5)
    })

    it('asks redis for results', () => {
      expect(redis.ft.search).toHaveBeenCalledTimes(1)
      expect(redis.ft.search).toHaveBeenCalledWith(indexName, query, {
        LIMIT: { from: 0, size: 5 },
        RETURN: []
      })
    })

    it('returns all the results', async () => {
      expect(keys).toHaveLength(3)
      expect(keys).toEqual(
        expect.arrayContaining([
          `SimpleHashEntity:${SIMPLE_ENTITY_1[EntityId]}`,
          `SimpleHashEntity:${SIMPLE_ENTITY_2[EntityId]}`,
          `SimpleHashEntity:${SIMPLE_ENTITY_3[EntityId]}`
        ])
      )
    })
  })
})
