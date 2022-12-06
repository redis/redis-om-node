import { Client } from "$lib/client"
import { Search, WhereField } from "$lib/search"

import { A_NUMBER, ANOTHER_NUMBER } from '../../helpers/example-data'
import { simpleSchema } from "../helpers/test-entity-and-schema"


describe("Search", () => {
  describe("#query", () => {

    let client: Client
    let search: Search
    let where: WhereField

    const AN_EQUAL_QUERY = `(@aNumber:[${A_NUMBER} ${A_NUMBER}])`
    const A_NEGATED_EQUAL_QUERY = `(-@aNumber:[${A_NUMBER} ${A_NUMBER}])`
    const A_GT_QUERY = `(@aNumber:[(${A_NUMBER} +inf])`
    const A_NEGATED_GT_QUERY = `(-@aNumber:[(${A_NUMBER} +inf])`
    const A_GTE_QUERY = `(@aNumber:[${A_NUMBER} +inf])`
    const A_NEGATED_GTE_QUERY = `(-@aNumber:[${A_NUMBER} +inf])`
    const AN_LT_QUERY = `(@aNumber:[-inf (${A_NUMBER}])`
    const A_NEGATED_LT_QUERY = `(-@aNumber:[-inf (${A_NUMBER}])`
    const AN_LTE_QUERY = `(@aNumber:[-inf ${A_NUMBER}])`
    const A_NEGATED_LTE_QUERY = `(-@aNumber:[-inf ${A_NUMBER}])`
    const A_BETWEEN_QUERY = `(@aNumber:[${ANOTHER_NUMBER} ${A_NUMBER}])`
    const A_NEGATED_BETWEEN_QUERY = `(-@aNumber:[${ANOTHER_NUMBER} ${A_NUMBER}])`

    type RangeChecker = (search: Search) => void
    const expectToBeEqualQuery: RangeChecker = search => expect(search.query).toBe(AN_EQUAL_QUERY)
    const expectToBeNegatedEqualQuery: RangeChecker = search => expect(search.query).toBe(A_NEGATED_EQUAL_QUERY)
    const expectToBeGTQuery: RangeChecker = search => expect(search.query).toBe(A_GT_QUERY)
    const expectToBeNegatedGTQuery: RangeChecker = search => expect(search.query).toBe(A_NEGATED_GT_QUERY)
    const expectToBeGTEQuery: RangeChecker = search => expect(search.query).toBe(A_GTE_QUERY)
    const expectToBeNegatedGTEQuery: RangeChecker = search => expect(search.query).toBe(A_NEGATED_GTE_QUERY)
    const expectToBeLTQuery: RangeChecker = search => expect(search.query).toBe(AN_LT_QUERY)
    const expectToBeNegatedLTQuery: RangeChecker = search => expect(search.query).toBe(A_NEGATED_LT_QUERY)
    const expectToBeLTEQuery: RangeChecker = search => expect(search.query).toBe(AN_LTE_QUERY)
    const expectToBeNegatedLTEQuery: RangeChecker = search => expect(search.query).toBe(A_NEGATED_LTE_QUERY)
    const expectToBeBetweenQuery: RangeChecker = search => expect(search.query).toBe(A_BETWEEN_QUERY)
    const expectToBeNegatedBetweenQuery: RangeChecker = search => expect(search.query).toBe(A_NEGATED_BETWEEN_QUERY)

    beforeAll(() => {
      client = new Client()
    })

    beforeEach(() => {
      search = new Search(simpleSchema, client)
      where = search.where('aNumber')
    })

    describe("when generating a query with a number", () => {

      it("generates a query with .eq", () => expectToBeEqualQuery(where.eq(A_NUMBER)))
      it("generates a query with .not.eq", () => expectToBeNegatedEqualQuery(where.not.eq(A_NUMBER)))
      it("generates a query with .equals", () => expectToBeEqualQuery(where.equals(A_NUMBER)))
      it("generates a query with .does.equal", () => expectToBeEqualQuery(where.does.equal(A_NUMBER)))
      it("generates a query with .does.not.equal", () => expectToBeNegatedEqualQuery(where.does.not.equal(A_NUMBER)))
      it("generates a query with .is.equalTo", () => expectToBeEqualQuery(where.is.equalTo(A_NUMBER)))
      it("generates a query with .is.not.equalTo", () => expectToBeNegatedEqualQuery(where.is.not.equalTo(A_NUMBER)))

      it("generates a query with .gt", () => expectToBeGTQuery(where.gt(A_NUMBER)))
      it("generates a query with .not.gt", () => expectToBeNegatedGTQuery(where.not.gt(A_NUMBER)))
      it("generates a query with .greaterThan", () => expectToBeGTQuery(where.greaterThan(A_NUMBER)))
      it("generates a query with .is.greaterThan", () => expectToBeGTQuery(where.is.greaterThan(A_NUMBER)))
      it("generates a query with .is.not.greaterThan", () => expectToBeNegatedGTQuery(where.is.not.greaterThan(A_NUMBER)))

      it("generates a query with .gte", () => expectToBeGTEQuery(where.gte(A_NUMBER)))
      it("generates a query with .not.gte", () => expectToBeNegatedGTEQuery(where.not.gte(A_NUMBER)))
      it("generates a query with .greaterThanOrEqualTo", () => expectToBeGTEQuery(where.greaterThanOrEqualTo(A_NUMBER)))
      it("generates a query with .is.greaterThanOrEqualTo", () => expectToBeGTEQuery(where.is.greaterThanOrEqualTo(A_NUMBER)))
      it("generates a query with .is.not.greaterThanOrEqualTo", () => expectToBeNegatedGTEQuery(where.is.not.greaterThanOrEqualTo(A_NUMBER)))

      it("generates a query with .lt", () => expectToBeLTQuery(where.lt(A_NUMBER)))
      it("generates a query with .not.lt", () => expectToBeNegatedLTQuery(where.not.lt(A_NUMBER)))
      it("generates a query with .lessThan", () => expectToBeLTQuery(where.lessThan(A_NUMBER)))
      it("generates a query with .is.lessThan", () => expectToBeLTQuery(where.is.lessThan(A_NUMBER)))
      it("generates a query with .is.not.lessThan", () => expectToBeNegatedLTQuery(where.is.not.lessThan(A_NUMBER)))

      it("generates a query with .lte", () => expectToBeLTEQuery(where.lte(A_NUMBER)))
      it("generates a query with .not.lte", () => expectToBeNegatedLTEQuery(where.not.lte(A_NUMBER)))
      it("generates a query with .lessThanOrEqualTo", () => expectToBeLTEQuery(where.lessThanOrEqualTo(A_NUMBER)))
      it("generates a query with .is.lessThanOrEqualTo", () => expectToBeLTEQuery(where.is.lessThanOrEqualTo(A_NUMBER)))
      it("generates a query with .is.not.lessThanOrEqualTo", () => expectToBeNegatedLTEQuery(where.is.not.lessThanOrEqualTo(A_NUMBER)))

      it("generates a query with .between", () => expectToBeBetweenQuery(where.between(ANOTHER_NUMBER, A_NUMBER)))
      it("generates a query with .not.between", () => expectToBeNegatedBetweenQuery(where.not.between(ANOTHER_NUMBER, A_NUMBER)))
      it("generates a query with .is.between", () => expectToBeBetweenQuery(where.is.between(ANOTHER_NUMBER, A_NUMBER)))
      it("generates a query with .is.not.between", () => expectToBeNegatedBetweenQuery(where.is.not.between(ANOTHER_NUMBER, A_NUMBER)))
    })
  })
})
