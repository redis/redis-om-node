import { mocked } from 'ts-jest/utils';

import Client from '../../lib/client';
import Repository from '../../lib/repository/repository';
import { EntityId } from '../../lib/entity/entity-types';

import { simpleSchema, SimpleEntity } from '../helpers/test-entity-and-schema';

jest.mock('../../lib/client');


beforeEach(() => mocked(Client).mockReset());

describe("Repository", () => {

  let client: Client;
  let repository: Repository<SimpleEntity>;
  let entityId: EntityId;
  let expectedKey: string;

  describe("#remove", () => {

    beforeAll(() => client = new Client());

    beforeEach(async () => {
      repository = new Repository(simpleSchema, client);
      entityId = 'foo';
      expectedKey = `SimpleEntity:${entityId}`;
      await repository.remove(entityId);
    });

    it("removes the key", () =>
      expect(Client.prototype.unlink).toHaveBeenCalledWith(expectedKey));
  });
});
