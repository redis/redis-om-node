import Globals from './helpers/globals';

import Client from "../lib/client";
import Entity from "../lib/entity/entity";
import Schema from "../lib/schema/schema";
import Search from "../lib/search/search";
import WhereField from '../lib/search/where-field';

const globals: Globals = (globalThis as unknown) as Globals;

interface TestEntity {
  anArray: string[];
}

class TestEntity extends Entity {}

describe("Search", () => {

  let client: Client;
  let schema: Schema<TestEntity>;

  beforeAll(() => {
    client = globals.client;
    schema = new Schema<TestEntity>(
      TestEntity, {
        anArray: { type: 'array' }
      });
  })

  describe("#query", () => {
    let search: Search<TestEntity>;
    let where: WhereField<TestEntity>;

    const A_CONTAINS_QUERY = "(@anArray:{foo})";
    const A_NEGATED_CONTAINS_QUERY = "(-@anArray:{foo})";
    const A_CONTAINS_ONE_QUERY = "(@anArray:{foo|bar|baz})";
    const A_NEGATED_CONTAINS_ONE_QUERY = "(-@anArray:{foo|bar|baz})";

    beforeEach(() => {
      search = new Search<TestEntity>(schema, client);
      where = search.where('anArray');
    });

    describe("when generating for an array", () => {

      type ArrayChecker = (search: Search<TestEntity>) => void;
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
