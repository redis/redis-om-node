import Globals from './globals';

import Client from '../lib/client';
import { Schema } from '../lib/schema'
import { Entity, RedisId } from '../lib/entity';
import Repository from '../lib/repository';

const globals: Globals = (globalThis as unknown) as Globals;

const A_TITLE = "Bigfoot was seen out by the Walmart";
const A_TEMPERATURE = 75;

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

  describe("when saving a new entity", () => {
    let redisId: RedisId;

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
});
