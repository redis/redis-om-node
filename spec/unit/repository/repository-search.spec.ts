import { mockRedis } from '../helpers/mock-redis'

import { RedisConnection } from '$lib/client'
import { AbstractSearch, Search, RawSearch } from '$lib/search'
import { Repository } from '$lib/repository'

import { simpleSchema } from '../helpers/test-entity-and-schema'

describe('Repository', () => {
  let redis: RedisConnection
  let repository: Repository
  let search: AbstractSearch

  beforeEach(() => {
    redis = mockRedis()
    repository = new Repository(simpleSchema, redis)
  })

  describe('#searchRaw', () => {
    beforeEach(async () => {
      search = repository.searchRaw('NOT A VALID QUERY BUT HEY WHATEVER')
    })

    it('returns a RawSearch instance', () => expect(search).toBeInstanceOf(RawSearch))

    describe('the RawSearch instance', () => {
      it('has the provided schema', () => {
        // @ts-ignore: peek inside since I can't mock the constructor
        expect(search.schema).toBe(simpleSchema)
      })

      it('has the provided redis instance', () => {
        // @ts-ignore: peek inside since I can't mock the constructor
        expect(search.redis).toBe(redis)
      })

      it('has the provided query', () => {
        // @ts-ignore: peek inside since I can't mock the constructor
        expect(search.rawQuery).toBe('NOT A VALID QUERY BUT HEY WHATEVER')
      })
    })
  })

  describe('#search', () => {
    beforeEach(async () => {
      search = repository.search()
    })

    it('returns a Search instance', () => expect(search).toBeInstanceOf(Search))

    describe('the Search instance', () => {
      it('has the provided schema', () => {
        // @ts-ignore: peek inside since I can't mock the constructor
        expect(search.schema).toBe(simpleSchema)
      })

      it('has the provided redis instance', () => {
        // @ts-ignore: peek inside since I can't mock the constructor
        expect(search.redis).toBe(redis)
      })
    })
  })
})
