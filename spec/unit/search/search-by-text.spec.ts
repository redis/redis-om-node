import '../../helpers/custom-matchers'

import { Client } from "$lib/client"
import { SemanticSearchError } from "$lib/error"
import { Search, WhereField } from "$lib/search"

import { A_STRING , A_NUMBER } from '../../helpers/example-data'
import { simpleSchema } from "../helpers/test-entity-and-schema"


describe("Search", () => {
  describe("#query", () => {

    let client: Client
    let search: Search
    let where: WhereField

    const A_TEXT_QUERY = `(@someText:'${A_STRING}')`
    const A_NEGATED_TEXT_QUERY = `(-@someText:'${A_STRING}')`
    const AN_EXACT_TEXT_QUERY = `(@someText:"${A_STRING}")`
    const A_NEGATED_EXACT_TEXT_QUERY = `(-@someText:"${A_STRING}")`

    const A_NUMBER_TEXT_QUERY = `(@someText:'${A_NUMBER}')`
    const A_NEGATED_NUMBER_TEXT_QUERY = `(-@someText:'${A_NUMBER}')`
    const A_NUMBER_EXACT_TEXT_QUERY = `(@someText:"${A_NUMBER}")`
    const A_NEGATED_NUMBER_EXACT_TEXT_QUERY = `(-@someText:"${A_NUMBER}")`

    const A_BOOLEAN_TEXT_QUERY = `(@someText:'true')`
    const A_NEGATED_BOOLEAN_TEXT_QUERY = `(-@someText:'true')`
    const A_BOOLEAN_EXACT_TEXT_QUERY = `(@someText:"true")`
    const A_NEGATED_BOOLEAN_EXACT_TEXT_QUERY = `(-@someText:"true")`

    type StringChecker = (search: Search) => void
    const expectToBeTextQuery: StringChecker = search => expect(search.query).toBe(A_TEXT_QUERY)
    const expectToBeNegatedTextQuery: StringChecker = search => expect(search.query).toBe(A_NEGATED_TEXT_QUERY)
    const expectToBeExactTextQuery: StringChecker = search => expect(search.query).toBe(AN_EXACT_TEXT_QUERY)
    const expectToBeNegatedExactTextQuery: StringChecker = search => expect(search.query).toBe(A_NEGATED_EXACT_TEXT_QUERY)

    const expectToBeNumberTextQuery: StringChecker = search => expect(search.query).toBe(A_NUMBER_TEXT_QUERY)
    const expectToBeNegatedNumberTextQuery: StringChecker = search => expect(search.query).toBe(A_NEGATED_NUMBER_TEXT_QUERY)
    const expectToBeNumberExactTextQuery: StringChecker = search => expect(search.query).toBe(A_NUMBER_EXACT_TEXT_QUERY)
    const expectToBeNegatedNumberExactTextQuery: StringChecker = search => expect(search.query).toBe(A_NEGATED_NUMBER_EXACT_TEXT_QUERY)

    const expectToBeBooleanTextQuery: StringChecker = search => expect(search.query).toBe(A_BOOLEAN_TEXT_QUERY)
    const expectToBeNegatedBooleanTextQuery: StringChecker = search => expect(search.query).toBe(A_NEGATED_BOOLEAN_TEXT_QUERY)
    const expectToBeBooleanExactTextQuery: StringChecker = search => expect(search.query).toBe(A_BOOLEAN_EXACT_TEXT_QUERY)
    const expectToBeNegatedBooleanExactTextQuery: StringChecker = search => expect(search.query).toBe(A_NEGATED_BOOLEAN_EXACT_TEXT_QUERY)

    beforeAll(() => {
      client = new Client()
    })

    beforeEach(() => {
      search = new Search(simpleSchema, client)
      where = search.where('someText')
    })

    describe("when generating for a query with a string", () => {
      it("generates a query with .match", () => expectToBeTextQuery(where.match(A_STRING)))
      it("generates a query with .not.match", () => expectToBeNegatedTextQuery(where.not.match(A_STRING)))
      it("generates a query with .matches", () => expectToBeTextQuery(where.matches(A_STRING)))
      it("generates a query with .does.match", () => expectToBeTextQuery(where.does.match(A_STRING)))
      it("generates a query with .does.not.match", () => expectToBeNegatedTextQuery(where.does.not.match(A_STRING)))

      it("generates a query with .exact.match", () => expectToBeExactTextQuery(where.exact.match(A_STRING)))
      it("generates a query with .not.exact.match", () => expectToBeNegatedExactTextQuery(where.not.exact.match(A_STRING)))
      it("generates a query with .exactly.matches", () => expectToBeExactTextQuery(where.exactly.matches(A_STRING)))
      it("generates a query with .does.exactly.match", () => expectToBeExactTextQuery(where.does.exactly.match(A_STRING)))
      it("generates a query with .does.not.exactly.match", () => expectToBeNegatedExactTextQuery(where.does.not.exactly.match(A_STRING)))

      it("generates a query with .matchExact", () => expectToBeExactTextQuery(where.matchExact(A_STRING)))
      it("generates a query with .not.matchExact", () => expectToBeNegatedExactTextQuery(where.not.matchExact(A_STRING)))
      it("generates a query with .matchesExactly", () => expectToBeExactTextQuery(where.matchesExactly(A_STRING)))
      it("generates a query with .does.matchExactly", () => expectToBeExactTextQuery(where.does.matchExactly(A_STRING)))
      it("generates a query with .does.not.matchExactly", () => expectToBeNegatedExactTextQuery(where.does.not.matchExactly(A_STRING)))
    })

    describe("when generating a query with a number as a string", () => {
      it("generates a query with .match", () => expectToBeNumberTextQuery(where.match(A_NUMBER)))
      it("generates a query with .not.match", () => expectToBeNegatedNumberTextQuery(where.not.match(A_NUMBER)))
      it("generates a query with .matches", () => expectToBeNumberTextQuery(where.matches(A_NUMBER)))
      it("generates a query with .does.match", () => expectToBeNumberTextQuery(where.does.match(A_NUMBER)))
      it("generates a query with .does.not.match", () => expectToBeNegatedNumberTextQuery(where.does.not.match(A_NUMBER)))

      it("generates a query with .exact.match", () => expectToBeNumberExactTextQuery(where.exact.match(A_NUMBER)))
      it("generates a query with .not.exact.match", () => expectToBeNegatedNumberExactTextQuery(where.not.exact.match(A_NUMBER)))
      it("generates a query with .exactly.matches", () => expectToBeNumberExactTextQuery(where.exactly.matches(A_NUMBER)))
      it("generates a query with .does.exactly.match", () => expectToBeNumberExactTextQuery(where.does.exactly.match(A_NUMBER)))
      it("generates a query with .does.not.exactly.match", () => expectToBeNegatedNumberExactTextQuery(where.does.not.exactly.match(A_NUMBER)))

      it("generates a query with .matchExact", () => expectToBeNumberExactTextQuery(where.matchExact(A_NUMBER)))
      it("generates a query with .not.matchExact", () => expectToBeNegatedNumberExactTextQuery(where.not.matchExact(A_NUMBER)))
      it("generates a query with .matchesExactly", () => expectToBeNumberExactTextQuery(where.matchesExactly(A_NUMBER)))
      it("generates a query with .does.matchExactly", () => expectToBeNumberExactTextQuery(where.does.matchExactly(A_NUMBER)))
      it("generates a query with .does.not.matchExactly", () => expectToBeNegatedNumberExactTextQuery(where.does.not.matchExactly(A_NUMBER)))
    })

    describe("when generating a query with a boolean as a string", () => {
      it("generates a query with .match", () => expectToBeBooleanTextQuery(where.match(true)))
      it("generates a query with .not.match", () => expectToBeNegatedBooleanTextQuery(where.not.match(true)))
      it("generates a query with .matches", () => expectToBeBooleanTextQuery(where.matches(true)))
      it("generates a query with .does.match", () => expectToBeBooleanTextQuery(where.does.match(true)))
      it("generates a query with .does.not.match", () => expectToBeNegatedBooleanTextQuery(where.does.not.match(true)))

      it("generates a query with .exact.match", () => expectToBeBooleanExactTextQuery(where.exact.match(true)))
      it("generates a query with .not.exact.match", () => expectToBeNegatedBooleanExactTextQuery(where.not.exact.match(true)))
      it("generates a query with .exactly.matches", () => expectToBeBooleanExactTextQuery(where.exactly.matches(true)))
      it("generates a query with .does.exactly.match", () => expectToBeBooleanExactTextQuery(where.does.exactly.match(true)))
      it("generates a query with .does.not.exactly.match", () => expectToBeNegatedBooleanExactTextQuery(where.does.not.exactly.match(true)))

      it("generates a query with .matchExact", () => expectToBeBooleanExactTextQuery(where.matchExact(true)))
      it("generates a query with .not.matchExact", () => expectToBeNegatedBooleanExactTextQuery(where.not.matchExact(true)))
      it("generates a query with .matchesExactly", () => expectToBeBooleanExactTextQuery(where.matchesExactly(true)))
      it("generates a query with .does.matchExactly", () => expectToBeBooleanExactTextQuery(where.does.matchExactly(true)))
      it("generates a query with .does.not.matchExactly", () => expectToBeNegatedBooleanExactTextQuery(where.does.not.matchExactly(true)))
    })

    describe("when generating a query with special characters in the string", () => {
      it("generates a query that escapes all punctuation for a match", () => {
        let query = where.match(",.<>{}[]\"':;!@#$%^&()-+=~|").query
        expect(query).toBe("(@someText:'\\,\\.\\<\\>\\{\\}\\[\\]\\\"\\'\\:\\;\\!\\@\\#\\$\\%\\^\\&\\(\\)\\-\\+\\=\\~\\|')")
      })

      it("generates a query that escapes all punctuation for an exact match", () => {
        let query = where.exact.match(",.<>{}[]\"':;!@#$%^&()-+=~|").query
        expect(query).toBe('(@someText:"\\,\\.\\<\\>\\{\\}\\[\\]\\"\\\'\\:\\;\\!\\@\\#\\$\\%\\^\\&\\(\\)\\-\\+\\=\\~\\|")')
      })
    })

    describe("when trying to perform string equality full-text", () => {
      const EXPECTED_EXCEPTION = "Cannot call .equals on a field of type 'text', either use .match to perform full-text search or change the type to 'string' in the Schema."
      it("throws an exception telling you what to do", () => {
        expect(() => where.eq(A_STRING)).toThrowErrorOfType(SemanticSearchError, EXPECTED_EXCEPTION)
        expect(() => where.equal(A_STRING)).toThrowErrorOfType(SemanticSearchError, EXPECTED_EXCEPTION)
        expect(() => where.equals(A_STRING)).toThrowErrorOfType(SemanticSearchError, EXPECTED_EXCEPTION)
        expect(() => where.equalTo(A_STRING)).toThrowErrorOfType(SemanticSearchError, EXPECTED_EXCEPTION)
      })
    })
  })
})
