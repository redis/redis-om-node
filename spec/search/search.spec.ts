import { mocked } from 'ts-jest/utils';

import Client from "../../lib/client";
import Entity from "../../lib/entity/entity";
import Schema from "../../lib/schema/schema";
import Search from "../../lib/search/search";

jest.mock('../../lib/client');


interface TestEntity {
  aString: string;
  aNumber: number;
  aBoolean: boolean;
}

class TestEntity extends Entity {}

describe("Search", () => {

  let client: Client;
  let schema: Schema<TestEntity>;
  let search: Search<TestEntity>;

  beforeAll(async () => {
    client = new Client();
    schema = new Schema<TestEntity>(
      TestEntity, {
        aString: { type: 'string' },
        aNumber: { type: 'number' },
        aBoolean: { type: 'boolean' }
      });
  });

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
        .where('aString').eq('foo')
        .where('aNumber').eq(42)
        .where('aBoolean').true().query;
      expect(query).toBe("( ( (@aString:{foo}) (@aNumber:[42 42]) ) (@aBoolean:{1}) )");
    });

    it("generates a query using .and", () => {
      let query = search
        .where('aString').eq('foo')
        .and('aNumber').eq(42)
        .and('aBoolean').true().query;
      expect(query).toBe("( ( (@aString:{foo}) (@aNumber:[42 42]) ) (@aBoolean:{1}) )");
    });

    it("generates a query using .or", () => {
      let query = search
        .where('aString').eq('foo')
        .or('aNumber').equals(42)
        .or('aBoolean').true().query;
      expect(query).toBe("( ( (@aString:{foo}) | (@aNumber:[42 42]) ) | (@aBoolean:{1}) )");
    });

    it("generates a query using .and and .or", () => {
      let query = search
        .where('aString').eq('foo')
        .and('aNumber').equals(42)
        .or('aBoolean').true().query;
      expect(query).toBe("( ( (@aString:{foo}) (@aNumber:[42 42]) ) | (@aBoolean:{1}) )");
    });

    it("generates a query using .and with a function", () => {
      let query = search
        .where('aString').eq('foo')
        .and(search => search 
          .where('aString').eq('bar')
          .and('aNumber').equals(42)
          .or('aBoolean').true()).query;
      expect(query).toBe("( (@aString:{foo}) ( ( (@aString:{bar}) (@aNumber:[42 42]) ) | (@aBoolean:{1}) ) )")
    });

    it("generates a query using .or with a function", () => {
      let query = search
        .where('aString').eq('foo')
        .or(search => search
          .where('aString').eq('bar')
          .and('aNumber').equals(42)
          .or('aBoolean').true()).query;
      expect(query).toBe("( (@aString:{foo}) | ( ( (@aString:{bar}) (@aNumber:[42 42]) ) | (@aBoolean:{1}) ) )")
    });

    it("generates a complex query using all the things", () => {
      let query = search
        .where('aString').eq('foo')
        .and('aNumber').equals(42)
        .or('aBoolean').true()
        .and(search => search
          .where('aString').eq('bar')
          .and('aNumber').equals(23)
          .and('aBoolean').false()
        )
        .or(search => search
          .where('aString').eq('baz')
          .or('aNumber').equals(13)
          .or('aBoolean').true()
          .and(search => search
            .where('aString').eq('qux')
            .and('aNumber').equals(7)
          )
        ).query;

      expect(query).toBe("( ( ( ( (@aString:{foo}) (@aNumber:[42 42]) ) | (@aBoolean:{1}) ) ( ( (@aString:{bar}) (@aNumber:[23 23]) ) (@aBoolean:{0}) ) ) | ( ( ( (@aString:{baz}) | (@aNumber:[13 13]) ) | (@aBoolean:{1}) ) ( (@aString:{qux}) (@aNumber:[7 7]) ) ) )");
    });
  });
});
