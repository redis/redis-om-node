import { mocked } from 'jest-mock';

import Client from "../../../lib/client";
import { Search } from "../../../lib/search/search";
import WhereField from '../../../lib/search/where-field';

import { A_STRING, ANOTHER_STRING, A_THIRD_STRING } from '../../helpers/example-data';
import { simpleSchema, SimpleEntity } from "../helpers/test-entity-and-schema";

jest.mock('../../../lib/client');


beforeEach(() => mocked(Client).mockReset());

describe("Search", () => {
  describe("#query", () => {

    let client: Client;
    let search: Search<SimpleEntity>;
    let where: WhereField<SimpleEntity>;

    const A_CONTAINS_QUERY = `(@someStrings:{${A_STRING}})`;
    const A_NEGATED_CONTAINS_QUERY = `(-@someStrings:{${A_STRING}})`;
    const A_CONTAINS_ONE_QUERY = `(@someStrings:{${A_STRING}|${ANOTHER_STRING}|${A_THIRD_STRING}})`;
    const A_NEGATED_CONTAINS_ONE_QUERY = `(-@someStrings:{${A_STRING}|${ANOTHER_STRING}|${A_THIRD_STRING}})`;

    type ArrayChecker = (search: Search<SimpleEntity>) => void;
    const expectToBeContainsQuery: ArrayChecker = search => expect(search.query).toBe(A_CONTAINS_QUERY);
    const expectToBeNegatedContainsQuery: ArrayChecker = search => expect(search.query).toBe(A_NEGATED_CONTAINS_QUERY);
    const expectToBeContainsOneQuery: ArrayChecker = search => expect(search.query).toBe(A_CONTAINS_ONE_QUERY);
    const expectToBeNegatedContainsOneQuery: ArrayChecker = search => expect(search.query).toBe(A_NEGATED_CONTAINS_ONE_QUERY);

    beforeAll(() => client = new Client());

    beforeEach(() => {
      search = new Search<SimpleEntity>(simpleSchema, client);
      where = search.where('someStrings');
    });

    describe("when generating for an array", () => {

      it("generates a query with .contains", () => expectToBeContainsQuery(where.contains(A_STRING)));
      it("generates a query with .does.contain", () => expectToBeContainsQuery(where.does.contain(A_STRING)));
      it("generates a query with .does.not.contain", () => expectToBeNegatedContainsQuery(where.does.not.contain(A_STRING)));

      it("generates a query with .containsOneOf", () => expectToBeContainsOneQuery(where.containsOneOf(A_STRING, ANOTHER_STRING, A_THIRD_STRING)));
      it("generates a query with .does.containOneOf", () => expectToBeContainsOneQuery(where.does.containOneOf(A_STRING, ANOTHER_STRING, A_THIRD_STRING)));
      it("generates a query with .does.not.containOneOf", () => expectToBeNegatedContainsOneQuery(where.does.not.containOneOf(A_STRING, ANOTHER_STRING, A_THIRD_STRING)));

      it("generates a query that escapes all punctuation", () => {
        let query = where.contains(",.<>{}[]\"':;|!@#$%^&*()-+=~ ").query;
        expect(query).toBe("(@someStrings:{\\,\\.\\<\\>\\{\\}\\[\\]\\\"\\'\\:\\;\\|\\!\\@\\#\\$\\%\\^\\&\\*\\(\\)\\-\\+\\=\\~\\ })");
      });

      it("generates a query that escapes all punctuation", () => {
        let query = where.containsOneOf(",.<>{}[]\"':;|", "!@#$%^&*()-+=~ ").query;
        expect(query).toBe("(@someStrings:{\\,\\.\\<\\>\\{\\}\\[\\]\\\"\\'\\:\\;\\||\\!\\@\\#\\$\\%\\^\\&\\*\\(\\)\\-\\+\\=\\~\\ })");
      });
    });
  });
});
