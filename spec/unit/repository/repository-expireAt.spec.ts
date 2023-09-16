import '../helpers/mock-client';

import { Client } from '$lib/client';
import { Repository } from '$lib/repository';
import { Schema } from '$lib/schema';

const simpleSchema = new Schema('SimpleEntity', {}, { dataStructure: 'HASH' });

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

describe('Repository', () => {
  describe('#expireAt', () => {
    let client: Client;
    let repository: Repository;

    beforeAll(() => {
      client = new Client();
    });
    beforeEach(() => {
      repository = new Repository(simpleSchema, client);
    });

    it('expires a single entity', async () => {
      const ttlInSeconds: number = Math.round(
        (tomorrow.getTime() - Date.now()) / 1000
      );
      await repository.expireAt('foo', tomorrow);
      expect(client.expire).toHaveBeenCalledWith(
        'SimpleEntity:foo',
        ttlInSeconds
      );
    });

    it('expires multiple entities', async () => {
      const ttlInSeconds: number = Math.round(
        (tomorrow.getTime() - Date.now()) / 1000
      );
      await repository.expireAt(['foo', 'bar', 'baz'], tomorrow);
      expect(client.expire).toHaveBeenNthCalledWith(
        1,
        'SimpleEntity:foo',
        ttlInSeconds
      );
      expect(client.expire).toHaveBeenNthCalledWith(
        2,
        'SimpleEntity:bar',
        ttlInSeconds
      );
      expect(client.expire).toHaveBeenNthCalledWith(
        3,
        'SimpleEntity:baz',
        ttlInSeconds
      );
    });

    it('throws an error when provided invalid/past date', async () => {
      let caughtError: any;
      await repository.expireAt('foo', yesterday).catch((error) => {
        caughtError = error;
      });
      expect(client.expire).toHaveBeenCalledTimes(0);
      expect(caughtError).toBeDefined();
      expect(caughtError!.message).toEqual(
        `${yesterday.toString()} is invalid. Expiration date must be in the future.`
      );
    });
  });
});
