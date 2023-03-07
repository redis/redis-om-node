import { client } from '../helpers/mock-client'
import { Client } from "$lib/client"
import { EntityId } from '$lib/entity'
import { Search, RawSearch } from "$lib/search"

import { simpleHashSchema } from "../helpers/test-entity-and-schema"
import { mockClientSearchToReturnNothing, mockClientSearchToReturnSingleKey,
  SIMPLE_ENTITY_1 } from '../helpers/search-helpers'

console.warn = vi.fn()


type HashSearch = Search | RawSearch


describe.each([
  [ "FluentSearch",
    new Search(simpleHashSchema, new Client()) ],
  [ "RawSearch",
    new RawSearch(simpleHashSchema, new Client()) ]
])("%s", (_, search: HashSearch) => {

  describe("#returnMaxKey", () => {
    let key: string | null
    let indexName = 'SimpleHashEntity:index', query = '*'

    describe("when querying no results", () => {
      beforeEach( async () => {
        mockClientSearchToReturnNothing()
        key = await search.return.maxKey('aNumber')
      })

      it("asks the client for the first result of a given repository", () => {
        expect(client.search).toHaveBeenCalledTimes(1)
        expect(client.search).toHaveBeenCalledWith(indexName, query, {
          LIMIT: { from: 0, size: 1 },
          SORTBY: { BY: 'aNumber', DIRECTION: 'DESC' },
          RETURN: []
        })
      })

      it("return no result", () => expect(key).toBe(null))
    })

    describe("when getting a result", () => {
      beforeEach(async () => {
        mockClientSearchToReturnSingleKey()
        key = await search.return.maxKey('aNumber')
      })

      it("asks the client for the first result of a given repository", () => {
        expect(client.search).toHaveBeenCalledTimes(1)
        expect(client.search).toHaveBeenCalledWith(indexName, query, {
          LIMIT: { from: 0, size: 1 },
          SORTBY: { BY: 'aNumber', DIRECTION: 'DESC' },
          RETURN: []
        })
      })

      it("returns the first result of a given repository", () => {
        expect(key).toEqual(`SimpleHashEntity:${SIMPLE_ENTITY_1[EntityId]}`)
      })
    })
  })
})
