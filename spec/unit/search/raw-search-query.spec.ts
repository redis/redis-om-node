import { RawSearch } from '$lib/search'
import { RedisConnection } from '$lib/client'

import { mockRedis } from '../helpers/mock-redis'
import { simpleHashSchema } from '../helpers/test-entity-and-schema'

describe('RawSearch', () => {
  describe('#query', () => {
    let redis: RedisConnection
    let search: RawSearch

    beforeAll(async () => {
      redis = mockRedis()
    })

    describe('when constructed with the default query', () => {
      beforeEach(() => {
        search = new RawSearch(simpleHashSchema, redis)
      })

      it('generates the default query', () => {
        expect(search.query).toBe('*')
      })
    })

    describe('when constructed with a specified query', () => {
      beforeEach(() => {
        search = new RawSearch(simpleHashSchema, redis, 'SOME BOGUS QUERY')
      })

      it('generates the specific query', () => {
        expect(search.query).toBe('SOME BOGUS QUERY')
      })
    })
  })
})
