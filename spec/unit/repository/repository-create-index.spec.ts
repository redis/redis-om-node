import '../helpers/mock-client'
import { Client } from '$lib/client';
import { Repository } from '$lib/repository';
import { HashRepository } from '$lib/repository';

import { simpleSchema, SimpleEntity,
  stopWordsOffSchema, StopWordsOffEntity,
  customStopWordsSchema, CustomStopWordsEntity } from '../helpers/test-entity-and-schema';


describe("Repository", () => {
  let client: Client;
  beforeAll(() => {
    client = new Client()
  });

  describe("#createIndex", () => {
    describe("with a simple schema", () => {
      let repository: Repository<SimpleEntity>;

      beforeEach(() => {
        repository = new HashRepository(simpleSchema, client)
      });

      describe("and an index that doesn't exist", () => {
        beforeEach(async () => {
          vi.mocked(client.get).mockResolvedValue(null);
          await repository.createIndex();
        });

        it("asks the client for the index hash", () => {
          expect(client.get).toHaveBeenCalledWith(simpleSchema.indexHashName);
        });

        it("asks the client to create the index with data from the schema", () => {
          expect(client.createIndex).toHaveBeenCalledWith({
            indexName: simpleSchema.indexName,
            dataStructure: simpleSchema.dataStructure,
            prefix: `${simpleSchema.prefix}:`,
            schema: simpleSchema.redisSchema });
        });

        it("asks the client to write the index hash", () => {
          expect(client.set).toHaveBeenCalledWith(simpleSchema.indexHashName, simpleSchema.indexHash);
        });
      });

      describe("and an index that exists and is the same", () => {
        beforeEach(async () => {
          vi.mocked(client.get).mockResolvedValue(simpleSchema.indexHash);
          await repository.createIndex();
        });

        it("asks the client for the index hash", () => {
          expect(client.get).toHaveBeenCalledWith(simpleSchema.indexHashName);
        });

        it("doesn't ask the client to remove the current index", () => {
          expect(client.dropIndex).not.toHaveBeenCalled();
        });

        it("doesn't ask the client to remove the index hash", async () => {
          expect(client.unlink).not.toHaveBeenCalled();
        });

        it("does not asks the client to create the index with data from the schema", () => {
          expect(client.createIndex).not.toHaveBeenCalled();
        });

        it("does not asks the client to write the index hash", () => {
          expect(client.set).not.toHaveBeenCalled();
        });
      });

      describe("and an index that exists and is different", () => {
        beforeEach(async () => {
          vi.mocked(client.get).mockResolvedValue('A_MISMATCHED_INDEX_HASH');
          await repository.createIndex();
        });

        it("asks the client for the index hash", () => {
          expect(client.get).toHaveBeenCalledWith(simpleSchema.indexHashName);
        });

        it("asks the client to remove the current index", () => {
          expect(client.dropIndex).toHaveBeenCalledWith(simpleSchema.indexName);
        });

        it("asks the client to remove the index hash", async () => {
          expect(client.unlink).toHaveBeenCalledWith(simpleSchema.indexHashName);
        });

        it("asks the client to create a new index with data from the schema", () => {
          expect(client.createIndex).toHaveBeenCalledWith({
            indexName: simpleSchema.indexName,
            dataStructure: simpleSchema.dataStructure,
            prefix: `${simpleSchema.prefix}:`,
            schema: simpleSchema.redisSchema });
        });

        it("asks the client to write the index hash", () => {
          expect(client.set).toHaveBeenCalledWith(simpleSchema.indexHashName, simpleSchema.indexHash);
        });
      });
    });

    describe("with stop words turned off", () => {
      let repository: Repository<StopWordsOffEntity>;

      beforeEach(async () => {
        repository = new HashRepository(stopWordsOffSchema, client);
        await repository.createIndex();
      });

      it("asks the client to create the index with data from the schema", () => {
        expect(client.createIndex).toHaveBeenCalledWith({
          indexName: stopWordsOffSchema.indexName,
          dataStructure: stopWordsOffSchema.dataStructure,
          prefix: `${stopWordsOffSchema.prefix}:`,
          schema: stopWordsOffSchema.redisSchema,
          stopWords: [] });
      });
    });

    describe("with custom stop words", () => {
      let repository: Repository<CustomStopWordsEntity>;

      beforeEach(async () => {
        repository = new HashRepository(customStopWordsSchema, client);
        await repository.createIndex();
      });

      it("asks the client to create the index with data from the schema", () => {
        expect(client.createIndex).toHaveBeenCalledWith({
          indexName: customStopWordsSchema.indexName,
          dataStructure: customStopWordsSchema.dataStructure,
          prefix: `${customStopWordsSchema.prefix}:`,
          schema: customStopWordsSchema.redisSchema,
          stopWords: customStopWordsSchema.stopWords });
      });
    });
  });
});
