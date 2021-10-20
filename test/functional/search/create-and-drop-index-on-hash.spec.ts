import { createHashEntitySchema, HashEntity } from '../helpers/data-helper';
import { fetchIndexInfo  } from '../helpers/redis-helper';

import Client from '../../../src/client';
import Schema from '../../../src/schema/schema';
import Repository from '../../../src/repository/repository';

describe("create and drop index on hash", () => {

  let client: Client;
  let repository: Repository<HashEntity>;
  let schema: Schema<HashEntity>;
  let result: string[];

  beforeAll(async () => {
    client = new Client();
    await client.open();

    schema = createHashEntitySchema();
    repository = client.fetchRepository<HashEntity>(schema);
  });

  afterAll(async () => await client.close());
  
  describe("when the index is created", () => {
    beforeEach(async () => {
      await client.execute(['FLUSHALL']);
      await repository.createIndex();
      result = await fetchIndexInfo(client, 'HashEntity:index');
    });

    it("has the expected name", () => {
      let indexName = result[1];
      expect(indexName).toBe('HashEntity:index');
    });
  
    it("has the expected key type", () => {
      let keyType = result[5][1];
      expect(keyType).toBe('HASH');
    });
  
    it("has the expected prefixes", () => {
      let prefixes = result[5][3];
      expect(prefixes).toEqual([ 'HashEntity:' ]);
    });
  
    it("has the expected fields", () => {
      let fields = result[7];
      expect(fields).toHaveLength(10);
      expect(fields[0]).toEqual([ 'identifier', 'aString', 'attribute', 'aString', 'type', 'TAG', 'SEPARATOR', '|' ]);
      expect(fields[1]).toEqual([ 'identifier', 'anotherString', 'attribute', 'anotherString', 'type', 'TAG', 'SEPARATOR', '|' ]);
      expect(fields[2]).toEqual([ 'identifier', 'aFullTextString', 'attribute', 'aFullTextString', 'type', 'TEXT', 'WEIGHT', '1' ]);
      expect(fields[3]).toEqual([ 'identifier', 'anotherFullTextString', 'attribute', 'anotherFullTextString', 'type', 'TEXT', 'WEIGHT', '1' ]);
      expect(fields[4]).toEqual([ 'identifier', 'aNumber', 'attribute', 'aNumber', 'type', 'NUMERIC' ]);
      expect(fields[5]).toEqual([ 'identifier', 'anotherNumber', 'attribute', 'anotherNumber', 'type', 'NUMERIC' ]);
      expect(fields[6]).toEqual([ 'identifier', 'aBoolean', 'attribute', 'aBoolean', 'type', 'TAG', 'SEPARATOR', ',' ]);
      expect(fields[7]).toEqual([ 'identifier', 'anotherBoolean', 'attribute', 'anotherBoolean', 'type', 'TAG', 'SEPARATOR', ',' ]);
      expect(fields[8]).toEqual([ 'identifier', 'anArray', 'attribute', 'anArray', 'type', 'TAG', 'SEPARATOR', '|' ]);
      expect(fields[9]).toEqual([ 'identifier', 'anotherArray', 'attribute', 'anotherArray', 'type', 'TAG', 'SEPARATOR', '|' ]);
    });

    describe("when the index is dropped", () => {
      beforeEach(async () => {
        await repository.dropIndex();
      });
      
      it("the index no longer exists", () => {
        expect(async () => await fetchIndexInfo(client, 'HashEntity:index'))
          .rejects.toThrow("Unknown Index name");
      });  
    });
  });
});
