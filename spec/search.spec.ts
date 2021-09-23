import Globals from './helpers/globals';

import Client from "../lib/client";
import Entity from "../lib/entity/entity";
import Schema from "../lib/schema/schema";
import Search from "../lib/search/search";

const globals: Globals = (globalThis as unknown) as Globals;

interface TestEntity {
  aString: string;
  aNumber: number;
  aBoolean: boolean;
  anArray: string[];
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
        aNumber: { type: 'number' },
        aBoolean: { type: 'boolean' },
        anArray: { type: 'array' }
      });
  })

  describe("#query", () => {
    beforeEach(() => {
      search = new Search<TestEntity>(schema, client);
    });

    it("generates a query matching all items", () => {
      expect(search.query).toBe("*");
    });

    it("throws an exception when invoked with a missing field", () => {
      expect(() => search.where('missingString'))
        .toThrow("The field 'missingString' is not part of the schema.");
    });

    it("generates a query using .where", () => {
      let query = search
        .where('aString').is('foo')
        .where('aNumber').equals(42)
        .where('aBoolean').isTrue().query;
      expect(query).toBe("@aString:{foo} @aNumber:[42 42] @aBoolean:{1}");
    });

    it("generates a query using .andWhere", () => {
      let query = search
        .where('aString').is('foo')
        .andWhere('aNumber').equals(42)
        .andWhere('aBoolean').isTrue().query;
      expect(query).toBe("@aString:{foo} @aNumber:[42 42] @aBoolean:{1}");
    });

    it("generates a query using .orWhere", () => {
      let query = search
        .where('aString').is('foo')
        .orWhere('aNumber').equals(42)
        .orWhere('aBoolean').isTrue().query;
      expect(query).toBe("@aString:{foo} | @aNumber:[42 42] | @aBoolean:{1}");
    });

    it("generates a query using .andWhere and .orWhere", () => {
      let query = search
        .where('aString').is('foo')
        .andWhere('aNumber').equals(42)
        .orWhere('aBoolean').isTrue().query;
      expect(query).toBe("@aString:{foo} @aNumber:[42 42] | @aBoolean:{1}");
    });

    xit("generates a query using .and", () => {
      // search.and(
      //   search => search.where('bar').is('baz').orWhere('bar').is('baz'),
      //   search => search.where('foo').is('bar'),
      //   search => search.where('foo').is('bar'),
      //   search => search.where('foo').is('bar')
      // )
    });

    xit("generates a query using .or", () => {});
  });
});
