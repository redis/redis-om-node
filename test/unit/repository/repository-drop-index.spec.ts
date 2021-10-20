import { mocked } from 'ts-jest/utils';

import Client from '../../../src/client';
import Repository from '../../../src/repository/repository';

import { simpleSchema, SimpleEntity } from '../helpers/test-entity-and-schema';

jest.mock('../../../src/client');


beforeEach(() => mocked(Client).mockReset());

describe("Repository", () => {

  let client: Client;
  let repository: Repository<SimpleEntity>;

  describe("#dropIndex", () => {

    beforeAll(() => client = new Client());

    beforeEach(async () => {
      repository = new Repository(simpleSchema, client);
      await repository.dropIndex();
    });

    it("asks the client to drop the index with data from the schema", () => {
      expect(Client.prototype.dropIndex).toHaveBeenCalledWith(simpleSchema.indexName);
    });
  });
});
