import { client } from '../helpers/mock-client'
import { Client } from "$lib/client"
import { EntityId } from '$lib/entity'
import { Search, RawSearch } from "$lib/search"

import { simpleHashSchema } from "../helpers/test-entity-and-schema"
import { mockClientSearchToReturnNothing, mockClientSearchToReturnSingleKey, mockClientSearchToReturnMultipleKeys,
  mockClientSearchToReturnPaginatedKeys,
  SIMPLE_ENTITY_1, SIMPLE_ENTITY_2, SIMPLE_ENTITY_3, SIMPLE_ENTITY_4, SIMPLE_ENTITY_5 } from '../helpers/search-helpers'


type HashSearch = Search | RawSearch

describe("Search", () => {

  describe.each([
    [ "FluentSearch",
      new Search(simpleHashSchema, new Client()) ],
    [ "RawSearch",
      new RawSearch(simpleHashSchema, new Client()) ]
  ])("%s", (_, search: HashSearch) => {

    describe("#returnAllKeys", () => {
      let keys: string[]
      let indexName = 'SimpleHashEntity:index', query = '*'

      describe("when querying no results", () => {
        beforeEach(async () => {
          mockClientSearchToReturnNothing()
          keys = await search.return.allKeys()
        })

        it("askes the client for a single page of results", () => {
          expect(client.search).toHaveBeenCalledTimes(1)
          expect(client.search).toHaveBeenCalledWith(indexName, query, {
            LIMIT: { from: 0, size: 10 },
            RETURN: []
          })
        })

        it("returns no results", () => expect(keys).toHaveLength(0))
      })

      describe("when querying a single result", () => {
        beforeEach(async () => {
          mockClientSearchToReturnSingleKey()
          keys = await search.return.allKeys()
        })

        it("askes the client for a a single page of results", () => {
          expect(client.search).toHaveBeenCalledTimes(1)
          expect(client.search).toHaveBeenCalledWith(indexName, query, {
            LIMIT: { from: 0, size: 10 },
            RETURN: []
          })
        })

        it("returns the expected single result", () => {
          expect(keys).toHaveLength(1)
          expect(keys).toEqual(expect.arrayContaining([
            `SimpleHashEntity:${SIMPLE_ENTITY_1[EntityId]}`
          ]))
        })
      })

      describe("when querying multiple results", () => {
        beforeEach(async () => {
          mockClientSearchToReturnMultipleKeys()
          keys = await search.return.allKeys()
        })

        it("askes the client for a single page of results", () => {
          expect(client.search).toHaveBeenCalledTimes(1)
          expect(client.search).toHaveBeenCalledWith(indexName, query, {
            LIMIT: { from: 0, size: 10 },
            RETURN: []
          })
        })

        it("returns all the results", async () => {
          expect(keys).toHaveLength(3)
          expect(keys).toEqual(expect.arrayContaining([
            `SimpleHashEntity:${SIMPLE_ENTITY_1[EntityId]}`,
            `SimpleHashEntity:${SIMPLE_ENTITY_2[EntityId]}`,
            `SimpleHashEntity:${SIMPLE_ENTITY_3[EntityId]}`
          ]))
        })
      })

      describe("when querying multiple results that cross the page boundry", () => {
        beforeEach(async () => {
          mockClientSearchToReturnPaginatedKeys()
          keys = await search.return.allKeys({ pageSize: 2 })
        })

        it("askes the client for multiple pages of results", () => {
          expect(client.search).toHaveBeenCalledTimes(3)
          expect(client.search).toHaveBeenCalledWith(indexName, query, {
            LIMIT: { from: 0, size: 2 },
            RETURN: []
          })
        })

        it("returns all the results", async () => {
          expect(keys).toHaveLength(5)
          expect(keys).toEqual(expect.arrayContaining([
            `SimpleHashEntity:${SIMPLE_ENTITY_1[EntityId]}`,
            `SimpleHashEntity:${SIMPLE_ENTITY_2[EntityId]}`,
            `SimpleHashEntity:${SIMPLE_ENTITY_3[EntityId]}`,
            `SimpleHashEntity:${SIMPLE_ENTITY_4[EntityId]}`,
            `SimpleHashEntity:${SIMPLE_ENTITY_5[EntityId]}`
          ]))
        })
      })
    })
  })
})
