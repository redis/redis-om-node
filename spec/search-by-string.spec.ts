import Globals from './helpers/globals';

import Client from "../lib/client";
import Entity from "../lib/entity/entity";
import Schema from "../lib/schema/schema";
import Search from "../lib/search/search";

const globals: Globals = (globalThis as unknown) as Globals;

interface TestEntity {
  aString: string;
  anotherString: string;
  aThirdString: string;
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
        aString: { type: 'string' },
        anotherString: { type: 'string' },
        aThirdString: { type: 'string' }
      });
  });

  describe("#query", () => {
    beforeEach(() => {
      search = new Search<TestEntity>(schema, client);
    });

    describe("when generating for simple strings", () => {
      it("generates a query matching a string", () => {
        let query = search.where('aString').is('foo').query;
        expect(query).toBe("(@aString:{foo})");
      });
  
      it("generates a query that escapes punctuation between text", () => {
        let query = search.where('aString').is('foo,bar baz').query;
        expect(query).toBe("(@aString:{foo\\,bar\\ baz})");
      });

      it("generates a query that escapes all punctuation", () => {
        let query = search.where('aString').is(",.<>{}[]\"':;!@#$%^&*()-+=~| ").query;
        expect(query).toBe("(@aString:{\\,\\.\\<\\>\\{\\}\\[\\]\\\"\\'\\:\\;\\!\\@\\#\\$\\%\\^\\&\\*\\(\\)\\-\\+\\=\\~\\|\\ })");
      });
    });
  });
});
