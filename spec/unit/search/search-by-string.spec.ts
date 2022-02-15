import { mocked } from 'ts-jest/utils';

import Client from "../../../lib/client";
import Search from "../../../lib/search/search";
import WhereField from '../../../lib/search/where-field';

import { simpleSchema, SimpleEntity } from "../helpers/test-entity-and-schema";

jest.mock('../../../lib/client');


beforeEach(() => mocked(Client).mockReset());

describe("Search", () => {
  describe("#query", () => {

    let client: Client;
    let search: Search<SimpleEntity>;
    let where: WhereField<SimpleEntity>;
  
    const A_STRING_QUERY = "(@aString:{foo})";
    const A_NEGATED_STRING_QUERY = "(-@aString:{foo})";
    const A_NUMBER_STRING_QUERY = "(@aString:{42})";
    const A_NEGATED_NUMBER_STRING_QUERY = "(-@aString:{42})";
    const A_BOOLEAN_STRING_QUERY = "(@aString:{true})";
    const A_NEGATED_BOOLEAN_STRING_QUERY = "(-@aString:{true})";

    type StringChecker = (search: Search<SimpleEntity>) => void;
    const expectToBeStringQuery: StringChecker = search => expect(search.query).toBe(A_STRING_QUERY);
    const expectToBeNegatedStringQuery: StringChecker = search => expect(search.query).toBe(A_NEGATED_STRING_QUERY);
    const expectToBeNumberStringQuery: StringChecker = search => expect(search.query).toBe(A_NUMBER_STRING_QUERY);
    const expectToBeNegatedNumberStringQuery: StringChecker = search => expect(search.query).toBe(A_NEGATED_NUMBER_STRING_QUERY);
    const expectToBeBooleanStringQuery: StringChecker = search => expect(search.query).toBe(A_BOOLEAN_STRING_QUERY);
    const expectToBeNegatedBooleanStringQuery: StringChecker = search => expect(search.query).toBe(A_NEGATED_BOOLEAN_STRING_QUERY);

    beforeAll(() => client = new Client());
  
    beforeEach(() => {
      search = new Search<SimpleEntity>(simpleSchema, client);
      where = search.where('aString');
    });

    describe("when generating a query with a string", () => {
      it("generates a query with .eq", () => expectToBeStringQuery(where.equals('foo')));
      it("generates a query with .not.eq", () => expectToBeNegatedStringQuery(where.not.eq('foo')));
      it("generates a query with .equals", () => expectToBeStringQuery(where.equals('foo')));
      it("generates a query with .does.equal", () => expectToBeStringQuery(where.does.equal('foo')));
      it("generates a query with .does.not.equal", () => expectToBeNegatedStringQuery(where.does.not.equal('foo')));
      it("generates a query with .is.equalTo", () => expectToBeStringQuery(where.is.equalTo('foo')));
      it("generates a query with .is.not.equalTo", () => expectToBeNegatedStringQuery(where.is.not.equalTo('foo')));
    });

    describe("when generating a query with a number as a string", () => {
      it("generates a query with .eq", () => expectToBeNumberStringQuery(where.equals(42)));
      it("generates a query with .not.eq", () => expectToBeNegatedNumberStringQuery(where.not.eq(42)));
      it("generates a query with .equals", () => expectToBeNumberStringQuery(where.equals(42)));
      it("generates a query with .does.equal", () => expectToBeNumberStringQuery(where.does.equal(42)));
      it("generates a query with .does.not.equal", () => expectToBeNegatedNumberStringQuery(where.does.not.equal(42)));
      it("generates a query with .is.equalTo", () => expectToBeNumberStringQuery(where.is.equalTo(42)));
      it("generates a query with .is.not.equalTo", () => expectToBeNegatedNumberStringQuery(where.is.not.equalTo(42)));
    });

    describe("when generating a query with a boolean as a string", () => {
      it("generates a query with .eq", () => expectToBeBooleanStringQuery(where.equals(true)));
      it("generates a query with .not.eq", () => expectToBeNegatedBooleanStringQuery(where.not.eq(true)));
      it("generates a query with .equals", () => expectToBeBooleanStringQuery(where.equals(true)));
      it("generates a query with .does.equal", () => expectToBeBooleanStringQuery(where.does.equal(true)));
      it("generates a query with .does.not.equal", () => expectToBeNegatedBooleanStringQuery(where.does.not.equal(true)));
      it("generates a query with .is.equalTo", () => expectToBeBooleanStringQuery(where.is.equalTo(true)));
      it("generates a query with .is.not.equalTo", () => expectToBeNegatedBooleanStringQuery(where.is.not.equalTo(true)));
    });

    describe("when generating a query with special characters in the string", () => {
      it("generates a query that escapes punctuation between text", () => {
        let query = where.eq('foo,bar baz').query;
        expect(query).toBe("(@aString:{foo\\,bar\\ baz})");
      });

      it("generates a query that escapes all punctuation", () => {
        let query = where.eq(",.<>{}[]\"':;!@#$%^&*()-+=~| ").query;
        expect(query).toBe("(@aString:{\\,\\.\\<\\>\\{\\}\\[\\]\\\"\\'\\:\\;\\!\\@\\#\\$\\%\\^\\&\\*\\(\\)\\-\\+\\=\\~\\|\\ })");
      });
    });
  });
});
