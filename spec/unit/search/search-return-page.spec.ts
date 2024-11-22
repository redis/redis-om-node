import { RedisConnection } from '$lib/client'
import { Search } from '$lib/search'

import { mockRedis } from '../helpers/mock-redis'
import { simpleHashSchema, simpleJsonSchema } from '../helpers/test-entity-and-schema'
import {
  mockSearchToReturnNothing,
  mockSearchToReturnSingleHash,
  mockSearchToReturnSingleJsonString,
  mockSearchToReturnMultipleHashes,
  mockSearchToReturnMultipleJsonStrings,
  SIMPLE_ENTITY_1,
  SIMPLE_ENTITY_2,
  SIMPLE_ENTITY_3
} from '../helpers/search-helpers'

describe('#returnPage', () => {
  let entities: object[]
  let redis: RedisConnection
  let search: Search

  const query = '*'

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
        entities = await search.return.page(0, 5)
      })

      it('asks redis for results', () => {
        expect(redis.ft.search).toHaveBeenCalledTimes(1)
        expect(redis.ft.search).toHaveBeenCalledWith(indexName, query, {
          LIMIT: { from: 0, size: 5 }
        })
      })

      it('returns no results', () => expect(entities).toHaveLength(0))
    })

    describe('when querying a single result', () => {
      beforeEach(async () => {
        mockSearchToReturnSingleHash(redis)
        entities = await search.return.page(0, 5)
      })

      it('asks redis for results', () => {
        expect(redis.ft.search).toHaveBeenCalledTimes(1)
        expect(redis.ft.search).toHaveBeenCalledWith(indexName, query, {
          LIMIT: { from: 0, size: 5 }
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
        entities = await search.return.page(0, 5)
      })

      it('asks redis for results', () => {
        expect(redis.ft.search).toHaveBeenCalledTimes(1)
        expect(redis.ft.search).toHaveBeenCalledWith(indexName, query, {
          LIMIT: { from: 0, size: 5 }
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
  })

  describe('when running against JSON objects', () => {
    const indexName = 'SimpleJsonEntity:index'

    beforeEach(() => {
      search = new Search(simpleJsonSchema, redis)
    })

    describe('when querying no results', () => {
      beforeEach(async () => {
        mockSearchToReturnNothing(redis)
        entities = await search.return.page(0, 5)
      })

      it('asks redis for results', () => {
        expect(redis.ft.search).toHaveBeenCalledTimes(1)
        expect(redis.ft.search).toHaveBeenCalledWith(indexName, query, {
          LIMIT: { from: 0, size: 5 },
          RETURN: '$'
        })
      })

      it('returns no results', async () => expect(entities).toHaveLength(0))
    })

    describe('when querying a single result', () => {
      beforeEach(async () => {
        mockSearchToReturnSingleJsonString(redis)
        entities = await search.return.page(0, 5)
      })

      it('asks redis for results', () => {
        expect(redis.ft.search).toHaveBeenCalledTimes(1)
        expect(redis.ft.search).toHaveBeenCalledWith(indexName, query, {
          LIMIT: { from: 0, size: 5 },
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
        entities = await search.return.page(0, 5)
      })

      it('asks redis for results', () => {
        expect(redis.ft.search).toHaveBeenCalledTimes(1)
        expect(redis.ft.search).toHaveBeenCalledWith(indexName, query, {
          LIMIT: { from: 0, size: 5 },
          RETURN: '$'
        })
      })

      it('returns all the expected results', () => {
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
  })
})
