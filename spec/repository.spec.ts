import Globals from './globals';

import Client from '../lib/client';
import { Schema, RedisId, RedisTextField, RedisTagField, RedisNumericField, RedisUserField, SchemaOptions } from '../lib/schema'
import Entity from '../lib/entity';
import Repository from '../lib/repository';

const globals: Globals = (globalThis as unknown) as Globals;

describe("Repository", () => {

  let client: Client;
  let subject: Repository<Bigfoot>;

  interface Bigfoot {
    id: string;
    title: string;
    state: string;
    temperature: number;
  }

  class Bigfoot extends Entity {
    get foo(): string {
      return this.title + ' bob';
    }
  }

  let schema = new Schema<Bigfoot>(
    Bigfoot, {
      id: new RedisId(),
      title: new RedisTextField(),
      state: new RedisTagField(),
      temperature: new RedisNumericField()
    }, {
      prefix: 'test-prefix'
    });

  beforeEach(async () => {
    client = globals.client;
    await client.execute(['FLUSHALL']);
    subject = client.fetchRepository<Bigfoot>(schema);
  })

  describe("#fetchById", () => {

    beforeEach(async () => {
      await client.execute([
        'HSET', 'test-prefix:12',
          'id', '12',
          'title', 'This is a test title',
          'temperature', 12,
          'state', 'OH',
        ]);
    });
      
    it("returns a populated entity", async () => {
      let one = await subject.fetchById('12');
      expect(one.id).toBe('12');
      expect(one.title).toBe('This is a test title');
      expect(one.state).toBe('OH');
      expect(one.temperature).toBe(12);
      expect(one.foo).toBe('This is a test title bob');
    });
  });

  describe("#fetchAll", () => {

    beforeEach(async () => {
      await client.execute([
        'HSET', 'test-prefix:12',
          'id', '12',
          'title', 'This is a test title',
          'temperature', 12,
          'state', 'OH',
        ]);

      await client.execute([
        'HSET', 'test-prefix:13',
          'id', '13',
          'title', 'This is an unlucky test title',
          'temperature', 13,
          'state', 'WV',
        ]);
    });

    it('returns the expected entities', async () => {
      let many = await subject.fetchAll();
      expect(many.length).toBe(2);
    });
  });
});
