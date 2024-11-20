import { RedisConnection } from '$lib/client'
import { Search, RawSearch } from '$lib/search'

import { mockRedis } from '../helpers/mock-redis'
import { simpleHashSchema, simpleJsonSchema } from '../helpers/test-entity-and-schema'
import {
  mockSearchToReturnNothing,
  mockSearchToReturnSingleHash,
  mockSearchToReturnSingleJsonString,
  mockSearchToReturnMultipleHashes,
  mockSearchToReturnMultipleJsonStrings,
  mockSearchToReturnPaginatedHashes,
  mockSearchToReturnPaginatedJsonStrings,
  SIMPLE_ENTITY_1,
  SIMPLE_ENTITY_2,
  SIMPLE_ENTITY_3,
  SIMPLE_ENTITY_4,
  SIMPLE_ENTITY_5
} from '../helpers/search-helpers'

describe('Search', () => {
  describe('#returnAll', () => {
    const query = '*'

    let redis: RedisConnection
    let search: Search | RawSearch
    let entities: object[]

    beforeEach(() => {
      redis = mockRedis()
    })

    describe('when running against hashes', () => {
      const indexName = 'SimpleHashEntity:index'

      beforeEach(() => {
        search = new Search(simpleHashSchema, redis)
      })

      describe('when querying no results', () => {
        beforeEach(async () => {
          mockSearchToReturnNothing(redis)
          entities = await search.return.all()
        })

        it('asks redis for a single page of results', () => {
          expect(redis.ft.search).toHaveBeenCalledTimes(1)
          expect(redis.ft.search).toHaveBeenCalledWith(indexName, query, {
            LIMIT: { from: 0, size: 10 }
          })
        })

        it('returns no results', () => expect(entities).toHaveLength(0))
      })

      describe('when querying a single result', () => {
        beforeEach(async () => {
          mockSearchToReturnSingleHash(redis)
          entities = await search.return.all()
        })

        it('asks redis for a single page of results', () => {
          expect(redis.ft.search).toHaveBeenCalledTimes(1)
          expect(redis.ft.search).toHaveBeenCalledWith(indexName, query, {
            LIMIT: { from: 0, size: 10 }
          })
        })

        it('returns the expected single result', () => {
          expect(entities).toHaveLength(1)
          expect(entities).toEqual(expect.arrayContaining([expect.objectContaining(SIMPLE_ENTITY_1)]))
        })
      })

      describe('when querying multiple results', () => {
        beforeEach(async () => {
          mockSearchToReturnMultipleHashes(redis)
          entities = await search.return.all()
        })

        it('asks redis for a single page of results', () => {
          expect(redis.ft.search).toHaveBeenCalledTimes(1)
          expect(redis.ft.search).toHaveBeenCalledWith(indexName, query, {
            LIMIT: { from: 0, size: 10 }
          })
        })

        it('returns all the results', async () => {
          expect(entities).toHaveLength(3)
          expect(entities).toEqual(
            expect.arrayContaining([
              expect.objectContaining(SIMPLE_ENTITY_1),
              expect.objectContaining(SIMPLE_ENTITY_2),
              expect.objectContaining(SIMPLE_ENTITY_3)
            ])
          )
        })
      })

      describe('when querying multiple results that cross the page boundry', () => {
        beforeEach(async () => {
          mockSearchToReturnPaginatedHashes(redis)
          entities = await search.return.all({ pageSize: 2 })
        })

        it('asks redis for multiple pages of results', () => {
          expect(redis.ft.search).toHaveBeenCalledTimes(3)
          expect(redis.ft.search).toHaveBeenCalledWith(indexName, query, {
            LIMIT: { from: 0, size: 2 }
          })
        })

        it('returns all the results', async () => {
          expect(entities).toHaveLength(5)
          expect(entities).toEqual(
            expect.arrayContaining([
              expect.objectContaining(SIMPLE_ENTITY_1),
              expect.objectContaining(SIMPLE_ENTITY_2),
              expect.objectContaining(SIMPLE_ENTITY_3),
              expect.objectContaining(SIMPLE_ENTITY_4),
              expect.objectContaining(SIMPLE_ENTITY_5)
            ])
          )
        })
      })
    })

    describe('when running against JSON objects', () => {
      const indexName = 'SimpleJsonEntity:index'

      beforeEach(() => {
        search = new Search(simpleJsonSchema, redis)
      })

      describe('when querying no results', () => {
        beforeEach(async () => {
          mockSearchToReturnNothing(redis)
          entities = await search.return.all()
        })

        it('asks redis for a single page of results', () => {
          expect(redis.ft.search).toHaveBeenCalledTimes(1)
          expect(redis.ft.search).toHaveBeenCalledWith(indexName, query, {
            LIMIT: { from: 0, size: 10 },
            RETURN: '$'
          })
        })

        it('returns no results', () => expect(entities).toHaveLength(0))
      })

      describe('when querying a single result', () => {
        beforeEach(async () => {
          mockSearchToReturnSingleJsonString(redis)
          entities = await search.return.all()
        })

        it('asks redis for a single page of results', () => {
          expect(redis.ft.search).toHaveBeenCalledTimes(1)
          expect(redis.ft.search).toHaveBeenCalledWith(indexName, query, {
            LIMIT: { from: 0, size: 10 },
            RETURN: '$'
          })
        })

        it('returns the expected single result', () => {
          expect(entities).toHaveLength(1)
          expect(entities).toEqual(expect.arrayContaining([expect.objectContaining(SIMPLE_ENTITY_1)]))
        })
      })

      describe('when querying multiple results', () => {
        beforeEach(async () => {
          mockSearchToReturnMultipleJsonStrings(redis)
          entities = await search.return.all()
        })

        it('asks redis for a single page of results', () => {
          expect(redis.ft.search).toHaveBeenCalledTimes(1)
          expect(redis.ft.search).toHaveBeenCalledWith(indexName, query, {
            LIMIT: { from: 0, size: 10 },
            RETURN: '$'
          })
        })

        it('returns all the results', async () => {
          expect(entities).toHaveLength(3)
          expect(entities).toEqual(
            expect.arrayContaining([
              expect.objectContaining(SIMPLE_ENTITY_1),
              expect.objectContaining(SIMPLE_ENTITY_2),
              expect.objectContaining(SIMPLE_ENTITY_3)
            ])
          )
        })
      })

      describe('when querying multiple results that cross the page boundry', () => {
        beforeEach(async () => {
          mockSearchToReturnPaginatedJsonStrings(redis)
          entities = await search.return.all({ pageSize: 2 })
        })

        it('asks redis for a multiple pages of results', () => {
          expect(redis.ft.search).toHaveBeenCalledTimes(3)
          expect(redis.ft.search).toHaveBeenCalledWith(indexName, query, {
            LIMIT: { from: 0, size: 2 },
            RETURN: '$'
          })
          expect(redis.ft.search).toHaveBeenCalledWith(indexName, query, {
            LIMIT: { from: 2, size: 2 },
            RETURN: '$'
          })
          expect(redis.ft.search).toHaveBeenCalledWith(indexName, query, {
            LIMIT: { from: 4, size: 2 },
            RETURN: '$'
          })
        })

        it('returns all the results', async () => {
          expect(entities).toHaveLength(5)
          expect(entities).toEqual(
            expect.arrayContaining([
              expect.objectContaining(SIMPLE_ENTITY_1),
              expect.objectContaining(SIMPLE_ENTITY_2),
              expect.objectContaining(SIMPLE_ENTITY_3),
              expect.objectContaining(SIMPLE_ENTITY_4),
              expect.objectContaining(SIMPLE_ENTITY_5)
            ])
          )
        })
      })
    })
  })
})
