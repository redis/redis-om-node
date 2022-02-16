import { mocked } from 'ts-jest/utils';

import Client from "../../../lib/client";
import Search from "../../../lib/search/search";
import WhereField from '../../../lib/search/where-field';

import { A_STRING } from '../../helpers/example-data';
import { simpleSchema, SimpleEntity } from "../helpers/test-entity-and-schema";

jest.mock('../../../lib/client');


beforeEach(() => mocked(Client).mockReset());

describe("Search", () => {
  describe("#query", () => {

    let client: Client;
    let search: Search<SimpleEntity>;
    let where: WhereField<SimpleEntity>;

    const A_TEXT_QUERY = `(@someText:'${A_STRING}')`;
    const A_NEGATED_TEXT_QUERY = `(-@someText:'${A_STRING}')`;
    const AN_EXACT_TEXT_QUERY = `(@someText:"${A_STRING}")`;
    const A_NEGATED_EXACT_TEXT_QUERY = `(-@someText:"${A_STRING}")`;

    type StringChecker = (search: Search<SimpleEntity>) => void;
    const expectToBeTextQuery: StringChecker = search => expect(search.query).toBe(A_TEXT_QUERY);
    const expectToBeNegatedTextQuery: StringChecker = search => expect(search.query).toBe(A_NEGATED_TEXT_QUERY);
    const expectToBeExactTextQuery: StringChecker = search => expect(search.query).toBe(AN_EXACT_TEXT_QUERY);
    const expectToBeNegatedExactTextQuery: StringChecker = search => expect(search.query).toBe(A_NEGATED_EXACT_TEXT_QUERY);

    beforeAll(() => client = new Client());
  
    beforeEach(() => {
      search = new Search<SimpleEntity>(simpleSchema, client);
      where = search.where('someText');
    });  

    describe("when generating for a query with a string", () => {

      it("generates a query with .match", () => expectToBeTextQuery(where.match(A_STRING)));
      it("generates a query with .not.match", () => expectToBeNegatedTextQuery(where.not.match(A_STRING)));
      it("generates a query with .matches", () => expectToBeTextQuery(where.matches(A_STRING)));
      it("generates a query with .does.match", () => expectToBeTextQuery(where.does.match(A_STRING)));
      it("generates a query with .does.not.match", () => expectToBeNegatedTextQuery(where.does.not.match(A_STRING)));
      
      it("generates a query with .exact.match", () => expectToBeExactTextQuery(where.exact.match(A_STRING)));
      it("generates a query with .not.exact.match", () => expectToBeNegatedExactTextQuery(where.not.exact.match(A_STRING)));
      it("generates a query with .exactly.matches", () => expectToBeExactTextQuery(where.exactly.matches(A_STRING)));
      it("generates a query with .does.exactly.match", () => expectToBeExactTextQuery(where.does.exactly.match(A_STRING)));
      it("generates a query with .does.not.exactly.match", () => expectToBeNegatedExactTextQuery(where.does.not.exactly.match(A_STRING)));

      it("generates a query with .matchExact", () => expectToBeExactTextQuery(where.matchExact(A_STRING)));
      it("generates a query with .not.matchExact", () => expectToBeNegatedExactTextQuery(where.not.matchExact(A_STRING)));
      it("generates a query with .matchesExactly", () => expectToBeExactTextQuery(where.matchesExactly(A_STRING)));
      it("generates a query with .does.matchExactly", () => expectToBeExactTextQuery(where.does.matchExactly(A_STRING)));
      it("generates a query with .does.not.matchExactly", () => expectToBeNegatedExactTextQuery(where.does.not.matchExactly(A_STRING)));

      it("generates a query that escapes all punctuation for a match", () => {
        let query = where.match(",.<>{}[]\"':;!@#$%^&*()-+=~|").query;
        expect(query).toBe("(@someText:'\\,\\.\\<\\>\\{\\}\\[\\]\\\"\\'\\:\\;\\!\\@\\#\\$\\%\\^\\&\\*\\(\\)\\-\\+\\=\\~\\|')");
      });

      it("generates a query that escapes all punctuation for an exact match", () => {
        let query = where.exact.match(",.<>{}[]\"':;!@#$%^&*()-+=~|").query;
        expect(query).toBe('(@someText:"\\,\\.\\<\\>\\{\\}\\[\\]\\"\\\'\\:\\;\\!\\@\\#\\$\\%\\^\\&\\*\\(\\)\\-\\+\\=\\~\\|")');
      });
    });
  });
});
