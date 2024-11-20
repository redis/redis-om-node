import { client } from '../helpers/mock-client'
import { Client } from '$lib/client'
import { EntityId } from '$lib/entity'
import { Search, RawSearch } from '$lib/search'

import { simpleHashSchema } from '../helpers/test-entity-and-schema'
import {
  mockClientSearchToReturnNothing,
  mockClientSearchToReturnSingleKey,
  mockClientSearchToReturnMultipleKeys,
  mockClientSearchToReturnPaginatedKeys,
  SIMPLE_ENTITY_1,
  SIMPLE_ENTITY_2,
  SIMPLE_ENTITY_3,
  SIMPLE_ENTITY_4,
  SIMPLE_ENTITY_5
} from '../helpers/search-helpers'

type HashSearch = Search | RawSearch

describe('Search', () => {
  describe.each([
    ['FluentSearch', new Search(simpleHashSchema, new Client())],
    ['RawSearch', new RawSearch(simpleHashSchema, new Client())]
  ])('%s', (_, search: HashSearch) => {
    describe('#iteratorOfIds', () => {
      let ids: string[]
      let indexName = 'SimpleHashEntity:index'
      let query = '*'

      beforeEach(() => {
        ids = []
      })

      describe('when querying no results', () => {
        beforeEach(async () => {
          mockClientSearchToReturnNothing()
          for await (const id of search.return.iteratorOfIds()) ids.push(id)
        })

        it('asks the client for a single page of results', () => {
          expect(client.search).toHaveBeenCalledTimes(1)
          expect(client.search).toHaveBeenCalledWith(indexName, query, {
            LIMIT: { from: 0, size: 10 },
            RETURN: []
          })
        })

        it('returns no results', () => expect(ids).toHaveLength(0))
      })

      describe('when querying a single result', () => {
        beforeEach(async () => {
          mockClientSearchToReturnSingleKey()
          for await (const id of search.return.iteratorOfIds()) ids.push(id)
        })

        it('asks the client for a a single page of results', () => {
          expect(client.search).toHaveBeenCalledTimes(1)
          expect(client.search).toHaveBeenCalledWith(indexName, query, {
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
          mockClientSearchToReturnMultipleKeys()
          for await (const id of search.return.iteratorOfIds()) ids.push(id)
        })

        it('asks the client for a single page of results', () => {
          expect(client.search).toHaveBeenCalledTimes(1)
          expect(client.search).toHaveBeenCalledWith(indexName, query, {
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
          mockClientSearchToReturnPaginatedKeys()
          for await (const id of search.return.iteratorOfIds({ pageSize: 2 })) ids.push(id)
        })

        it('asks the client for multiple pages of results', () => {
          expect(client.search).toHaveBeenCalledTimes(3)
          expect(client.search).toHaveBeenCalledWith(indexName, query, {
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
})
