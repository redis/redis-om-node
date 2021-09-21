import Globals from './helpers/globals';
import { keyExists } from './helpers/redis-helper';
import { addBigfootSighting, Bigfoot, createSchema,
  A_BIGFOOT_SIGHTING, A_REDIS_ID, A_REDIS_KEY } from './helpers/bigfoot-data-helper';

import Client from '../lib/client';
import { Schema } from '../lib/schema'
import Repository from '../lib/repository';

const globals: Globals = (globalThis as unknown) as Globals;

describe("Repository", () => {

  let client: Client;
  let repository: Repository<Bigfoot>;
  let schema: Schema<Bigfoot>;

  beforeAll(() => {
    client = globals.client;
    schema = createSchema();
  });

  beforeEach(async () => {
    repository = client.fetchRepository<Bigfoot>(schema);
  });

  describe("#remove", () => {
    describe("when removing an existing entity", () => {
      beforeEach(async () => {
        await addBigfootSighting(client, A_REDIS_KEY, A_BIGFOOT_SIGHTING);
        await repository.remove(A_REDIS_ID);
      });

      it("removes the entity", async () => {
        let exists = await keyExists(client, A_REDIS_KEY)
        expect(exists).toBe(false);
      });
    });

    describe("when removing a non-existing entity", () => {
      beforeEach(async () => {
        await repository.remove(A_REDIS_ID);
      });

      it("like a honey badger, doesn't care", async () => {
        let exists = await keyExists(client, A_REDIS_KEY)
        expect(exists).toBe(false);
      });
    });
  });
});
