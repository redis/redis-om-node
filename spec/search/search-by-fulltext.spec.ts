import { mocked } from 'ts-jest/utils';

import Client from "../../lib/client";
import Entity from "../../lib/entity/entity";
import Schema from "../../lib/schema/schema";
import Search from "../../lib/search/search";
import WhereField from '../../lib/search/where-field';

jest.mock('../../lib/client');


interface TestEntity {
  aString: string;
}

class TestEntity extends Entity {}

beforeEach(() => mocked(Client).mockReset());

describe("Search", () => {
  let client: Client;
  let schema: Schema<TestEntity>;
  let search: Search<TestEntity>;
  let where: WhereField<TestEntity>;

  beforeAll(() => {
    client = new Client();
    schema = new Schema<TestEntity>(
      TestEntity, {
        aString: { type: 'string', textSearch: true }
      });
  });

  beforeEach(() => {
    search = new Search<TestEntity>(schema, client);
    where = search.where('aString');
  });

  describe("#query", () => {
    const A_TEXT_QUERY = "(@aString:'foo')";
    const A_NEGATED_TEXT_QUERY = "(-@aString:'foo')";
    const AN_EXACT_TEXT_QUERY = '(@aString:"foo")';
    const A_NEGATED_EXACT_TEXT_QUERY = '(-@aString:"foo")';

    describe("when generating for a query with a string", () => {

      type StringChecker = (search: Search<TestEntity>) => void;
      const expectToBeTextQuery: StringChecker = search => expect(search.query).toBe(A_TEXT_QUERY);
      const expectToBeNegatedTextQuery: StringChecker = search => expect(search.query).toBe(A_NEGATED_TEXT_QUERY);
      const expectToBeExactTextQuery: StringChecker = search => expect(search.query).toBe(AN_EXACT_TEXT_QUERY);
      const expectToBeNegatedExactTextQuery: StringChecker = search => expect(search.query).toBe(A_NEGATED_EXACT_TEXT_QUERY);

      it("generates a query with .match", () => expectToBeTextQuery(where.match('foo')));
      it("generates a query with .not.match", () => expectToBeNegatedTextQuery(where.not.match('foo')));
      it("generates a query with .matches", () => expectToBeTextQuery(where.matches('foo')));
      it("generates a query with .does.match", () => expectToBeTextQuery(where.does.match('foo')));
      it("generates a query with .does.not.match", () => expectToBeNegatedTextQuery(where.does.not.match('foo')));
      
      it("generates a query with .exact.match", () => expectToBeExactTextQuery(where.exact.match('foo')));
      it("generates a query with .not.exact.match", () => expectToBeNegatedExactTextQuery(where.not.exact.match('foo')));
      it("generates a query with .exactly.matches", () => expectToBeExactTextQuery(where.exactly.matches('foo')));
      it("generates a query with .does.exactly.match", () => expectToBeExactTextQuery(where.does.exactly.match('foo')));
      it("generates a query with .does.not.exactly.match", () => expectToBeNegatedExactTextQuery(where.does.not.exactly.match('foo')));

      it("generates a query with .matchExact", () => expectToBeExactTextQuery(where.matchExact('foo')));
      it("generates a query with .not.matchExact", () => expectToBeNegatedExactTextQuery(where.not.matchExact('foo')));
      it("generates a query with .matchesExactly", () => expectToBeExactTextQuery(where.matchesExactly('foo')));
      it("generates a query with .does.matchExactly", () => expectToBeExactTextQuery(where.does.matchExactly('foo')));
      it("generates a query with .does.not.matchExactly", () => expectToBeNegatedExactTextQuery(where.does.not.matchExactly('foo')));

      it("generates a query that escapes all punctuation for a match", () => {
        let query = where.match(",.<>{}[]\"':;!@#$%^&*()-+=~|").query;
        expect(query).toBe("(@aString:'\\,\\.\\<\\>\\{\\}\\[\\]\\\"\\'\\:\\;\\!\\@\\#\\$\\%\\^\\&\\*\\(\\)\\-\\+\\=\\~\\|')");
      });

      it("generates a query that escapes all punctuation for an exact match", () => {
        let query = where.exact.match(",.<>{}[]\"':;!@#$%^&*()-+=~|").query;
        expect(query).toBe('(@aString:"\\,\\.\\<\\>\\{\\}\\[\\]\\"\\\'\\:\\;\\!\\@\\#\\$\\%\\^\\&\\*\\(\\)\\-\\+\\=\\~\\|")');
      });
    });
  });
});
