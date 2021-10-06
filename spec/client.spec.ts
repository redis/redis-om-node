import { mocked } from 'ts-jest/utils';

import RedisShim from '../lib/redis/redis-shim';
import Client from '../lib/client';

jest.mock('../lib/redis/redis-shim');


beforeEach(() => mocked(RedisShim).mockClear());

describe("Client", () => {

  let client: Client;

  describe("when created", () => {
    beforeEach(async () => client = new Client());

    it("constructs a new RedisShim", () => {
      expect(RedisShim).toHaveBeenCalled();
    });

    describe("and opened with no URL specified", () => {
      beforeEach(async () => await client.open());

      it("opens the shim with the default url", () => {
        expect(RedisShim.prototype.open).toHaveBeenCalledWith('redis://localhost:6379');
      });

      describe("and closed", () => {
        beforeEach(async () => await client.close());
        it("closes the shim", () => {
          expect(RedisShim.prototype.close).toHaveBeenCalled();
        }); 
      });
    });

    describe("and opened with a URL", () => {
      beforeEach(async () => await client.open('redis://foo.bar:1234'));

      it("opens the shim with the default url", () => {
        expect(RedisShim.prototype.open).toHaveBeenCalledWith('redis://foo.bar:1234');
      });
    });
  });

    //   describe("#execute", () => {

    //     it('executes a Redis command that returns null', async () => {
    //       let result = client.execute<string|null>(['GET', 'foo']);
    //       return expect(result).resolves.toBeNull();
    //     });
    
    //     it('executes a Redis command that returns OK', async () => {
    //       let result = client.execute<string|null>(['SET', 'foo', 'bar']);
    //       return expect(result).resolves.toBe('OK');
    //     });
    
    //     it('executes a Redis command that returns a string', async () => {
    //       await client.execute(['SET', 'foo', 'bar']);
    //       let result = client.execute<string|null>(['GET', 'foo'])
    //       return expect(result).resolves.toBe('bar');
    //     });
    
    //     it('executes a Redis command that returns an array with nulls', async () => {
    //       await client.execute(['SET', 'a', '1']);
    //       await client.execute(['SET', 'b', '2']);
    //       let result = client.execute<(string)[]>(['MGET', 'a', 'b', 'c'])
    //       return expect(result).resolves.toEqual(['1', '2', null]);
    //     });
    
    //     it('executes a Redis command that returns complex data', async () => {
    //       await client.execute([
    //         'GEOADD', 'foo',
    //           13.361389, 38.115556, 'Palermo',
    //           15.087269, 37.502669, 'Catania']);
    
    //       let result = client.execute<string[][]>([
    //         'GEOPOS', 'foo',
    //           'Palermo', 'Catania', 'Columbus'])
    
    //       return expect(result).resolves.toEqual([
    //         ["13.36138933897018433", "38.11555639549629859"],
    //         ["15.08726745843887329", "37.50266842333162032"],
    //         null
    //       ]);
    //     });
    //   });
    // });
  // });
});
