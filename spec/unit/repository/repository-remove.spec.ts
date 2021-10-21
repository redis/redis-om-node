import { mocked } from 'ts-jest/utils';

import Client from '../../../lib/client';
import Repository from '../../../lib/repository/repository';

import { simpleHashSchema, simpleJsonSchema, SimpleHashEntity, SimpleJsonEntity } from '../helpers/test-entity-and-schema';

jest.mock('../../../lib/client');


beforeEach(() => mocked(Client).mockReset());

describe("Repository", () => {

  let client: Client;
  let entityId = 'foo';

  describe("#remove", () => {

    beforeAll(() => client = new Client());

    it("removes a hash", async () => {
      let repository = new Repository<SimpleHashEntity>(simpleHashSchema, client);
      let expectedKey = `SimpleHashEntity:${entityId}`;
      await repository.remove(entityId);
      expect(Client.prototype.unlink).toHaveBeenCalledWith(expectedKey);
    });

    it("removes JSON", async () => {
      let repository = new Repository<SimpleJsonEntity>(simpleJsonSchema, client);
      let expectedKey = `SimpleJsonEntity:${entityId}`;
      await repository.remove(entityId);
      expect(Client.prototype.unlink).toHaveBeenCalledWith(expectedKey);
    });
  });
});
