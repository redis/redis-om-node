import { RedisConnection } from '$lib/client'
import { Entity, EntityId } from '$lib/entity'
import { Search } from '$lib/search'

import { mockRedis } from '../helpers/mock-redis'
import { simpleHashSchema, simpleJsonSchema } from '../helpers/test-entity-and-schema'
import {
  mockSearchToReturnNothing,
  mockSearchToReturnSingleHash,
  mockSearchToReturnSingleJsonString,
  SIMPLE_ENTITY_1
} from '../helpers/search-helpers'

describe('#returnMin', () => {
  let entity: Entity | null
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
        entity = await search.return.min('aNumber')
      })

      it('asks redis for the first result', () => {
        expect(redis.ft.search).toHaveBeenCalledTimes(1)
        expect(redis.ft.search).toHaveBeenCalledWith(indexName, query, {
          LIMIT: { from: 0, size: 1 },
          SORTBY: { BY: 'aNumber', DIRECTION: 'ASC' }
        })
      })

      it('return no result', () => expect(entity).toBe(null))
    })

    describe('when getting a result', () => {
      beforeEach(async () => {
        mockSearchToReturnSingleHash(redis)
        entity = await search.return.min('aNumber')
      })

      it('asks redis for the first result', () => {
        expect(redis.ft.search).toHaveBeenCalledTimes(1)
        expect(redis.ft.search).toHaveBeenCalledWith(indexName, query, {
          LIMIT: { from: 0, size: 1 },
          SORTBY: { BY: 'aNumber', DIRECTION: 'ASC' }
        })
      })

      it('returns the first result', () => {
        expect(entity?.aBoolean).toEqual(SIMPLE_ENTITY_1.aBoolean)
        expect(entity?.aNumber).toEqual(SIMPLE_ENTITY_1.aNumber)
        expect(entity?.aString).toEqual(SIMPLE_ENTITY_1.aString)
        expect(entity ? entity[EntityId] : null).toEqual(SIMPLE_ENTITY_1[EntityId])
      })
    })
  })

  describe('when running against JSON Objects', () => {
    const indexName = 'SimpleJsonEntity:index'

    beforeEach(() => {
      search = new Search(simpleJsonSchema, redis)
    })

    describe('when querying no results', () => {
      beforeEach(async () => {
        mockSearchToReturnNothing(redis)
        entity = await search.return.min('aNumber')
      })

      it('asks redis for the first result', () => {
        expect(redis.ft.search).toHaveBeenCalledTimes(1)
        expect(redis.ft.search).toHaveBeenCalledWith(indexName, query, {
          LIMIT: { from: 0, size: 1 },
          SORTBY: { BY: 'aNumber', DIRECTION: 'ASC' },
          RETURN: '$'
        })
      })

      it('return no result', () => expect(entity).toBe(null))
    })

    describe('when getting a result', () => {
      beforeEach(async () => {
        mockSearchToReturnSingleJsonString(redis)
        entity = await search.return.min('aNumber')
      })

      it('asks redis for the first result', () => {
        expect(redis.ft.search).toHaveBeenCalledTimes(1)
        expect(redis.ft.search).toHaveBeenCalledWith(indexName, query, {
          LIMIT: { from: 0, size: 1 },
          SORTBY: { BY: 'aNumber', DIRECTION: 'ASC' },
          RETURN: '$'
        })
      })

      it('returns the first result', () => {
        expect(entity?.aBoolean).toEqual(SIMPLE_ENTITY_1.aBoolean)
        expect(entity?.aNumber).toEqual(SIMPLE_ENTITY_1.aNumber)
        expect(entity?.aString).toEqual(SIMPLE_ENTITY_1.aString)
        expect(entity ? entity[EntityId] : null).toEqual(SIMPLE_ENTITY_1[EntityId])
      })
    })
  })
})
