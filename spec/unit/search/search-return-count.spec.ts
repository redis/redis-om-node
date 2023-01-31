import { client } from '../helpers/mock-client'
import { Client } from "$lib/client"
import { Search, RawSearch } from "$lib/search"

import { simpleHashSchema, simpleJsonSchema } from "../helpers/test-entity-and-schema"
import { mockClientSearchToReturnCountOf } from "../helpers/search-helpers"


type HashSearch = Search | RawSearch
type JsonSearch = Search | RawSearch

describe("Search", () => {

  describe.each([
    [ "FluentSearch",
      new Search(simpleHashSchema, new Client()),
      new Search(simpleJsonSchema, new Client()) ],
    [ "RawSearch",
      new RawSearch(simpleHashSchema, new Client()),
      new RawSearch(simpleJsonSchema, new Client()) ]
  ])("%s", (_, hashSearch: HashSearch, jsonSearch: JsonSearch) => {

    let actualCount: number

    describe("#returnCount", () => {
      let query = '*', offset = 0, count = 0

      describe("when counting results from hashes", () => {

        beforeEach(async () => {
          mockClientSearchToReturnCountOf(3)
          actualCount = await hashSearch.return.count()
        })

        it("askes the client for results", () => {
          expect(client.search).toHaveBeenCalledTimes(1)
          expect(client.search).toHaveBeenCalledWith('SimpleHashEntity:index', query, {
            LIMIT: { from: offset, size: count } })
        })

        it("returns the expected count", () => expect(actualCount).toBe(3))
      })

      describe("when running against JSON objects", () => {
        beforeEach(async () => {
          mockClientSearchToReturnCountOf(3)
          actualCount = await jsonSearch.return.count()
        })

        it("askes the client for results", () => {
          expect(client.search).toHaveBeenCalledTimes(1)
          expect(client.search).toHaveBeenCalledWith('SimpleJsonEntity:index', query, {
            LIMIT: { from: offset, size: count },
            RETURN: '$'
          })
        })

        it("returns the expected count", () => expect(actualCount).toBe(3))
      })
    })
  })
})
