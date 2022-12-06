import { client } from '../helpers/mock-client'
import { Client } from "$lib/client"
import { Search, RawSearch } from "$lib/search"

import { simpleHashSchema } from "../helpers/test-entity-and-schema"
import { mockClientSearchToReturnNothing,
  mockClientSearchToReturnSingleKey, mockClientSearchToReturnMultipleKeys,
  SIMPLE_ENTITY_1, SIMPLE_ENTITY_2, SIMPLE_ENTITY_3 } from '../helpers/search-helpers'


type HashSearch = Search | RawSearch

describe.each([
  [ "FluentSearch",
    new Search(simpleHashSchema, new Client()) ],
  [ "RawSearch",
    new RawSearch(simpleHashSchema, new Client()) ]
])("%s", (_, search: HashSearch) => {

  describe("#returnPageOfIds", () => {

    let keys: string[]
    let indexName = 'SimpleHashEntity:index', query = '*'

    describe("when querying no results", () => {
      beforeEach(async () => {
        mockClientSearchToReturnNothing()
        keys = await search.return.pageOfIds(0, 5)
      })

      it("askes the client for results", () => {
        expect(client.search).toHaveBeenCalledTimes(1)
        expect(client.search).toHaveBeenCalledWith({
          indexName, query, limit: { offset: 0, count: 5 }, keysOnly: true })
      })

      it("returns no results", () => expect(keys).toHaveLength(0))
    })

    describe("when querying a single result", () => {
      beforeEach(async () => {
        mockClientSearchToReturnSingleKey()
        keys = await search.return.pageOfIds(0, 5)
      })

      it("askes the client for results", () => {
        expect(client.search).toHaveBeenCalledTimes(1)
        expect(client.search).toHaveBeenCalledWith({
          indexName, query, limit: { offset: 0, count: 5 }, keysOnly: true })
      })

      it("returns the expected single result", () => {
        expect(keys).toHaveLength(1)
        expect(keys).toEqual(expect.arrayContaining([
          SIMPLE_ENTITY_1.entityId
        ]))
      })
    })

    describe("when querying multiple results", () => {
      beforeEach(async () => {
        mockClientSearchToReturnMultipleKeys()
        keys = await search.return.pageOfIds(0, 5)
      })

      it("askes the client for results", () => {
        expect(client.search).toHaveBeenCalledTimes(1)
        expect(client.search).toHaveBeenCalledWith({
          indexName, query, limit: { offset: 0, count: 5 }, keysOnly: true })
      })

      it("returns all the results", async () => {
        expect(keys).toHaveLength(3)
        expect(keys).toEqual(expect.arrayContaining([
          SIMPLE_ENTITY_1.entityId,
          SIMPLE_ENTITY_2.entityId,
          SIMPLE_ENTITY_3.entityId
        ]))
      })
    })
  })
})
