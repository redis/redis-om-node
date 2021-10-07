import { mocked } from 'ts-jest/utils';

import Client from '../../lib/client';
import Repository from '../../lib/repository/repository';

import TestEntity from '../helpers/test-entity';
import { testSchema } from '../helpers/test-schema';

jest.mock('../../lib/client');


beforeEach(() => mocked(Client).mockReset());

describe("Repository", () => {

  let client: Client;
  let repository: Repository<TestEntity>;
  let entity: TestEntity;

  describe('#createEntity', () => {

    beforeAll(() => client = new Client());

    beforeEach(() => {
      repository = new Repository(testSchema, client);
      entity = repository.createEntity();
    })

    it("has a generated entity id", () => {
      expect(entity.entityId).toHaveLength(22);
      expect(entity.entityId).toMatch(/^[A-Za-z0-9+/]{22}$/);
    });

    it("is of the expected type", () => {
      expect(entity).toBeInstanceOf(TestEntity);
    });
  });
});
