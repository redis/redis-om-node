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

  describe("#createIndex", () => {

    beforeAll(() => client = new Client());

    beforeEach(async () => {
      repository = new Repository(testSchema, client);
      await repository.createIndex();
    });

    it("asks the client to create the index with data from the schema", () => {
      expect(Client.prototype.createIndex).toHaveBeenCalledWith(
        testSchema.indexName,
        testSchema.dataStructure,
        `${testSchema.prefix}:`,
        testSchema.redisSchema
      );
    });
  });
});
