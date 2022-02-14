import Client from '../../../lib/client';
import Schema from '../../../lib/schema/schema';
import Repository from '../../../lib/repository/repository';

import { createHashEntitySchema, SampleHashEntity } from '../helpers/data-helper';
import { fetchIndexInfo, flushAll  } from '../helpers/redis-helper';

describe("create and drop index on hash", () => {

  let client: Client;
  let repository: Repository<SampleHashEntity>;
  let schema: Schema<SampleHashEntity>;
  let result: string[];

  beforeAll(async () => {
    client = new Client();
    await client.open();

    schema = createHashEntitySchema();
    repository = client.fetchRepository<SampleHashEntity>(schema);
  });

  afterAll(async () => await client.close());
  
  describe("when the index is created", () => {
    beforeEach(async () => {
      await flushAll(client);
      await repository.createIndex();
      result = await fetchIndexInfo(client, 'SampleHashEntity:index');
    });

    it("has the expected name", () => {
      let indexName = result[1];
      expect(indexName).toBe('SampleHashEntity:index');
    });
  
    it("has the expected key type", () => {
      let keyType = result[5][1];
      expect(keyType).toBe('HASH');
    });
  
    it("has the expected prefixes", () => {
      let prefixes = result[5][3];
      expect(prefixes).toEqual([ 'SampleHashEntity:' ]);
    });
  
    it("has the expected fields", () => {
      let fields = result[7];
      expect(fields).toHaveLength(14);
      expect(fields).toEqual([
        [ 'identifier', 'aString', 'attribute', 'aString', 'type', 'TAG', 'SEPARATOR', '|' ],
        [ 'identifier', 'anotherString', 'attribute', 'anotherString', 'type', 'TAG', 'SEPARATOR', '|' ],
        [ 'identifier', 'aFullTextString', 'attribute', 'aFullTextString', 'type', 'TEXT', 'WEIGHT', '1' ],
        [ 'identifier', 'anotherFullTextString', 'attribute', 'anotherFullTextString', 'type', 'TEXT', 'WEIGHT', '1' ],
        [ 'identifier', 'aNumber', 'attribute', 'aNumber', 'type', 'NUMERIC' ],
        [ 'identifier', 'anotherNumber', 'attribute', 'anotherNumber', 'type', 'NUMERIC' ],
        [ 'identifier', 'aBoolean', 'attribute', 'aBoolean', 'type', 'TAG', 'SEPARATOR', ',' ],
        [ 'identifier', 'anotherBoolean', 'attribute', 'anotherBoolean', 'type', 'TAG', 'SEPARATOR', ',' ],
        [ 'identifier', 'aGeoPoint', 'attribute', 'aGeoPoint', 'type', 'GEO' ],
        [ 'identifier', 'anotherGeoPoint', 'attribute', 'anotherGeoPoint', 'type', 'GEO' ],
        [ 'identifier', 'aDate', 'attribute', 'aDate', 'type', 'NUMERIC' ],
        [ 'identifier', 'anotherDate', 'attribute', 'anotherDate', 'type', 'NUMERIC' ],
        [ 'identifier', 'anArray', 'attribute', 'anArray', 'type', 'TAG', 'SEPARATOR', '|' ],
        [ 'identifier', 'anotherArray', 'attribute', 'anotherArray', 'type', 'TAG', 'SEPARATOR', '|' ]
      ]);
    });

    describe("when the index is dropped", () => {
      beforeEach(async () => {
        await repository.dropIndex();
      });
      
      it("the index no longer exists", () => {
        expect(async () => await fetchIndexInfo(client, 'SampleHashEntity:index'))
          .rejects.toThrow("Unknown Index name");
      });  
    });
  });
});
