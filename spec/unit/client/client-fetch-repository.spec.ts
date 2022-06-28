import { Client } from '$lib/client';
import { Repository } from '$lib/repository';
import { Entity } from '$lib/entity/entity';
import { Schema } from '$lib/schema/schema';

import { JsonRepository, HashRepository } from '$lib/repository';

vi.mock('$lib/repository');


describe("Client", () => {

  let client: Client;

  beforeEach(() => {
    client = new Client()
  });

  afterEach(() => {
    client.close()
  });

  it("passes", () => expect(true).toBe(true));

  describe("#fetchRepository", () => {

    class TestEntity extends Entity { };

    let repository: Repository<TestEntity>;
    let schema: Schema<TestEntity>;

    describe("when fetching a HashRepository", () => {
      beforeAll(() => {
        schema = new Schema(TestEntity, {}, { dataStructure: 'HASH' })
      });

      describe("when called on an open client", () => {

        beforeEach(async () => {
          await client.open();
          repository = client.fetchRepository(schema);
        });

        it("creates a repository with the schema and client", () => {
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
          expect(() => client.fetchRepository(schema))
            .toThrow("Redis connection needs to be open."));
      });

      it("errors when called on a new client", () =>
        expect(() => client.fetchRepository(schema))
          .toThrow("Redis connection needs to be open."));
    });

    describe("when fetching a JsonRepository", () => {
      beforeAll(() => {
        schema = new Schema(TestEntity, {}, { dataStructure: 'JSON' })
      });

      describe("when called on an open client", () => {

        beforeEach(async () => {
          await client.open();
          repository = client.fetchRepository(schema);
        });

        it("creates a repository with the schema and client", () => {
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
          expect(() => client.fetchRepository(schema))
            .toThrow("Redis connection needs to be open."));
      });

      it("errors when called on a new client", () =>
        expect(() => client.fetchRepository(schema))
          .toThrow("Redis connection needs to be open."));
    });
  });
});
