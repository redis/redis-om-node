import { Client } from "$lib/client"
import { Search, WhereField } from "$lib/search"

import { simpleHashSchema, simpleJsonSchema } from "../helpers/test-entity-and-schema"


describe("Search", () => {
  describe("#query", () => {

    let client: Client

    const A_TRUE_HASH_QUERY = "(@aBoolean:{1})"
    const A_FALSE_HASH_QUERY = "(@aBoolean:{0})"
    const A_NEGATED_TRUE_HASH_QUERY = "(-@aBoolean:{1})"
    const A_NEGATED_FALSE_HASH_QUERY = "(-@aBoolean:{0})"

    const A_TRUE_JSON_QUERY = "(@aBoolean:{true})"
    const A_FALSE_JSON_QUERY = "(@aBoolean:{false})"
    const A_NEGATED_TRUE_JSON_QUERY = "(-@aBoolean:{true})"
    const A_NEGATED_FALSE_JSON_QUERY = "(-@aBoolean:{false})"

    beforeAll(() => {
      client = new Client()
    })

    describe("when generating a query with a boolean for a hash", () => {

      let search: Search
      let where: WhereField

      beforeEach(() => {
        search = new Search(simpleHashSchema, client)
        where = search.where('aBoolean')
      })

      type BooleanChecker = (search: Search) => void
      const expectToBeTrueQuery: BooleanChecker = search => expect(search.query).toBe(A_TRUE_HASH_QUERY)
      const expectToBeFalseQuery: BooleanChecker = search => expect(search.query).toBe(A_FALSE_HASH_QUERY)
      const expectToBeNegatedTrueQuery: BooleanChecker = search => expect(search.query).toBe(A_NEGATED_TRUE_HASH_QUERY)
      const expectToBeNegatedFalseQuery: BooleanChecker = search => expect(search.query).toBe(A_NEGATED_FALSE_HASH_QUERY)

      it("generates a query with .eq", () => expectToBeTrueQuery(where.eq(true)))
      it("generates a query with .not.eq", () => expectToBeNegatedTrueQuery(where.not.eq(true)))
      it("generates a query with .equals", () => expectToBeTrueQuery(where.equals(true)))
      it("generates a query with .does.equal", () => expectToBeTrueQuery(where.does.equal(true)))
      it("generates a query with .does.not.equal", () => expectToBeNegatedTrueQuery(where.does.not.equal(true)))
      it("generates a query with .is.equalTo", () => expectToBeTrueQuery(where.is.equalTo(true)))
      it("generates a query with .is.not.equalTo", () => expectToBeNegatedTrueQuery(where.is.not.equalTo(true)))

      it("generates a query with .true", () => expectToBeTrueQuery(where.true()))
      it("generates a query with .is.true", () => expectToBeTrueQuery(where.is.true()))
      it("generates a query with .is.not.true", () => expectToBeNegatedTrueQuery(where.is.not.true()))

      it("generates a query with .false", () => expectToBeFalseQuery(where.false()))
      it("generates a query with .is.false", () => expectToBeFalseQuery(where.is.false()))
      it("generates a query with .is.not.false", () => expectToBeNegatedFalseQuery(where.is.not.false()))
    })

    describe("when generating a query with a boolean for JSON", () => {

      let search: Search
      let where: WhereField

      beforeEach(() => {
        search = new Search(simpleJsonSchema, client)
        where = search.where('aBoolean')
      })

      type BooleanChecker = (search: Search) => void
      const expectToBeTrueQuery: BooleanChecker = search => expect(search.query).toBe(A_TRUE_JSON_QUERY)
      const expectToBeFalseQuery: BooleanChecker = search => expect(search.query).toBe(A_FALSE_JSON_QUERY)
      const expectToBeNegatedTrueQuery: BooleanChecker = search => expect(search.query).toBe(A_NEGATED_TRUE_JSON_QUERY)
      const expectToBeNegatedFalseQuery: BooleanChecker = search => expect(search.query).toBe(A_NEGATED_FALSE_JSON_QUERY)

      it("generates a query with .eq", () => expectToBeTrueQuery(where.eq(true)))
      it("generates a query with .not.eq", () => expectToBeNegatedTrueQuery(where.not.eq(true)))
      it("generates a query with .equals", () => expectToBeTrueQuery(where.equals(true)))
      it("generates a query with .does.equal", () => expectToBeTrueQuery(where.does.equal(true)))
      it("generates a query with .does.not.equal", () => expectToBeNegatedTrueQuery(where.does.not.equal(true)))
      it("generates a query with .is.equalTo", () => expectToBeTrueQuery(where.is.equalTo(true)))
      it("generates a query with .is.not.equalTo", () => expectToBeNegatedTrueQuery(where.is.not.equalTo(true)))

      it("generates a query with .true", () => expectToBeTrueQuery(where.true()))
      it("generates a query with .is.true", () => expectToBeTrueQuery(where.is.true()))
      it("generates a query with .is.not.true", () => expectToBeNegatedTrueQuery(where.is.not.true()))

      it("generates a query with .false", () => expectToBeFalseQuery(where.false()))
      it("generates a query with .is.false", () => expectToBeFalseQuery(where.is.false()))
      it("generates a query with .is.not.false", () => expectToBeNegatedFalseQuery(where.is.not.false()))
    })
  })
})
