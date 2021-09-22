import Globals from './helpers/globals';

import Client from "../lib/client";
import Entity from "../lib/entity/entity";
import Schema from "../lib/schema/schema";
import Search from "../lib/search/search";

const globals: Globals = (globalThis as unknown) as Globals;

interface TestEntity {
  aBoolean: boolean;
  anotherBoolean: boolean;
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
        aBoolean: { type: 'boolean' },
        anotherBoolean: { type: 'boolean' },
        aThirdBoolean: { type: 'boolean' }
      });
  })

  describe("#query", () => {
    beforeEach(() => {
      search = new Search<TestEntity>(schema, client);
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
  });
});
