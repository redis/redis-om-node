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

    const A_CONTAINS_QUERY = "(@anArray:{foo})";
    const A_NEGATED_CONTAINS_QUERY = "(-@anArray:{foo})";
    const A_CONTAINS_ONE_QUERY = "(@anArray:{foo|bar|baz})";
    const A_NEGATED_CONTAINS_ONE_QUERY = "(-@anArray:{foo|bar|baz})";

    beforeAll(() => client = new Client());
  
    beforeEach(() => {
      search = new Search<SimpleEntity>(simpleSchema, client);
      where = search.where('anArray');
    });  

    describe("when generating for an array", () => {

      type ArrayChecker = (search: Search<SimpleEntity>) => void;
      const expectToBeContainsQuery: ArrayChecker = search => expect(search.query).toBe(A_CONTAINS_QUERY);
      const expectToBeNegatedContainsQuery: ArrayChecker = search => expect(search.query).toBe(A_NEGATED_CONTAINS_QUERY);
      const expectToBeContainsOneQuery: ArrayChecker = search => expect(search.query).toBe(A_CONTAINS_ONE_QUERY);
      const expectToBeNegatedContainsOneQuery: ArrayChecker = search => expect(search.query).toBe(A_NEGATED_CONTAINS_ONE_QUERY);

      it("generates a query with .contains", () => expectToBeContainsQuery(where.contains('foo')));
      it("generates a query with .does.contain", () => expectToBeContainsQuery(where.does.contain('foo')));
      it("generates a query with .does.not.contain", () => expectToBeNegatedContainsQuery(where.does.not.contain('foo')));

      it("generates a query with .containsOneOf", () => expectToBeContainsOneQuery(where.containsOneOf('foo', 'bar', 'baz')));
      it("generates a query with .does.containOneOf", () => expectToBeContainsOneQuery(where.does.containOneOf('foo', 'bar', 'baz')));
      it("generates a query with .does.not.containOneOf", () => expectToBeNegatedContainsOneQuery(where.does.not.containOneOf('foo', 'bar', 'baz')));

      it("generates a query that escapes all punctuation", () => {
        let query = where.contains(",.<>{}[]\"':;|!@#$%^&*()-+=~ ").query;
        expect(query).toBe("(@anArray:{\\,\\.\\<\\>\\{\\}\\[\\]\\\"\\'\\:\\;\\|\\!\\@\\#\\$\\%\\^\\&\\*\\(\\)\\-\\+\\=\\~\\ })");
      });

      it("generates a query that escapes all punctuation", () => {
        let query = where.containsOneOf(",.<>{}[]\"':;|", "!@#$%^&*()-+=~ ").query;
        expect(query).toBe("(@anArray:{\\,\\.\\<\\>\\{\\}\\[\\]\\\"\\'\\:\\;\\||\\!\\@\\#\\$\\%\\^\\&\\*\\(\\)\\-\\+\\=\\~\\ })");
      });
    });
  });
});
