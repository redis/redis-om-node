import Globals from './helpers/globals';
import { keyExists } from './helpers/redis-helper';
import { addBigfootSighting, Bigfoot, createBigfootSchema,
  A_BIGFOOT_SIGHTING, AN_ENTITY_ID, AN_ENTITY_KEY } from './helpers/bigfoot-data-helper';

import Client from '../lib/client';
import Schema from '../lib/schema/schema'
import Repository from '../lib/repository';

const globals: Globals = (globalThis as unknown) as Globals;

describe("Repository", () => {

  let client: Client;
  let repository: Repository<Bigfoot>;
  let schema: Schema<Bigfoot>;

  beforeAll(() => {
    client = globals.client;
    schema = createBigfootSchema();
  });

  beforeEach(async () => {
    repository = client.fetchRepository<Bigfoot>(schema);
  });

  describe("#remove", () => {
    describe("when removing an existing entity", () => {
      beforeEach(async () => {
        await addBigfootSighting(client, AN_ENTITY_KEY, A_BIGFOOT_SIGHTING);
        await repository.remove(AN_ENTITY_ID);
      });

      it("removes the entity", async () => {
        let exists = await keyExists(client, AN_ENTITY_KEY)
        expect(exists).toBe(false);
      });
    });

    describe("when removing a non-existing entity", () => {
      beforeEach(async () => {
        await repository.remove(AN_ENTITY_ID);
      });

      it("like a honey badger, doesn't care", async () => {
        let exists = await keyExists(client, AN_ENTITY_KEY)
        expect(exists).toBe(false);
      });
    });
  });
});
