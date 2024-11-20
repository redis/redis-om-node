import { RedisConnection } from '$lib/client'
import { EntityId } from '$lib/entity'
import { Search } from '$lib/search'

import { mockRedis } from '../helpers/mock-redis'
import { simpleHashSchema } from '../helpers/test-entity-and-schema'
import {
  mockSearchToReturnNothing,
  mockSearchToReturnSingleKey,
  mockSearchToReturnMultipleKeys,
  mockSearchToReturnPaginatedKeys,
  SIMPLE_ENTITY_1,
  SIMPLE_ENTITY_2,
  SIMPLE_ENTITY_3,
  SIMPLE_ENTITY_4,
  SIMPLE_ENTITY_5
} from '../helpers/search-helpers'

describe('Search', () => {
  describe('#returnAllIds', () => {
    const indexName = 'SimpleHashEntity:index'
    const query = '*'

    let redis: RedisConnection
    let search: Search
    let ids: string[]

    beforeEach(() => {
      redis = mockRedis()
      search = new Search(simpleHashSchema, redis)
    })

    describe('when querying no results', () => {
      beforeEach(async () => {
        mockSearchToReturnNothing(redis)
        ids = await search.return.allIds()
      })

      it('asks redis for a single page of results', () => {
        expect(redis.ft.search).toHaveBeenCalledTimes(1)
        expect(redis.ft.search).toHaveBeenCalledWith(indexName, query, {
          LIMIT: { from: 0, size: 10 },
          RETURN: []
        })
      })

      it('returns no results', () => expect(ids).toHaveLength(0))
    })

    describe('when querying a single result', () => {
      beforeEach(async () => {
        mockSearchToReturnSingleKey(redis)
        ids = await search.return.allIds()
      })

      it('asks redis for a a single page of results', () => {
        expect(redis.ft.search).toHaveBeenCalledTimes(1)
        expect(redis.ft.search).toHaveBeenCalledWith(indexName, query, {
          LIMIT: { from: 0, size: 10 },
          RETURN: []
        })
      })

      it('returns the expected single result', () => {
        expect(ids).toHaveLength(1)
        expect(ids).toEqual(expect.arrayContaining([SIMPLE_ENTITY_1[EntityId]]))
      })
    })

    describe('when querying multiple results', () => {
      beforeEach(async () => {
        mockSearchToReturnMultipleKeys(redis)
        ids = await search.return.allIds()
      })

      it('asks redis for a single page of results', () => {
        expect(redis.ft.search).toHaveBeenCalledTimes(1)
        expect(redis.ft.search).toHaveBeenCalledWith(indexName, query, {
          LIMIT: { from: 0, size: 10 },
          RETURN: []
        })
      })

      it('returns all the results', async () => {
        expect(ids).toHaveLength(3)
        expect(ids).toEqual(
          expect.arrayContaining([SIMPLE_ENTITY_1[EntityId], SIMPLE_ENTITY_2[EntityId], SIMPLE_ENTITY_3[EntityId]])
        )
      })
    })

    describe('when querying multiple results that cross the page boundry', () => {
      beforeEach(async () => {
        mockSearchToReturnPaginatedKeys(redis)
        ids = await search.return.allIds({ pageSize: 2 })
      })

      it('asks redis for multiple pages of results', () => {
        expect(redis.ft.search).toHaveBeenCalledTimes(3)
        expect(redis.ft.search).toHaveBeenCalledWith(indexName, query, {
          LIMIT: { from: 0, size: 2 },
          RETURN: []
        })
      })

      it('returns all the results', async () => {
        expect(ids).toHaveLength(5)
        expect(ids).toEqual(
          expect.arrayContaining([
            SIMPLE_ENTITY_1[EntityId],
            SIMPLE_ENTITY_2[EntityId],
            SIMPLE_ENTITY_3[EntityId],
            SIMPLE_ENTITY_4[EntityId],
            SIMPLE_ENTITY_5[EntityId]
          ])
        )
      })
    })
  })
})
