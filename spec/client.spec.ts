import Globals from './globals';
import Client from '../lib/client';

const globals: Globals = (globalThis as unknown) as Globals;

describe("Client", () => {

  let subject: Client;

  beforeEach(async () => {
    subject = globals.client;
    await subject.execute(['FLUSHALL']);
  });

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
});
