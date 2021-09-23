import Globals from './helpers/globals';

import Client from "../lib/client";
import Entity from "../lib/entity/entity";
import Schema from "../lib/schema/schema";
import Search from "../lib/search/search";

const globals: Globals = (globalThis as unknown) as Globals;

interface TestEntity {
  anArray: string[];
  anotherArray: string[];
  aThirdArray: string[];
}

class TestEntity extends Entity {}

describe("Search", () => {

  let client: Client;
  let schema: Schema<TestEntity>;
  let search: Search<TestEntity>;

  beforeAll(() => {
    client = globals.client;
    schema = new Schema<TestEntity>(
      TestEntity, {
        anArray: { type: 'array' },
        anotherArray: { type: 'array' },
        aThirdArray: { type: 'array' }
      });
  })

  describe("#query", () => {
    beforeEach(() => {
      search = new Search<TestEntity>(schema, client);
    });

    describe("when generating for an array", () => {
      it("generates a query that matches an array that contains the queried value", () => {
        let query = search.where('anArray').contains('foo').query;
        expect(query).toBe("@anArray:{foo}");
      });

      it("generates a query that matches an array that contains one of the queried values", () => {
        let query = search.where('anArray').containsOneOf('foo', 'bar', 'baz').query;
        expect(query).toBe("@anArray:{foo|bar|baz}");
      });

      it("generates a query that escapes all punctuation", () => {
        let query = search.where('anArray').contains(",.<>{}[]\"':;|!@#$%^&*()-+=~ ").query;
        expect(query).toBe("@anArray:{\\,\\.\\<\\>\\{\\}\\[\\]\\\"\\'\\:\\;\\|\\!\\@\\#\\$\\%\\^\\&\\*\\(\\)\\-\\+\\=\\~\\ }");
      });

      it("generates a query that escapes all punctuation", () => {
        let query = search.where('anArray').containsOneOf(",.<>{}[]\"':;|", "!@#$%^&*()-+=~ ").query;
        expect(query).toBe("@anArray:{\\,\\.\\<\\>\\{\\}\\[\\]\\\"\\'\\:\\;\\||\\!\\@\\#\\$\\%\\^\\&\\*\\(\\)\\-\\+\\=\\~\\ }");
      });
    });
  });
});
