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
  let entity: Bigfoot;

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

  describe("#fetch", () => {
    describe("when fetching a fully populated entity from Redis", () => {
      beforeEach(async () => {
        await client.execute([
          'HSET', REDIS_KEY,
            'title', A_TITLE,
            'eyewitness', '1',
            'temperature', A_TEMPERATURE
          ]);

        entity = await repository.fetch(REDIS_ID);
      });

      it("returns the expected entity", () => {
        expect(entity.redisId).toBe(REDIS_ID);
        expect(entity.title).toBe(A_TITLE);
        expect(entity.eyewitness).toBe(true);
        expect(entity.temperature).toBe(A_TEMPERATURE);
      });
    });

    describe("when fetching a partially populated entity from Redis", () => {
      beforeEach(async () => {
        await client.execute([
          'HSET', REDIS_KEY,
            'title', A_TITLE
          ]);

        entity = await repository.fetch(REDIS_ID);
      });

      it("returns the expected entity", () => {
        expect(entity.redisId).toBe(REDIS_ID);
        expect(entity.title).toBe(A_TITLE);
        expect(entity.eyewitness).toBeNull();
        expect(entity.temperature).toBeNull();
      });
    });

    describe("when fetching an unpopulated entity from Redis", () => {
      beforeEach(async () => {
        entity = await repository.fetch(REDIS_ID);
      });

      it("returns the expected entity", () => {
        expect(entity.redisId).toBe(REDIS_ID);
        expect(entity.title).toBeNull();
        expect(entity.eyewitness).toBeNull();
        expect(entity.temperature).toBeNull();
      });
    });
  });
});
