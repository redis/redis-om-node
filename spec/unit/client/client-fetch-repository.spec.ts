import { mocked } from 'ts-jest/utils';

import RedisShim from '../../../lib/redis/redis-shim';
import Client from '../../../lib/client';
import Repository from '../../../lib/repository/repository';
import Entity from '../../../lib/entity/entity';
import Schema from '../../../lib/schema/schema';

import { JsonRepository, HashRepository } from '../../../lib/repository/repository';

jest.mock('../../../lib/redis/redis-shim');
jest.mock('../../../lib/repository/repository');

beforeEach(() => mocked(RedisShim).mockReset());

describe("Client", () => {

  let client: Client;
  
  beforeEach(async () => client = new Client());

  it("passes", () => expect(true).toBe(true));

  describe("#fetchRepository", () => {

    class TestEntity extends Entity {};

    let repository: Repository<TestEntity>;
    let schema: Schema<TestEntity>;

    describe("when fetching a HashRepository", () => {
      beforeAll(() => schema = new Schema(TestEntity, {}, { dataStructure: 'HASH' }));

      describe("when called on an open client", () => {
  
        beforeEach(async () => {
          await client.open();
          repository = await client.fetchRepository(schema);
        });
        
        it("creates a repository with the schema and client", async () => {
          expect(HashRepository).toHaveBeenCalledWith(schema, client);
        });
  
        it("returns a repository", async () => {
          expect(repository).toBeInstanceOf(HashRepository);
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

    describe("when fetching a JsonRepository", () => {
      beforeAll(() => schema = new Schema(TestEntity, {}, { dataStructure: 'JSON' }));

      describe("when called on an open client", () => {
  
        beforeEach(async () => {
          await client.open();
          repository = await client.fetchRepository(schema);
        });
        
        it("creates a repository with the schema and client", async () => {
          expect(JsonRepository).toHaveBeenCalledWith(schema, client);
        });
  
        it("returns a repository", async () => {
          expect(repository).toBeInstanceOf(JsonRepository);
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
});
