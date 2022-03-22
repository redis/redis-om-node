import { mocked } from 'jest-mock';

import Client from '../../../lib/client';
import Repository from '../../../lib/repository/repository';
import { HashRepository } from '../../../lib/repository/repository';

import { simpleSchema, SimpleEntity } from '../helpers/test-entity-and-schema';

jest.mock('../../../lib/client');


beforeEach(() => mocked(Client).mockReset());

describe("Repository", () => {

  let client: Client;
  let repository: Repository<SimpleEntity>;

  describe("#dropIndex", () => {

    beforeAll(() => client = new Client());

    beforeEach(() => repository = new HashRepository(simpleSchema, client));

    describe("when the index exists", () => {
      beforeEach(async () => await repository.dropIndex());

      it("asks the client to drop the index", async () => {
        expect(Client.prototype.dropIndex).toHaveBeenCalledWith(simpleSchema.indexName);
      });

      it("asks the client to remove the index hash", async () => {
        expect(Client.prototype.unlink).toHaveBeenCalledWith(simpleSchema.indexHashName);
      });
    });

    describe("when the index doesn't exist", () => {
      beforeEach(async () => {
        mocked(Client.prototype.dropIndex).mockRejectedValue(new Error("Unknown Index name"));
      });

      it("eats the exception", async () => {
        await repository.dropIndex(); // it doesn't throw an exception
      });
    });

    describe("when dropping the index throws some other Redis exception", () => {
      beforeEach(async () => {
        mocked(Client.prototype.dropIndex).mockRejectedValue(new Error("Some other error"));
      });

      it("propogates the exception", async () => {
        expect(async () => await repository.dropIndex()).rejects.toThrow("Some other error");
      });
    });
  });
});
