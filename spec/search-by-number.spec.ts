import Globals from './helpers/globals';

import Client from "../lib/client";
import Entity from "../lib/entity/entity";
import Schema from "../lib/schema/schema";
import Search from "../lib/search/search";

const globals: Globals = (globalThis as unknown) as Globals;

interface TestEntity {
  aNumber: number;
  anotherNumber: number;
  aThirdNumber: number;
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
        aNumber: { type: 'number' },
        anotherNumber: { type: 'number' },
        aThirdNumber: { type: 'number' }
      });
  })

  describe("#query", () => {
    beforeEach(() => {
      search = new Search<TestEntity>(schema, client);
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
    });
  });
});
