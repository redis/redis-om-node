import { mocked } from 'ts-jest/utils';

import RedisShim from '../../../src/redis/redis-shim';
import Client from '../../../src/client';
import Repository from '../../../src/repository/repository';
import Entity from '../../../src/entity/entity';
import Schema from '../../../src/schema/schema';

jest.mock('../../../src/redis/redis-shim');
jest.mock('../../../src/repository/repository');


beforeEach(() => mocked(RedisShim).mockReset());

describe("Client", () => {

  let client: Client;

  beforeEach(async () => client = new Client());

  describe("#fetchRepository", () => {

    class TestEntity extends Entity {};

    let repository: Repository<TestEntity>;
    let schema: Schema<TestEntity>;

    beforeAll(() => schema = new Schema(TestEntity, {}));

    describe("when called on an open client", () => {

      beforeEach(async () => {
        await client.open();
        repository = await client.fetchRepository(schema);
      });
      
      it("creates a repository with the schema and client", async () => {
        expect(Repository).toHaveBeenCalledWith(schema, client);
      });

      it("returns a repository", async () => {
        expect(repository).toBeInstanceOf(Repository);
      });
    });

    describe("when called on a closed client", () => {
      beforeEach(async () => {
        await client.open();
        await client.close();
      });
      
      it("errors when called on a closed client", () => 
        expect(async () => await client.fetchRepository(schema))
          .rejects.toThrow("Redis connection needs opened."));
    });
    
    it("errors when called on a new client", async () =>
      expect(async () => await client.fetchRepository(schema))
        .rejects.toThrow("Redis connection needs opened."));
  });
});
