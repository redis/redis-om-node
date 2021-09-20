import Globals from './globals';

import Client from '../lib/client';
import { Schema } from '../lib/schema'
import { Entity } from '../lib/entity';
import Repository from '../lib/repository';

const globals: Globals = (globalThis as unknown) as Globals;

const A_TITLE = "Bigfoot was seen out by the Walmart";
const A_TEMPERATURE = 75;

const REDIS_ID = '1234';
const REDIS_KEY = `Bigfoot:${REDIS_ID}`;

describe("Repository", () => {

  interface Bigfoot {
    title?: string | null;
    eyewitness?: boolean | null;
    temperature?: number | null;
  }
  
  class Bigfoot extends Entity {}

  let client: Client;
  let repository: Repository<Bigfoot>;
  let schema: Schema<Bigfoot>;

  beforeAll(() => {
    client = globals.client;
    schema = new Schema<Bigfoot>(
      Bigfoot, {
        title: { type: 'string' },
        eyewitness: { type: 'boolean' },
        temperature: { type: 'number' }
      });
  });

  beforeEach(async () => {
    await client.execute(['FLUSHALL']);
    repository = client.fetchRepository<Bigfoot>(schema);
  });

  describe("#remove", () => {
    describe("when removing an existing entity", () => {
      beforeEach(async () => {
        await client.execute([
          'HSET', REDIS_KEY,
            'title', A_TITLE,
            'eyewitness', '1',
            'temperature', A_TEMPERATURE
          ]);
        await repository.remove(REDIS_ID);
      });

      it("removes the entity", async () => {
        let exists = await client.execute<number>(['EXISTS', REDIS_KEY])
        expect(exists).toBe(0);
      });
    });

    describe("when removing a non-existing entity", () => {
      beforeEach(async () => {
        await repository.remove(REDIS_ID);
      });

      it("like a honey badger, doesn't care", async () => {
        let exists = await client.execute<number>(['EXISTS', REDIS_KEY])
        expect(exists).toBe(0);
      });
    });
  });
});
