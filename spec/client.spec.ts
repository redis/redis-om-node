import Client from '../lib/client';
import { Schema, RedisId, RedisTextField, RedisTagField, RedisNumericField, RedisUserField, SchemaOptions } from '../lib/schema'
import Entity from '../lib/entity';

describe("Client", () => {

  let subject: Client;

  beforeAll(async () => {
    subject = new Client();
    return subject.open();
  });

  beforeEach(async () => {
    return subject.execute(['FLUSHALL']);
  })

  afterAll(async () => {
    return subject.close();
  })

  describe("#execute", () => {

    it('executes a Redis command that returns null', async () => {
      let result = subject.execute(['GET', 'foo'])
      return expect(result).resolves.toBeNull();
    });

    it('executes a Redis command that returns OK', async () => {
      let result = subject.execute(['SET', 'foo', 'bar']);
      return expect(result).resolves.toBe('OK');
    });

    it('executes a Redis command that returns a string', async () => {
      await subject.execute(['SET', 'foo', 'bar']);
      let result = subject.execute(['GET', 'foo'])
      return expect(result).resolves.toBe('bar');
    });

    it('executes a Redis command that returns complex data', async () => {
      await subject.execute([
        'GEOADD', 'foo',
          13.361389, 38.115556, 'Palermo',
          15.087269, 37.502669, 'Catania']);

      let result = subject.execute([
        'GEOPOS', 'foo',
          'Palermo', 'Catania'])

      return expect(result).resolves.toEqual([
        ["13.36138933897018433", "38.11555639549629859"],
        ["15.08726745843887329", "37.50266842333162032"]
      ]);
    });

  });

  describe("#playground", () => {
    it('plays', async () => {

      await subject.execute([
        'HSET', 'test-prefix:12',
          'id', '12',
          'title', 'This is a test title',
          'temperature', 12,
          'state', 'OH',
        ]);

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
        })

      let bigfootRepository = subject.fetchRepository<Bigfoot>(schema);

      let one = await bigfootRepository.fetchById('12');
      
      expect(one.id).toBe('12');
      expect(one.title).toBe('This is a test title');
      expect(one.state).toBe('OH');
      expect(one.temperature).toBe(12);
      expect(one.foo).toBe('This is a test title bob');
    });

  })
});
