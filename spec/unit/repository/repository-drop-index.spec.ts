import '../helpers/mock-client'

import { Client } from '$lib/client';
import { Repository, HashRepository } from '$lib/repository';
import { Schema } from '$lib/schema';

const simpleSchema = new Schema("SimpleEntity", {}, { dataStructure: 'HASH' })

describe("Repository", () => {

  let client: Client
  let repository: Repository

  describe("#dropIndex", () => {

    beforeAll(() => { client = new Client() })
    beforeEach(() => { repository = new HashRepository(simpleSchema, client) })

    describe("when the index exists", () => {
      beforeEach(async () => await repository.dropIndex());

      it("asks the client to drop the index", async () => {
        expect(client.dropIndex).toHaveBeenCalledWith(simpleSchema.indexName);
      });

      it("asks the client to remove the index hash", async () => {
        expect(client.unlink).toHaveBeenCalledWith(simpleSchema.indexHashName);
      });
    });

    describe("when the index doesn't exist", () => {
      beforeEach(async () => {
        vi.mocked(client.dropIndex).mockRejectedValue(new Error("Unknown Index name"));
      });

      it("eats the exception", async () => {
        await repository.dropIndex(); // it doesn't throw an exception
      });
    });

    describe("when dropping the index throws some other Redis exception", () => {
      beforeEach(async () => {
        vi.mocked(client.dropIndex).mockRejectedValue(new Error("Some other error"));
      });

      it("propogates the exception", async () => {
        expect(async () => await repository.dropIndex()).rejects.toThrow("Some other error");
      });
    });
  });
});
