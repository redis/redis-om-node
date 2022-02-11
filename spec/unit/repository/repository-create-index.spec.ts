import { mocked } from 'ts-jest/utils';

import Client from '../../../lib/client';
import Repository from '../../../lib/repository/repository';
import { HashRepository } from '../../../lib/repository/repository';

import { simpleSchema, SimpleEntity,
  stopWordsOffSchema, StopWordsOffEntity,
  customStopWordsSchema, CustomStopWordsEntity } from '../helpers/test-entity-and-schema';

jest.mock('../../../lib/client');


beforeEach(() => mocked(Client).mockReset());

describe("Repository", () => {
  let client: Client;
  beforeAll(() => client = new Client());

  describe("#createIndex", () => {
    describe("with a simple schema", () => {
      let repository: Repository<SimpleEntity>;

      beforeEach(async () => {
        repository = new HashRepository(simpleSchema, client);
        await repository.createIndex();
      });

      it("asks the client to create the index with data from the schema", () => {
        expect(Client.prototype.createIndex).toHaveBeenCalledWith({
          indexName: simpleSchema.indexName,
          dataStructure: simpleSchema.dataStructure,
          prefix: `${simpleSchema.prefix}:`,
          schema: simpleSchema.redisSchema });
      });
    });

    describe("with stop words turned off", () => {
      let repository: Repository<StopWordsOffEntity>;

      beforeEach(async () => {
        repository = new HashRepository(stopWordsOffSchema, client);
        await repository.createIndex();
      });

      it("asks the client to create the index with data from the schema", () => {
        expect(Client.prototype.createIndex).toHaveBeenCalledWith({
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
        expect(Client.prototype.createIndex).toHaveBeenCalledWith({
          indexName: customStopWordsSchema.indexName,
          dataStructure: customStopWordsSchema.dataStructure,
          prefix: `${customStopWordsSchema.prefix}:`,
          schema: customStopWordsSchema.redisSchema,
          stopWords: customStopWordsSchema.stopWords });
      });
    });
  });
});
