import '../helpers/mock-client'

import { Client } from '$lib/client'
import { AbstractSearch, Search, RawSearch } from '$lib/search'
import { Repository } from '$lib/repository'

import { simpleSchema } from '../helpers/test-entity-and-schema'

describe("Repository", () => {

  let client: Client
  let repository: Repository
  let search: AbstractSearch

  beforeEach(() => {
    client = new Client()
    repository = new Repository(simpleSchema, client)
  })

  describe("#searchRaw", () => {

    beforeEach(async () => {
      search = repository.searchRaw("NOT A VALID QUERY BUT HEY WHATEVER")
    })

    it("returns a RawSearch instance", () => expect(search).toBeInstanceOf(RawSearch))

    describe("the RawSearch instance", () => {
      it("has the provided schema", () => {
        // @ts-ignore: peek inside since I can't mock the constructor
        expect(search.schema).toBe(simpleSchema)
      })

      it("has the provided client", () => {
        // @ts-ignore: peek inside since I can't mock the constructor
        expect(search.client).toBe(client)
      })

      it("has the provided query", () => {
        // @ts-ignore: peek inside since I can't mock the constructor
        expect(search.rawQuery).toBe("NOT A VALID QUERY BUT HEY WHATEVER")
      })
    })
  })

  describe("#search", () => {

    beforeEach(async () => {
      repository = new Repository(simpleSchema, client);
      search = repository.search();
    })

    it("returns a Search instance", () => expect(search).toBeInstanceOf(Search))

    describe("the Search instance", () => {
      it("has the provided schema", () => {
        // @ts-ignore: peek inside since I can't mock the constructor
        expect(search.schema).toBe(simpleSchema)
      })

      it("has the provided client", () => {
        // @ts-ignore: peek inside since I can't mock the constructor
        expect(search.client).toBe(client)
      })
    })
  })
})
