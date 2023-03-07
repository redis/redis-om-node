import { Client } from "$lib/client"
import { RawSearch } from "$lib/search"

import { simpleHashSchema } from "../helpers/test-entity-and-schema"


describe("RawSearch", () => {
  describe("#query", () => {

    let client: Client
    let search: RawSearch

    beforeAll(() => {
      client = new Client()
    })

    describe("when constructed with the default query", () => {
      beforeEach(() => {
        search = new RawSearch(simpleHashSchema, client)
      })

      it("generates the default query", () => {
        expect(search.query).toBe("*")
      })
    })

    describe("when constructed with a specified query", () => {
      beforeEach(() => {
        search = new RawSearch(simpleHashSchema, client, "SOME BOGUS QUERY")
      })

      it("generates the specific query", () => {
        expect(search.query).toBe("SOME BOGUS QUERY")
      })
    })
  })
})
