import '../../helpers/custom-matchers'

import { Client } from "$lib/client"
import { SemanticSearchError } from "$lib/error"
import { Search, WhereField } from "$lib/search"

import { A_STRING, A_NUMBER } from '../../helpers/example-data'
import { simpleSchema } from "../helpers/test-entity-and-schema"


describe("Search", () => {
  describe("#query", () => {

    let client: Client
    let search: Search
    let where: WhereField

    const A_STRING_QUERY = `(@aString:{${A_STRING}})`
    const A_NEGATED_STRING_QUERY = `(-@aString:{${A_STRING}})`
    const A_NUMBER_STRING_QUERY = `(@aString:{${A_NUMBER}})`
    const A_NEGATED_NUMBER_STRING_QUERY = `(-@aString:{${A_NUMBER}})`
    const A_BOOLEAN_STRING_QUERY = `(@aString:{true})`
    const A_NEGATED_BOOLEAN_STRING_QUERY = `(-@aString:{true})`

    type StringChecker = (search: Search) => void
    const expectToBeStringQuery: StringChecker = search => expect(search.query).toBe(A_STRING_QUERY)
    const expectToBeNegatedStringQuery: StringChecker = search => expect(search.query).toBe(A_NEGATED_STRING_QUERY)
    const expectToBeNumberStringQuery: StringChecker = search => expect(search.query).toBe(A_NUMBER_STRING_QUERY)
    const expectToBeNegatedNumberStringQuery: StringChecker = search => expect(search.query).toBe(A_NEGATED_NUMBER_STRING_QUERY)
    const expectToBeBooleanStringQuery: StringChecker = search => expect(search.query).toBe(A_BOOLEAN_STRING_QUERY)
    const expectToBeNegatedBooleanStringQuery: StringChecker = search => expect(search.query).toBe(A_NEGATED_BOOLEAN_STRING_QUERY)

    beforeAll(() => {
      client = new Client()
    })

    beforeEach(() => {
      search = new Search(simpleSchema, client)
      where = search.where('aString')
    })

    describe("when generating a query with a string", () => {
      it("generates a query with .eq", () => expectToBeStringQuery(where.equals(A_STRING)))
      it("generates a query with .not.eq", () => expectToBeNegatedStringQuery(where.not.eq(A_STRING)))
      it("generates a query with .equals", () => expectToBeStringQuery(where.equals(A_STRING)))
      it("generates a query with .does.equal", () => expectToBeStringQuery(where.does.equal(A_STRING)))
      it("generates a query with .does.not.equal", () => expectToBeNegatedStringQuery(where.does.not.equal(A_STRING)))
      it("generates a query with .is.equalTo", () => expectToBeStringQuery(where.is.equalTo(A_STRING)))
      it("generates a query with .is.not.equalTo", () => expectToBeNegatedStringQuery(where.is.not.equalTo(A_STRING)))
    })

    describe("when generating a query with a number as a string", () => {
      it("generates a query with .eq", () => expectToBeNumberStringQuery(where.equals(A_NUMBER)))
      it("generates a query with .not.eq", () => expectToBeNegatedNumberStringQuery(where.not.eq(A_NUMBER)))
      it("generates a query with .equals", () => expectToBeNumberStringQuery(where.equals(A_NUMBER)))
      it("generates a query with .does.equal", () => expectToBeNumberStringQuery(where.does.equal(A_NUMBER)))
      it("generates a query with .does.not.equal", () => expectToBeNegatedNumberStringQuery(where.does.not.equal(A_NUMBER)))
      it("generates a query with .is.equalTo", () => expectToBeNumberStringQuery(where.is.equalTo(A_NUMBER)))
      it("generates a query with .is.not.equalTo", () => expectToBeNegatedNumberStringQuery(where.is.not.equalTo(A_NUMBER)))
    })

    describe("when generating a query with a boolean as a string", () => {
      it("generates a query with .eq", () => expectToBeBooleanStringQuery(where.equals(true)))
      it("generates a query with .not.eq", () => expectToBeNegatedBooleanStringQuery(where.not.eq(true)))
      it("generates a query with .equals", () => expectToBeBooleanStringQuery(where.equals(true)))
      it("generates a query with .does.equal", () => expectToBeBooleanStringQuery(where.does.equal(true)))
      it("generates a query with .does.not.equal", () => expectToBeNegatedBooleanStringQuery(where.does.not.equal(true)))
      it("generates a query with .is.equalTo", () => expectToBeBooleanStringQuery(where.is.equalTo(true)))
      it("generates a query with .is.not.equalTo", () => expectToBeNegatedBooleanStringQuery(where.is.not.equalTo(true)))
    })

    describe("when generating a query with special characters in the string", () => {
      it("generates a query that escapes punctuation between text", () => {
        let query = where.eq('foo,bar baz').query
        expect(query).toBe("(@aString:{foo\\,bar\\ baz})")
      })

      it("generates a query that escapes all punctuation", () => {
        let query = where.eq(",.<>{}[]\"':;!@#$%^&()-+=~|/\\ ").query
        expect(query).toBe("(@aString:{\\,\\.\\<\\>\\{\\}\\[\\]\\\"\\'\\:\\;\\!\\@\\#\\$\\%\\^\\&\\(\\)\\-\\+\\=\\~\\|\\/\\\\\\ })")
      })

      it("generates a query with a prefix matching wildcard", () => {
        let query = where.eq("foo*").query
        expect(query).toBe("(@aString:{foo*})")
      })
    })

    describe("when trying to perform full-text search on a string", () => {
      const EXPECTED_EXCEPTION = "Cannot perform full-text search operations like .match on field of type 'string'. If full-text search is needed on this field, change the type to 'text' in the Schema."
      it("throws an exception telling you what to do", () => {
        expect(() => where.match(A_STRING)).toThrowErrorOfType(SemanticSearchError, EXPECTED_EXCEPTION)
        expect(() => where.matchExact(A_STRING)).toThrowErrorOfType(SemanticSearchError, EXPECTED_EXCEPTION)
        expect(() => where.exact.match(A_STRING)).toThrowErrorOfType(SemanticSearchError, EXPECTED_EXCEPTION)
        expect(() => where.exact.matches(A_STRING)).toThrowErrorOfType(SemanticSearchError, EXPECTED_EXCEPTION)
        expect(() => where.matchExactly(A_STRING)).toThrowErrorOfType(SemanticSearchError, EXPECTED_EXCEPTION)
        expect(() => where.matches(A_STRING)).toThrowErrorOfType(SemanticSearchError, EXPECTED_EXCEPTION)
        expect(() => where.matchesExactly(A_STRING)).toThrowErrorOfType(SemanticSearchError, EXPECTED_EXCEPTION)
        expect(() => where.exactly.match(A_STRING)).toThrowErrorOfType(SemanticSearchError, EXPECTED_EXCEPTION)
        expect(() => where.exactly.matches(A_STRING)).toThrowErrorOfType(SemanticSearchError, EXPECTED_EXCEPTION)
      })
    })
  })
})
