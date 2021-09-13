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
      let result = subject.execute<string|null>(['GET', 'foo'])
      return expect(result).resolves.toBeNull();
    });

    it('executes a Redis command that returns OK', async () => {
      let result = subject.execute<string|null>(['SET', 'foo', 'bar']);
      return expect(result).resolves.toBe('OK');
    });

    it('executes a Redis command that returns a string', async () => {
      await subject.execute(['SET', 'foo', 'bar']);
      let result = subject.execute<string|null>(['GET', 'foo'])
      return expect(result).resolves.toBe('bar');
    });

    it('executes a Redis command that returns an array with nulls', async () => {
      await subject.execute(['SET', 'a', '1']);
      await subject.execute(['SET', 'b', '2']);
      let result = subject.execute<(string)[]>(['MGET', 'a', 'b', 'c'])
      return expect(result).resolves.toEqual(['1', '2', null]);
    });

    it('executes a Redis command that returns complex data', async () => {
      await subject.execute([
        'GEOADD', 'foo',
          13.361389, 38.115556, 'Palermo',
          15.087269, 37.502669, 'Catania']);

      let result = subject.execute<string[][]>([
        'GEOPOS', 'foo',
          'Palermo', 'Catania', 'Columbus'])

      return expect(result).resolves.toEqual([
        ["13.36138933897018433", "38.11555639549629859"],
        ["15.08726745843887329", "37.50266842333162032"],
        null
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

      await subject.execute([
        'HSET', 'test-prefix:13',
          'id', '13',
          'title', 'This is an unlucky test title',
          'temperature', 13,
          'state', 'WV',
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
        });

      let bigfootRepository = subject.fetchRepository<Bigfoot>(schema);

      /*
      TODO: can we interrogate the interface and default the schema?
      let bfRepo2 = subject.fetchRepository<BigFoot>(new Schema<Bigfoot>(Bigfoot));
      let bfRepo3 = subject.fetchRepository<BigFoot>(Bigfoot);
      */

      let one = await bigfootRepository.fetchById('12');
      
      expect(one.id).toBe('12');
      expect(one.title).toBe('This is a test title');
      expect(one.state).toBe('OH');
      expect(one.temperature).toBe(12);
      expect(one.foo).toBe('This is a test title bob');

      // one.title = 'Changed Title';
      // one.state = 'NJ';
      // await one.save();
      // one.state = 'OH';
      // await bigfootRepository.save(one);

      // await bigfootRepository.deleteById('12');
      // await one.delete();
      // await bigfootRepository.delete(one);

      // await bigfootRepository.deleteAll();

      let many = await bigfootRepository.fetchAll();

      expect(many.length).toBe(2);

      // expect(many[0].id).toBe('12');
      // expect(many[0].title).toBe('This is a test title');
      // expect(many[0].state).toBe('OH');
      // expect(many[0].temperature).toBe(12);
      // expect(many[0].foo).toBe('This is a test title bob');

    });
  });
});
