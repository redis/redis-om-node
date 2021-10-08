import { mocked } from 'ts-jest/utils';

import Client from "../../lib/client";
import Search from "../../lib/search/search";
import WhereField from '../../lib/search/where-field';

import { simpleSchema, SimpleEntity } from "../helpers/test-entity-and-schema";

jest.mock('../../lib/client');


beforeEach(() => mocked(Client).mockReset());

describe("Search", () => {
  describe("#query", () => {

    let client: Client;
    let search: Search<SimpleEntity>;
    let where: WhereField<SimpleEntity>;
  
    const A_STRING_QUERY = "(@aString:{foo})";
    const A_NEGATED_STRING_QUERY = "(-@aString:{foo})";

    beforeAll(() => client = new Client());
  
    beforeEach(() => {
      search = new Search<SimpleEntity>(simpleSchema, client);
      where = search.where('aString');
    });

    describe("when generating for a query with a string", () => {

      type StringChecker = (search: Search<SimpleEntity>) => void;
      const expectToBeStringQuery: StringChecker = search => expect(search.query).toBe(A_STRING_QUERY);
      const expectToBeNegatedStringQuery: StringChecker = search => expect(search.query).toBe(A_NEGATED_STRING_QUERY);

      it("generates a query with .eq", () => expectToBeStringQuery(where.equals('foo')));
      it("generates a query with .not.eq", () => expectToBeNegatedStringQuery(where.not.eq('foo')));
      it("generates a query with .equals", () => expectToBeStringQuery(where.equals('foo')));
      it("generates a query with .does.equal", () => expectToBeStringQuery(where.does.equal('foo')));
      it("generates a query with .does.not.equal", () => expectToBeNegatedStringQuery(where.does.not.equal('foo')));
      it("generates a query with .is.equalTo", () => expectToBeStringQuery(where.is.equalTo('foo')));
      it("generates a query with .is.not.equalTo", () => expectToBeNegatedStringQuery(where.is.not.equalTo('foo')));

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
