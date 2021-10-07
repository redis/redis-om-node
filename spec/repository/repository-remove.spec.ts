import { mocked } from 'ts-jest/utils';

import Client from '../../lib/client';
import Repository from '../../lib/repository/repository';
import { EntityId } from '../../lib/entity/entity-types';

import TestEntity from '../helpers/test-entity';
import { testSchema } from '../helpers/test-schema';

jest.mock('../../lib/client');


beforeEach(() => mocked(Client).mockReset());

describe("Repository", () => {

  let client: Client;
  let repository: Repository<TestEntity>;
  let entityId: EntityId;
  let expectedKey: string;

  describe("#remove", () => {

    beforeAll(() => client = new Client());

    beforeEach(async () => {
      repository = new Repository(testSchema, client);
      entityId = 'foo';
      expectedKey = `TestEntity:${entityId}`;
      await repository.remove(entityId);
    });

    it("removes the key", () =>
      expect(Client.prototype.unlink).toHaveBeenCalledWith(expectedKey));
  });
});
