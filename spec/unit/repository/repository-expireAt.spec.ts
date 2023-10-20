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
      await repository.expireAt('foo', tomorrow);
      expect(client.expireAt).toHaveBeenCalledWith(
        'SimpleEntity:foo',
        tomorrow
      );
    });

    it('expires multiple entities', async () => {
      await repository.expireAt(['foo', 'bar', 'baz'], tomorrow);
      expect(client.expireAt).toHaveBeenNthCalledWith(
        1,
        'SimpleEntity:foo',
        tomorrow
      );
      expect(client.expireAt).toHaveBeenNthCalledWith(
        2,
        'SimpleEntity:bar',
        tomorrow
      );
      expect(client.expireAt).toHaveBeenNthCalledWith(
        3,
        'SimpleEntity:baz',
        tomorrow
      );
    });

    it('throws an error when provided invalid/past date', async () => {
      let caughtError: any;
      await repository.expireAt('foo', yesterday).catch((error) => {
        caughtError = error;
      });
      expect(client.expireAt).toHaveBeenCalledTimes(0);
      expect(caughtError).toBeDefined();
      expect(caughtError!.message).toEqual(
        `${yesterday.toString()} is invalid. Expiration date must be in the future.`
      );
    });
  });
});
