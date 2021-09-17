import Globals from './globals';

import Client from '../lib/client';
import { Schema, RedisString, RedisBoolean, RedisNumber } from '../lib/schema'
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
        title: new RedisString(),
        eyewitness: new RedisBoolean(),
        temperature: new RedisNumber()
      });
  });

  beforeEach(async () => {
    await client.execute(['FLUSHALL']);
    repository = client.fetchRepository<Bigfoot>(schema);
  });

  describe("#save", () => {

    let redisId: RedisId;

    describe("when creating", () => {

      let expectedKey: string;

      describe("a simple entity", () => {
        beforeEach(async () => {
          entity = repository.create();
          entity.title = A_TITLE;
          entity.eyewitness = true;
          entity.temperature = A_TEMPERATURE;
          redisId = await repository.save(entity);
          expectedKey = `Bigfoot:${redisId}`;
        });
  
        it("creates the expected fields in a Redis Hash", async () => {
          let fields = await client.execute<string[]>(['HKEYS', expectedKey]);
          expect(fields).toHaveLength(3);
          expect(fields).toContainEqual('title');
          expect(fields).toContainEqual('eyewitness');
          expect(fields).toContainEqual('temperature');
        });
  
        it("stores the expected values in a Redis Hash", async () => {
          let values = await client.execute<string[]>(['HMGET', expectedKey, 'title', 'eyewitness', 'temperature']);
          expect(values).toEqual([A_TITLE, '1', `${A_TEMPERATURE}`]);
        });
      });
  
      describe("a sparsely populated entity", () => {
        beforeEach(async () => {
          entity = repository.create();
          entity.title = A_TITLE;
          entity.eyewitness = false;
          redisId = await repository.save(entity);
          expectedKey = `Bigfoot:${redisId}`;
        });
  
        it("creates the expected fields in a Redis Hash", async () => {
          let fields = await client.execute<string[]>(['HKEYS', expectedKey]);
          expect(fields).toHaveLength(2);
          expect(fields).toContainEqual('title');
          expect(fields).toContainEqual('eyewitness');
        });
  
        it("stores the expected values in a Redis Hash", async () => {
          let values = await client.execute<string[]>(['HMGET', expectedKey, 'title', 'eyewitness', 'temperature']);
          expect(values).toEqual([A_TITLE, '0', null]);
        });
      });
  
      describe("a sparsely populated entity with explicit null and undefined", () => {
        beforeEach(async () => {
          entity = repository.create();
          entity.title = A_TITLE;
          entity.eyewitness = null;
          entity.temperature = undefined;
          redisId = await repository.save(entity);
          expectedKey = `Bigfoot:${redisId}`;
        });
  
        it("creates the expected fields in a Redis Hash", async () => {
          let fields = await client.execute<string[]>(['HKEYS', expectedKey]);
          expect(fields).toHaveLength(1);
          expect(fields).toContainEqual('title');
        });
  
        it("stores the expected values in a Redis Hash", async () => {
          let values = await client.execute<string[]>(['HMGET', expectedKey, 'title', 'eyewitness', 'temperature']);
          expect(values).toEqual([A_TITLE, null, null]);
        });
      });
    });

    describe("when updating", () => {
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
