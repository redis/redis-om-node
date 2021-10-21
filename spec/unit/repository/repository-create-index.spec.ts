import { mocked } from 'ts-jest/utils';

import Client from '../../../lib/client';
import Repository from '../../../lib/repository/repository';

import { simpleSchema, SimpleEntity } from '../helpers/test-entity-and-schema';

jest.mock('../../../lib/client');


beforeEach(() => mocked(Client).mockReset());

describe("Repository", () => {

  let client: Client;
  let repository: Repository<SimpleEntity>;

  describe("#createIndex", () => {

    beforeAll(() => client = new Client());

    beforeEach(async () => {
      repository = new Repository(simpleSchema, client);
      await repository.createIndex();
    });

    it("asks the client to create the index with data from the schema", () => {
      expect(Client.prototype.createIndex).toHaveBeenCalledWith(
        simpleSchema.indexName,
        simpleSchema.dataStructure,
        `${simpleSchema.prefix}:`,
        simpleSchema.redisSchema
      );
    });
  });
});
