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
  anotherString: string;
  anotherNumber: number;
  anotherBoolean: boolean;
  aThirdString: string;
  aThirdNumber: number;
  aThirdBoolean: boolean;
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
        anotherString: { type: 'string' },
        anotherNumber: { type: 'number' },
        anotherBoolean: { type: 'boolean' },
        aThirdString: { type: 'string' },
        aThirdNumber: { type: 'number' },
        aThirdBoolean: { type: 'boolean' }
      });
  })

  describe("#query", () => {
    beforeEach(() => {
      search = new Search<TestEntity>(schema, client);
    });

    describe("when generating for missing items", () => {
      it("throws an exception when invoked with a missing field", () => {
        expect(() => search.where('missingString'))
          .toThrow("The field 'missingString' is not part of the schema.");
      });
    });

    describe("when generating for all items", () => {
      it("generates a query matching all items", () => {
        expect(search.query).toBe("*");
      });
    });
  
    describe("when generating for simple strings", () => {
      it("generates a query matching a string", () => {
        let query = search.where('aString').is('foo').query;
        expect(query).toBe("@aString:{foo}");
      });
  
      it("generates a query matching multiple strings", () => {
        let query = search
          .where('aString').is('foo')
          .where('anotherString').is('bar')
          .where('aThirdString').is('baz').query;
        expect(query).toBe("@aString:{foo} @anotherString:{bar} @aThirdString:{baz}");
      });

      it("generates a query that escapes punctuation between text", () => {
        let query = search.where('aString').is('foo,bar baz').query;
        expect(query).toBe("@aString:{foo\\,bar\\ baz}");
      });

      it("generates a query that escapes all punctuation", () => {
        let query = search.where('aString').is(",.<>{}[]\"':;!@#$%^&*()-+=~ ").query;
        expect(query).toBe("@aString:{\\,\\.\\<\\>\\{\\}\\[\\]\\\"\\'\\:\\;\\!\\@\\#\\$\\%\\^\\&\\*\\(\\)\\-\\+\\=\\~\\ }");
      });
    });

    describe("when generating for a boolean", () => {
      it("generates a query matching a boolean set to true", () => {
        let query = search.where('aBoolean').isTrue().query;
        expect(query).toBe("@aBoolean:{1}");
      });
  
      it("generates a query matching a boolean set to false", () => {
        let query = search.where('aBoolean').isFalse().query;
        expect(query).toBe("@aBoolean:{0}");
      });
  
      it("generates a query matching multiple booleans", () => {
        let query = search
          .where('aBoolean').isTrue()
          .where('anotherBoolean').isTrue()
          .where('aThirdBoolean').isFalse().query;
        expect(query).toBe("@aBoolean:{1} @anotherBoolean:{1} @aThirdBoolean:{0}");
      });
    });

    describe("when generating for a number", () => {
      it("generates a query that equals a number", () => {
        let query = search.where('aNumber').equals(42).query;
        expect(query).toBe("@aNumber:[42 42]");
      });

      it("generates a query that is greater than a number", () => {
        let query = search.where('aNumber').greaterThan(42).query;
        expect(query).toBe("@aNumber:[(42 +inf]");
      });
  
      it("generates a query that is greater than or equal to a number", () => {
        let query = search.where('aNumber').greaterThanEqual(42).query;
        expect(query).toBe("@aNumber:[42 +inf]");
      });
  
      it("generates a query that is less than a number", () => {
        let query = search.where('aNumber').lessThan(42).query;
        expect(query).toBe("@aNumber:[-inf (42]");
      });
  
      it("generates a query that is less than or equal to a number", () => {
        let query = search.where('aNumber').lessThanEqual(42).query;
        expect(query).toBe("@aNumber:[-inf 42]");
      });
  
      it("generates a query that matches inclusively between two numbers", () => {
        let query = search.where('aNumber').inRange(23, 42).query;
        expect(query).toBe("@aNumber:[23 42]");
      });
  
      it("generates a query that matches exclusively between two numbers", () => {
        let query = search.where('aNumber').inRangeExclusive(23, 42).query;
        expect(query).toBe("@aNumber:[(23 (42]");
      });

      it("generates a query that checks multiple numbers", () => {
        let query = search
          .where('aNumber').lessThanEqual(42)
          .where('anotherNumber').equals(23)
          .where('aThirdNumber').greaterThanEqual(13).query;
        expect(query).toBe("@aNumber:[-inf 42] @anotherNumber:[23 23] @aThirdNumber:[13 +inf]");
      });
    });
  });
});
