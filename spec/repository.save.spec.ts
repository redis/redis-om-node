import Globals from './globals';

import Client from '../lib/client';
import { Schema } from '../lib/schema'
import { Entity, RedisId } from '../lib/entity';
import Repository from '../lib/repository';

const globals: Globals = (globalThis as unknown) as Globals;

const A_TITLE = "Bigfoot was seen out by the Walmart";
const A_TEMPERATURE = 75;

const ANOTHER_TITLE = "Bigfoot was seen out by the Piggly Wiggly";
const ANOTHER_TEMPERATURE = 87;

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

  describe("when updating an existing entity", () => {

    let redisId: RedisId;

    beforeEach(async () => {
      await client.execute([
        'HSET', REDIS_KEY,
          'title', A_TITLE,
          'eyewitness', '1',
          'temperature', A_TEMPERATURE
        ]);

      entity = await repository.fetch(REDIS_ID);
    });

    describe("all the fields in the entity", () => {
      beforeEach(async () => {
        entity.title = ANOTHER_TITLE;
        entity.eyewitness = false;
        entity.temperature = ANOTHER_TEMPERATURE;

        redisId = await repository.save(entity);
      });

      it("returns the Redis ID", () => expect(redisId).toBe(REDIS_ID))

      it("maintains the expected fields in a Redis Hash", async () => {
        let fields = await client.execute<string[]>(['HKEYS', REDIS_KEY]);
        expect(fields).toHaveLength(3);
        expect(fields).toContainEqual('title');
        expect(fields).toContainEqual('eyewitness');
        expect(fields).toContainEqual('temperature');
      });

      it("updates the expected values in a Redis Hash", async () => {
        let values = await client.execute<string[]>(['HMGET', REDIS_KEY, 'title', 'eyewitness', 'temperature']);
        expect(values).toEqual([ANOTHER_TITLE, '0', `${ANOTHER_TEMPERATURE}`]);
      });
    });

    describe("some of the fields in the entity", () => {
      beforeEach(async () => {
        entity.eyewitness = false;
        entity.temperature = ANOTHER_TEMPERATURE;

        redisId = await repository.save(entity);
      });

      it("returns the Redis ID", () => expect(redisId).toBe(REDIS_ID))

      it("maintains the expected fields in a Redis Hash", async () => {
        let fields = await client.execute<string[]>(['HKEYS', REDIS_KEY]);
        expect(fields).toHaveLength(3);
        expect(fields).toContainEqual('title');
        expect(fields).toContainEqual('eyewitness');
        expect(fields).toContainEqual('temperature');
      });

      it("updates the expected values in a Redis Hash", async () => {
        let values = await client.execute<string[]>(['HMGET', REDIS_KEY, 'title', 'eyewitness', 'temperature']);
        expect(values).toEqual([A_TITLE, '0', `${ANOTHER_TEMPERATURE}`]);
      });
    });

    describe("some of the fields in the entity to null or undefined", () => {
      beforeEach(async () => {
        entity.title = ANOTHER_TITLE;
        entity.eyewitness = null;
        entity.temperature = undefined;

        redisId = await repository.save(entity);
      });
      
      it("returns the Redis ID", () => expect(redisId).toBe(REDIS_ID))
      
      it("removes the null and undefined field from the Redis Hash", async () => {
        let fields = await client.execute<string[]>(['HKEYS', REDIS_KEY]);
        expect(fields).toHaveLength(1);
        expect(fields).toContainEqual('title');
      });
      
      it("removes the expected values from the Redis Hash", async () => {
        let values = await client.execute<string[]>(['HMGET', REDIS_KEY, 'title', 'eyewitness', 'temperature']);
        expect(values).toEqual([ANOTHER_TITLE, null, null]);
      });
    });
  });
});
