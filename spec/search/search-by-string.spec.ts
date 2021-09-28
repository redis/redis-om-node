import Globals from '../helpers/globals';

import Client from "../../lib/client";
import Entity from "../../lib/entity/entity";
import Schema from "../../lib/schema/schema";
import Search from "../../lib/search/search";
import WhereField from '../../lib/search/where-field';

const globals: Globals = (globalThis as unknown) as Globals;

interface TestEntity {
  aString: string;
}

class TestEntity extends Entity {}

describe("Search", () => {
  let client: Client;
  let schema: Schema<TestEntity>;

  beforeAll(() => {
    client = globals.client;
    schema = new Schema<TestEntity>(
      TestEntity, {
        aString: { type: 'string' }
      });
  });

  describe("#query", () => {
    let search: Search<TestEntity>;
    let where: WhereField<TestEntity>;

    const A_STRING_QUERY = "(@aString:{foo})";
    const A_NEGATED_STRING_QUERY = "(-@aString:{foo})";

    beforeEach(() => {
      search = new Search<TestEntity>(schema, client);
      where = search.where('aString');
    });

    describe("when generating for a query with a string", () => {

      type StringChecker = (search: Search<TestEntity>) => void;
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
