import { mocked } from 'jest-mock';

import Client from '../../../lib/client';
import { JsonRepository, HashRepository } from '../../../lib/repository/repository';

import { simpleHashSchema, simpleJsonSchema, SimpleHashEntity, SimpleJsonEntity } from '../helpers/test-entity-and-schema';

jest.mock('../../../lib/client');


beforeEach(() => mocked(Client).mockReset());

describe("Repository", () => {

  let client: Client;
  let entityId = 'foo';
  let entitiesIds = ['foo', 'bar', 'baz'];

  describe("#remove", () => {

    beforeAll(() => client = new Client());

    it("removes a hash", async () => {
      let repository = new HashRepository<SimpleHashEntity>(simpleHashSchema, client);
      let expectedKey = `SimpleHashEntity:${entityId}`;
      await repository.remove(entityId);
      expect(Client.prototype.unlink).toHaveBeenCalledWith(expectedKey);
    });

    it("removes JSON", async () => {
      let repository = new JsonRepository<SimpleJsonEntity>(simpleJsonSchema, client);
      let expectedKey = `SimpleJsonEntity:${entityId}`;
      await repository.remove(entityId);
      expect(Client.prototype.unlink).toHaveBeenCalledWith(expectedKey);
    });

    it("removes many hashes", async () => {
      let repository = new HashRepository<SimpleHashEntity>(simpleHashSchema, client);
      let expectedKeys = entitiesIds.map(id => `SimpleHashEntity:${id}`);
      await repository.remove(entitiesIds);
      expect(Client.prototype.unlink).toHaveBeenCalledWith(expectedKeys);
    });

    it("removes many JSONs", async () => {
      let repository = new JsonRepository<SimpleJsonEntity>(simpleJsonSchema, client);
      let expectedKeys = entitiesIds.map(id => `SimpleJsonEntity:${id}`);
      await repository.remove(entitiesIds);
      expect(Client.prototype.unlink).toHaveBeenCalledWith(expectedKeys);
    })
  });
});
