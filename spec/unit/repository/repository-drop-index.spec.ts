import { mocked } from 'ts-jest/utils';

import Client from '../../../lib/client';
import Repository from '../../../lib/repository/repository';

import { simpleSchema, SimpleEntity } from '../helpers/test-entity-and-schema';

jest.mock('../../../lib/client');


beforeEach(() => mocked(Client).mockReset());

describe("Repository", () => {

  let client: Client;
  let repository: Repository<SimpleEntity>;

  describe("#dropIndex", () => {

    beforeAll(() => client = new Client());

    beforeEach(async () => {
      repository = new Repository(simpleSchema, client);
    });
    
    it("asks the client to drop the index with data from the schema", async () => {
      await repository.dropIndex();
      expect(Client.prototype.dropIndex).toHaveBeenCalledWith(simpleSchema.indexName);
    });

    it("eats the exception if the index is missing", async () => {
      mocked(Client.prototype.dropIndex).mockRejectedValue(new Error("Unknown Index name"));
      await repository.dropIndex(); // it doesn't throw an exception
    });

    it("propogates the exception if it errors and it's not a missing index exception", async () => {
      mocked(Client.prototype.dropIndex).mockRejectedValue(new Error("Some other error"));
      expect(async () => await repository.dropIndex()).rejects.toThrow("Some other error");
    });
  });
});
