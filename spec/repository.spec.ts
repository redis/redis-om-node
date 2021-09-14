import Globals from './globals';

import Client from '../lib/client';
import { Schema, RedisId, RedisTextField, RedisTagField, RedisNumericField, RedisUserField, SchemaOptions } from '../lib/schema'
import Entity from '../lib/entity';
import Repository from '../lib/repository';

interface Bigfoot {
  title: string | null | undefined;
  state: string | null | undefined;
  temperature: number | null | undefined;
}

class Bigfoot extends Entity {
  get foo(): string {
    return this.title + ' bob';
  }
}

let schema = new Schema<Bigfoot>(
  Bigfoot, {
    title: new RedisTextField(),
    state: new RedisTagField(),
    temperature: new RedisNumericField()
  });

const globals: Globals = (globalThis as unknown) as Globals;

describe("Repository", () => {

  let client: Client;
  let subject: Repository<Bigfoot>;

  beforeEach(async () => {
    client = globals.client;
    await client.execute(['FLUSHALL']);
    subject = client.fetchRepository<Bigfoot>(schema);
  })

  describe("#save", () => {

    it("creates an entity in Redis", async () => {

      let entity = new Bigfoot();
      entity.title = 'This was in Kentucky';
      entity.state = 'KY';
      entity.temperature = 83;

      let redisId = await subject.save(entity);

      expect(redisId).toMatch(/^[A-Za-z0-9+/]{22}$/);

      let fields = await client.execute<string[]>(['HKEYS', `Bigfoot:${redisId}`]);
      expect(fields).toHaveLength(3);
      expect(fields).toContainEqual('title');
      expect(fields).toContainEqual('state');
      expect(fields).toContainEqual('temperature');

      let values = await client.execute<string[]>(['HMGET', `Bigfoot:${redisId}`, 'title', 'state', 'temperature']);
      expect(values).toEqual(['This was in Kentucky', 'KY', '83']);

    });

    it("creates a sparse entity in Redis", async () => {

      let entity = new Bigfoot();
      entity.title = 'This was in Kentucky';
      entity.state = 'KY';

      let redisId = await subject.save(entity);
      
      expect(redisId).toMatch(/^[A-Za-z0-9+/]{22}$/);

      let fields = await client.execute<string[]>(['HKEYS', `Bigfoot:${redisId}`]);
      expect(fields).toHaveLength(2);
      expect(fields).toContainEqual('title');
      expect(fields).toContainEqual('state');

      let values = await client.execute<string[]>(['HMGET', `Bigfoot:${redisId}`, 'title', 'state', 'temperature']);
      expect(values).toEqual(['This was in Kentucky', 'KY', null]);
    });

    it("creates a sparse entity in Redis with explicit nulls", async () => {

      let entity = new Bigfoot();
      entity.title = 'This was in Kentucky';
      entity.state = null;
      entity.temperature = undefined;

      let redisId = await subject.save(entity);
      
      expect(redisId).toMatch(/^[A-Za-z0-9+/]{22}$/);

      let fields = await client.execute<string[]>(['HKEYS', `Bigfoot:${redisId}`]);
      expect(fields).toHaveLength(1);
      expect(fields).toContainEqual('title');

      let values = await client.execute<string[]>(['HMGET', `Bigfoot:${redisId}`, 'title', 'state', 'temperature']);
      expect(values).toEqual(['This was in Kentucky', null, null]);
    });

    it("updates an entity if Redis", async () => {

      await client.execute([
        'HSET', 'Bigfoot:Y8oK3s1DTUS/p4SsG7DQyg',
          'title', 'This is a test title',
          'state', 'OH',
          'temperature', 83
        ]);

      let entity = await subject.fetch('Y8oK3s1DTUS/p4SsG7DQyg');
      entity.state = 'VA';
      entity.temperature = 74;

      let redisId = await subject.save(entity);

      expect(redisId).toBe('Y8oK3s1DTUS/p4SsG7DQyg');

      let fields = await client.execute<string[]>(['HKEYS', `Bigfoot:${redisId}`]);
      expect(fields).toHaveLength(3);
      expect(fields).toContainEqual('title');
      expect(fields).toContainEqual('state');
      expect(fields).toContainEqual('temperature');

      let values = await client.execute<string[]>(['HMGET', `Bigfoot:${redisId}`, 'title', 'state', 'temperature']);
      expect(values).toEqual(['This is a test title', 'VA', '74']);

    });

    it("updates an entity if Redis", async () => {

      await client.execute([
        'HSET', 'Bigfoot:Y8oK3s1DTUS/p4SsG7DQyg',
          'title', 'This is a test title',
          'state', 'OH',
          'temperature', 83
        ]);

      let entity = await subject.fetch('Y8oK3s1DTUS/p4SsG7DQyg');
      entity.state = 'VA';
      entity.temperature = undefined;
      entity.title = null;

      let redisId = await subject.save(entity);

      expect(redisId).toBe('Y8oK3s1DTUS/p4SsG7DQyg');

      let fields = await client.execute<string[]>(['HKEYS', `Bigfoot:${redisId}`]);
      expect(fields).toHaveLength(1);
      expect(fields).toContainEqual('state');

      let values = await client.execute<string[]>(['HMGET', `Bigfoot:${redisId}`, 'title', 'state', 'temperature']);
      expect(values).toEqual([null, 'VA', null]);
    });
  });

  describe("#fetch", () => {

    it("fetches an entity from Redis", async () => {

      await client.execute([
        'HSET', 'Bigfoot:Y8oK3s1DTUS/p4SsG7DQyg',
          'title', 'This is a test title',
          'state', 'OH',
          'temperature', 83
        ]);

      let entity = await subject.fetch('Y8oK3s1DTUS/p4SsG7DQyg');

      expect(entity.redisId).toBe('Y8oK3s1DTUS/p4SsG7DQyg');
      expect(entity.title).toBe('This is a test title');
      expect(entity.state).toBe('OH');
      expect(entity.temperature).toBe(83);
      expect(entity.foo).toBe('This is a test title bob');
    });
  });

  describe("#remove", () => {

    it("removes an entity from Redis", async () => {

      await client.execute([
        'HSET', 'Bigfoot:Y8oK3s1DTUS/p4SsG7DQyg',
          'title', 'This is a test title',
          'state', 'OH',
          'temperature', 83
        ]);

      await subject.remove('Y8oK3s1DTUS/p4SsG7DQyg');

      let exists = await client.execute<number>(['EXISTS', 'Bigfoot:Y8oK3s1DTUS/p4SsG7DQyg'])
      expect(exists).toBe(0);
    });
  });

});
