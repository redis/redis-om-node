import { mocked } from 'ts-jest/utils';
import { Repository } from '../../../lib';

import Client from "../../../lib/client";
import Search from "../../../lib/search/search";
import { mockClientSearchToReturnMultipleHashes, mockClientSearchToReturnMultipleSortedByNumberHashes, mockClientSearchToReturnSingleHash, SIMPLE_ENTITY_1, SIMPLE_ENTITY_2, SIMPLE_ENTITY_3 } from '../helpers/search-helpers';

import { SimpleHashEntity, simpleHashSchema, simpleSortableHashSchema } from "../helpers/test-entity-and-schema";

jest.mock('../../../lib/client');

beforeEach(() => mocked(Client).mockReset());
beforeEach(() => mocked(Client.prototype.search).mockReset());

describe("Search", () => {
  let client: Client;

  describe("#sort-by", () => {
    let query = '*', indexName = 'SimpleHashEntity:index', offset = 0, count = 10, sort = { sort:'aNumber', order:'ASC' }

    beforeAll(() => client = new Client());

    describe("when sorting aNumber in ascending order", () => {
        let entities: SimpleHashEntity[];
        let search: Search<SimpleHashEntity>;
        
        beforeEach(async () => {
          search = new Search<SimpleHashEntity>(simpleSortableHashSchema, client);
          mockClientSearchToReturnMultipleSortedByNumberHashes();
          entities = await search.sortBy('aNumber').returnAll();
        });

        it("asks the client for results", () => {
          expect(Client.prototype.search).toHaveBeenCalledTimes(1);
          expect(Client.prototype.search).toHaveBeenCalledWith({
            query, indexName, offset, count, sort: { field:'aNumber', order:'ASC' } });
        });

        it("the returned result", () => {
          expect(entities).toHaveLength(3);
          expect(entities[0].aNumber).toBe(SIMPLE_ENTITY_3.aNumber);
        });
      });
  
    describe("when finding maximum string", () => {
      let entity: SimpleHashEntity;
      let search: Search<SimpleHashEntity>;
      
      beforeEach(async () => {
        search = new Search<SimpleHashEntity>(simpleSortableHashSchema, client);
        mockClientSearchToReturnMultipleSortedByNumberHashes();
        entity = await search.max('aString');
      });

      it("asks the client for results", () => {
        expect(Client.prototype.search).toHaveBeenCalledTimes(1);
        expect(Client.prototype.search).toHaveBeenCalledWith({
          query, indexName, offset, count:1, sort: { field:'aString', order:'DESC' } });
      });

      it("the returned result", () => {
        expect(entity.aString).toBe(SIMPLE_ENTITY_3.aString);
      });
    });
  
  
  });
});
