import { client } from '../helpers/mock-client'
import { Client } from '$lib/client'
import { Search, RawSearch } from '$lib/search'

import { simpleHashSchema, simpleJsonSchema } from '../helpers/test-entity-and-schema'
import {
  mockClientSearchToReturnNothing,
  mockClientSearchToReturnSingleHash,
  mockClientSearchToReturnSingleJsonString,
  mockClientSearchToReturnMultipleHashes,
  mockClientSearchToReturnMultipleJsonStrings,
  mockClientSearchToReturnPaginatedHashes,
  mockClientSearchToReturnPaginatedJsonStrings,
  SIMPLE_ENTITY_1,
  SIMPLE_ENTITY_2,
  SIMPLE_ENTITY_3,
  SIMPLE_ENTITY_4,
  SIMPLE_ENTITY_5
} from '../helpers/search-helpers'

type HashSearch = Search | RawSearch
type JsonSearch = Search | RawSearch

describe('Search', () => {
  describe.each([
    ['FluentSearch', new Search(simpleHashSchema, new Client()), new Search(simpleJsonSchema, new Client())],
    ['RawSearch', new RawSearch(simpleHashSchema, new Client()), new RawSearch(simpleJsonSchema, new Client())]
  ])('%s', (_, hashSearch: HashSearch, jsonSearch: JsonSearch) => {
    describe('#iterator', () => {
      describe('when running against hashes', () => {
        let entities: object[]
        let indexName = 'SimpleHashEntity:index'
        let query = '*'

        beforeEach(() => {
          entities = []
        })

        describe('when querying no results', () => {
          beforeEach(async () => {
            mockClientSearchToReturnNothing()
            for await (const entity of hashSearch.return.iterator()) entities.push(entity)
          })

          it('asks the client for a single page of results', () => {
            expect(client.search).toHaveBeenCalledTimes(1)
            expect(client.search).toHaveBeenCalledWith(indexName, query, {
              LIMIT: { from: 0, size: 10 }
            })
          })

          it('returns no results', () => expect(entities).toHaveLength(0))
        })

        describe('when querying a single result', () => {
          beforeEach(async () => {
            mockClientSearchToReturnSingleHash()
            for await (const entity of hashSearch.return.iterator()) entities.push(entity)
          })

          it('asks the client for a a single page of results', () => {
            expect(client.search).toHaveBeenCalledTimes(1)
            expect(client.search).toHaveBeenCalledWith(indexName, query, {
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
            mockClientSearchToReturnMultipleHashes()
            for await (const entity of hashSearch.return.iterator()) entities.push(entity)
          })

          it('asks the client for a single page of results', () => {
            expect(client.search).toHaveBeenCalledTimes(1)
            expect(client.search).toHaveBeenCalledWith(indexName, query, {
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
            mockClientSearchToReturnPaginatedHashes()
            for await (const entity of hashSearch.return.iterator({ pageSize: 2 })) entities.push(entity)
          })

          it('asks the client for multiple pages of results', () => {
            expect(client.search).toHaveBeenCalledTimes(3)
            expect(client.search).toHaveBeenCalledWith(indexName, query, {
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
        let entities: object[]
        let indexName = 'SimpleJsonEntity:index'
        let query = '*'

        beforeEach(() => {
          entities = []
        })

        describe('when querying no results', () => {
          beforeEach(async () => {
            mockClientSearchToReturnNothing()
            for await (const entity of jsonSearch.return.iterator()) entities.push(entity)
          })

          it('asks the client for a single page of results', () => {
            expect(client.search).toHaveBeenCalledTimes(1)
            expect(client.search).toHaveBeenCalledWith(indexName, query, {
              LIMIT: { from: 0, size: 10 },
              RETURN: '$'
            })
          })

          it('returns no results', () => expect(entities).toHaveLength(0))
        })

        describe('when querying a single result', () => {
          beforeEach(async () => {
            mockClientSearchToReturnSingleJsonString()
            for await (const entity of jsonSearch.return.iterator()) entities.push(entity)
          })

          it('asks the client for a single page of results', () => {
            expect(client.search).toHaveBeenCalledTimes(1)
            expect(client.search).toHaveBeenCalledWith(indexName, query, {
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
            mockClientSearchToReturnMultipleJsonStrings()
            for await (const entity of jsonSearch.return.iterator()) entities.push(entity)
          })

          it('asks the client for a single page of results', () => {
            expect(client.search).toHaveBeenCalledTimes(1)
            expect(client.search).toHaveBeenCalledWith(indexName, query, {
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
            mockClientSearchToReturnPaginatedJsonStrings()
            for await (const entity of jsonSearch.return.iterator({ pageSize: 2 })) entities.push(entity)
          })

          it('asks the client for a multiple pages of results', () => {
            expect(client.search).toHaveBeenCalledTimes(3)
            expect(client.search).toHaveBeenCalledWith(indexName, query, {
              LIMIT: { from: 0, size: 2 },
              RETURN: '$'
            })
            expect(client.search).toHaveBeenCalledWith(indexName, query, {
              LIMIT: { from: 2, size: 2 },
              RETURN: '$'
            })
            expect(client.search).toHaveBeenCalledWith(indexName, query, {
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
})
