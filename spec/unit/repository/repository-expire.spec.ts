import { mocked } from 'jest-mock';

import Client from '../../../lib/client';
import { JsonRepository, HashRepository } from '../../../lib/repository/repository';

import { simpleHashSchema, simpleJsonSchema, SimpleHashEntity, SimpleJsonEntity } from '../helpers/test-entity-and-schema';

jest.mock('../../../lib/client');


beforeEach(() => mocked(Client).mockReset());

describe("Repository", () => {

  let client: Client;
  let entityId = 'foo';
  let ttl = 60;

  describe("#expire", () => {

    beforeAll(() => client = new Client());

    it("expires a hash", async () => {
      let repository = new HashRepository<SimpleHashEntity>(simpleHashSchema, client);
      let expectedKey = `SimpleHashEntity:${entityId}`;
      await repository.expire(entityId, ttl);
      expect(Client.prototype.expire).toHaveBeenCalledWith(expectedKey, ttl);
    });

    it("expires a JSON", async () => {
      let repository = new JsonRepository<SimpleJsonEntity>(simpleJsonSchema, client);
      let expectedKey = `SimpleJsonEntity:${entityId}`;
      await repository.expire(entityId, ttl);
      expect(Client.prototype.expire).toHaveBeenCalledWith(expectedKey, ttl);
    });
  });
});
