import { Client } from "$lib/client"
import { Search, WhereField } from "$lib/search"

import { A_DATE, A_DATE_EPOCH, ANOTHER_DATE, ANOTHER_DATE_EPOCH, A_DATE_ISO } from '../../helpers/example-data'
import { simpleSchema } from "../helpers/test-entity-and-schema"


describe("Search", () => {
  describe("#query", () => {

    let client: Client
    let search: Search
    let where: WhereField

    const AN_EQUAL_QUERY = `(@aDate:[${A_DATE_EPOCH} ${A_DATE_EPOCH}])`
    const A_NEGATED_EQUAL_QUERY = `(-@aDate:[${A_DATE_EPOCH} ${A_DATE_EPOCH}])`
    const A_GT_QUERY = `(@aDate:[(${A_DATE_EPOCH} +inf])`
    const A_NEGATED_GT_QUERY = `(-@aDate:[(${A_DATE_EPOCH} +inf])`
    const A_GTE_QUERY = `(@aDate:[${A_DATE_EPOCH} +inf])`
    const A_NEGATED_GTE_QUERY = `(-@aDate:[${A_DATE_EPOCH} +inf])`
    const AN_LT_QUERY = `(@aDate:[-inf (${A_DATE_EPOCH}])`
    const A_NEGATED_LT_QUERY = `(-@aDate:[-inf (${A_DATE_EPOCH}])`
    const AN_LTE_QUERY = `(@aDate:[-inf ${A_DATE_EPOCH}])`
    const A_NEGATED_LTE_QUERY = `(-@aDate:[-inf ${A_DATE_EPOCH}])`
    const A_BETWEEN_QUERY = `(@aDate:[${ANOTHER_DATE_EPOCH} ${A_DATE_EPOCH}])`
    const A_NEGATED_BETWEEN_QUERY = `(-@aDate:[${ANOTHER_DATE_EPOCH} ${A_DATE_EPOCH}])`

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
      where = search.where('aDate')
    })

    describe.each([
      [ "when generating a query with a date as a JavaScript Date type", A_DATE ],
      [ "when generating a query with a date as a unix timestamp", A_DATE_EPOCH ],
      [ "when generating a query with a date as an ISO-8601 date", A_DATE_ISO ]
    ])("%s", (_, aDate: Date | number | string) => {

      it("generates a query with .eq", () => expectToBeEqualQuery(where.eq(aDate)))
      it("generates a query with .not.eq", () => expectToBeNegatedEqualQuery(where.not.eq(aDate)))
      it("generates a query with .equals", () => expectToBeEqualQuery(where.equals(aDate)))
      it("generates a query with .does.equal", () => expectToBeEqualQuery(where.does.equal(aDate)))
      it("generates a query with .does.not.equal", () => expectToBeNegatedEqualQuery(where.does.not.equal(aDate)))
      it("generates a query with .is.equalTo", () => expectToBeEqualQuery(where.is.equalTo(aDate)))
      it("generates a query with .is.not.equalTo", () => expectToBeNegatedEqualQuery(where.is.not.equalTo(aDate)))

      it("generates a query with .gt", () => expectToBeGTQuery(where.gt(aDate)))
      it("generates a query with .not.gt", () => expectToBeNegatedGTQuery(where.not.gt(aDate)))
      it("generates a query with .greaterThan", () => expectToBeGTQuery(where.greaterThan(aDate)))
      it("generates a query with .is.greaterThan", () => expectToBeGTQuery(where.is.greaterThan(aDate)))
      it("generates a query with .is.not.greaterThan", () => expectToBeNegatedGTQuery(where.is.not.greaterThan(aDate)))

      it("generates a query with .gte", () => expectToBeGTEQuery(where.gte(aDate)))
      it("generates a query with .not.gte", () => expectToBeNegatedGTEQuery(where.not.gte(aDate)))
      it("generates a query with .greaterThanOrEqualTo", () => expectToBeGTEQuery(where.greaterThanOrEqualTo(aDate)))
      it("generates a query with .is.greaterThanOrEqualTo", () => expectToBeGTEQuery(where.is.greaterThanOrEqualTo(aDate)))
      it("generates a query with .is.not.greaterThanOrEqualTo", () => expectToBeNegatedGTEQuery(where.is.not.greaterThanOrEqualTo(aDate)))

      it("generates a query with .lt", () => expectToBeLTQuery(where.lt(aDate)))
      it("generates a query with .not.lt", () => expectToBeNegatedLTQuery(where.not.lt(aDate)))
      it("generates a query with .lessThan", () => expectToBeLTQuery(where.lessThan(aDate)))
      it("generates a query with .is.lessThan", () => expectToBeLTQuery(where.is.lessThan(aDate)))
      it("generates a query with .is.not.lessThan", () => expectToBeNegatedLTQuery(where.is.not.lessThan(aDate)))

      it("generates a query with .lte", () => expectToBeLTEQuery(where.lte(aDate)))
      it("generates a query with .not.lte", () => expectToBeNegatedLTEQuery(where.not.lte(aDate)))
      it("generates a query with .lessThanOrEqualTo", () => expectToBeLTEQuery(where.lessThanOrEqualTo(aDate)))
      it("generates a query with .is.lessThanOrEqualTo", () => expectToBeLTEQuery(where.is.lessThanOrEqualTo(aDate)))
      it("generates a query with .is.not.lessThanOrEqualTo", () => expectToBeNegatedLTEQuery(where.is.not.lessThanOrEqualTo(aDate)))

      it("generates a query with .on", () => expectToBeEqualQuery(where.on(aDate)))
      it("generates a query with .not.on", () => expectToBeNegatedEqualQuery(where.not.on(aDate)))
      it("generates a query with .is.on", () => expectToBeEqualQuery(where.is.on(aDate)))
      it("generates a query with .is.not.on", () => expectToBeNegatedEqualQuery(where.is.not.on(aDate)))

      it("generates a query with .before", () => expectToBeLTQuery(where.before(aDate)))
      it("generates a query with .not.before", () => expectToBeNegatedLTQuery(where.not.before(aDate)))
      it("generates a query with .is.before", () => expectToBeLTQuery(where.is.before(aDate)))
      it("generates a query with .is.not.before", () => expectToBeNegatedLTQuery(where.is.not.before(aDate)))

      it("generates a query with .onOrBefore", () => expectToBeLTEQuery(where.onOrBefore(aDate)))
      it("generates a query with .not.onOrBefore", () => expectToBeNegatedLTEQuery(where.not.onOrBefore(aDate)))
      it("generates a query with .is.onOrBefore", () => expectToBeLTEQuery(where.is.onOrBefore(aDate)))
      it("generates a query with .is.not.onOrBefore", () => expectToBeNegatedLTEQuery(where.is.not.onOrBefore(aDate)))

      it("generates a query with .after", () => expectToBeGTQuery(where.after(aDate)))
      it("generates a query with .not.after", () => expectToBeNegatedGTQuery(where.not.after(aDate)))
      it("generates a query with .is.after", () => expectToBeGTQuery(where.is.after(aDate)))
      it("generates a query with .is.not.after", () => expectToBeNegatedGTQuery(where.is.not.after(aDate)))

      it("generates a query with .onOrAfter", () => expectToBeGTEQuery(where.onOrAfter(aDate)))
      it("generates a query with .not.onOrAfter", () => expectToBeNegatedGTEQuery(where.not.onOrAfter(aDate)))
      it("generates a query with .is.onOrAfter", () => expectToBeGTEQuery(where.is.onOrAfter(aDate)))
      it("generates a query with .is.not.onOrAfter", () => expectToBeNegatedGTEQuery(where.is.not.onOrAfter(aDate)))

      it("generates a query with .between", () => expectToBeBetweenQuery(where.between(ANOTHER_DATE, aDate)))
      it("generates a query with .not.between", () => expectToBeNegatedBetweenQuery(where.not.between(ANOTHER_DATE, aDate)))
      it("generates a query with .is.between", () => expectToBeBetweenQuery(where.is.between(ANOTHER_DATE, aDate)))
      it("generates a query with .is.not.between", () => expectToBeNegatedBetweenQuery(where.is.not.between(ANOTHER_DATE, aDate)))
    })
  })
})
