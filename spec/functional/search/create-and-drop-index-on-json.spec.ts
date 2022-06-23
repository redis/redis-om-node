import Client from '../../../lib/client';
import Schema from '../../../lib/schema/schema';
import Repository from '../../../lib/repository/repository';

import { createJsonEntitySchema, createChangedJsonEntitySchema, SampleJsonEntity } from '../helpers/data-helper';
import { fetchIndexHash, fetchIndexInfo, flushAll } from '../helpers/redis-helper';

describe("create and drop index on JSON", () => {

  let client: Client;
  let repository: Repository<SampleJsonEntity>;
  let schema: Schema<SampleJsonEntity>;
  let indexInfo: Array<string>;
  let indexHash: string;

  beforeAll(async () => {
    client = new Client();
    await client.open();

    schema = createJsonEntitySchema();
    repository = client.fetchRepository<SampleJsonEntity>(schema);
  });

  afterAll(async () => await client.close());

  describe("when the index is created", () => {
    beforeEach(async () => {
      await flushAll(client);
      await repository.createIndex();
      indexInfo = await fetchIndexInfo(client, 'SampleJsonEntity:index');
      indexHash = await fetchIndexHash(client, 'SampleJsonEntity:index:hash');
    });

    it("has the expected name", () => {
      let indexName = indexInfo[1];
      expect(indexName).toBe('SampleJsonEntity:index');
    });

    it("has the expected key type", () => {
      let keyType = indexInfo[5][1];
      expect(keyType).toBe('JSON');
    });

    it("has the expected prefixes", () => {
      let prefixes = indexInfo[5][3];
      expect(prefixes).toEqual(['SampleJsonEntity:']);
    });

    it("has the expected hash", () => {
      expect(indexHash).toBe("XgD0DXohHu8y4/JvvbEWhZCoiWk=");
    });

    it("has the expected fields", () => {
      let fields = indexInfo[7];
      expect(fields).toHaveLength(14);
      expect(fields).toEqual([
        ['identifier', '$.aString', 'attribute', 'aString', 'type', 'TAG', 'SEPARATOR', '|'],
        ['identifier', '$.anotherString', 'attribute', 'anotherString', 'type', 'TAG', 'SEPARATOR', '|'],
        ['identifier', '$.someText', 'attribute', 'someText', 'type', 'TEXT', 'WEIGHT', '1', 'SORTABLE'],
        ['identifier', '$.someOtherText', 'attribute', 'someOtherText', 'type', 'TEXT', 'WEIGHT', '1', 'SORTABLE'],
        ['identifier', '$.aNumber', 'attribute', 'aNumber', 'type', 'NUMERIC', 'SORTABLE'],
        ['identifier', '$.anotherNumber', 'attribute', 'anotherNumber', 'type', 'NUMERIC', 'SORTABLE'],
        ['identifier', '$.aBoolean', 'attribute', 'aBoolean', 'type', 'TAG', 'SEPARATOR', ''],
        ['identifier', '$.anotherBoolean', 'attribute', 'anotherBoolean', 'type', 'TAG', 'SEPARATOR', ''],
        ['identifier', '$.aPoint', 'attribute', 'aPoint', 'type', 'GEO'],
        ['identifier', '$.anotherPoint', 'attribute', 'anotherPoint', 'type', 'GEO'],
        ['identifier', '$.aDate', 'attribute', 'aDate', 'type', 'NUMERIC', 'SORTABLE'],
        ['identifier', '$.anotherDate', 'attribute', 'anotherDate', 'type', 'NUMERIC', 'SORTABLE'],
        ['identifier', '$.someStrings[*]', 'attribute', 'someStrings', 'type', 'TAG', 'SEPARATOR', '|'],
        ['identifier', '$.someOtherStrings[*]', 'attribute', 'someOtherStrings', 'type', 'TAG', 'SEPARATOR', '|']
      ]);
    });

    describe("when the index is dropped", () => {
      beforeEach(async () => await repository.dropIndex());

      it("the index no longer exists", () => {
        expect(async () => await fetchIndexInfo(client, 'SampleJsonEntity:index'))
          .rejects.toThrow("Unknown Index name");
      });

      it("the index hash no longer exists", async () => {
        let hash = await fetchIndexHash(client, 'SampleJsonEntity:index:hash');
        expect(hash).toBeNull();
      });
    });

    describe("and then the index is recreated but not changed", () => {
      beforeEach(async () => {
        await repository.createIndex();
        indexInfo = await fetchIndexInfo(client, 'SampleJsonEntity:index');
        indexHash = await fetchIndexHash(client, 'SampleJsonEntity:index:hash');
      });

      it("still has the expected attributes", () => {
        let indexName = indexInfo[1];
        let keyType = indexInfo[5][1];
        let prefixes = indexInfo[5][3];
        let fields = indexInfo[7];

        expect(indexName).toBe('SampleJsonEntity:index');
        expect(keyType).toBe('JSON');
        expect(prefixes).toEqual(['SampleJsonEntity:']);
        expect(indexHash).toBe("XgD0DXohHu8y4/JvvbEWhZCoiWk=");

        expect(fields).toHaveLength(14);
        expect(fields).toEqual([
          ['identifier', '$.aString', 'attribute', 'aString', 'type', 'TAG', 'SEPARATOR', '|'],
          ['identifier', '$.anotherString', 'attribute', 'anotherString', 'type', 'TAG', 'SEPARATOR', '|'],
          ['identifier', '$.someText', 'attribute', 'someText', 'type', 'TEXT', 'WEIGHT', '1', 'SORTABLE'],
          ['identifier', '$.someOtherText', 'attribute', 'someOtherText', 'type', 'TEXT', 'WEIGHT', '1', 'SORTABLE'],
          ['identifier', '$.aNumber', 'attribute', 'aNumber', 'type', 'NUMERIC', 'SORTABLE'],
          ['identifier', '$.anotherNumber', 'attribute', 'anotherNumber', 'type', 'NUMERIC', 'SORTABLE'],
          ['identifier', '$.aBoolean', 'attribute', 'aBoolean', 'type', 'TAG', 'SEPARATOR', ''],
          ['identifier', '$.anotherBoolean', 'attribute', 'anotherBoolean', 'type', 'TAG', 'SEPARATOR', ''],
          ['identifier', '$.aPoint', 'attribute', 'aPoint', 'type', 'GEO'],
          ['identifier', '$.anotherPoint', 'attribute', 'anotherPoint', 'type', 'GEO'],
          ['identifier', '$.aDate', 'attribute', 'aDate', 'type', 'NUMERIC', 'SORTABLE'],
          ['identifier', '$.anotherDate', 'attribute', 'anotherDate', 'type', 'NUMERIC', 'SORTABLE'],
          ['identifier', '$.someStrings[*]', 'attribute', 'someStrings', 'type', 'TAG', 'SEPARATOR', '|'],
          ['identifier', '$.someOtherStrings[*]', 'attribute', 'someOtherStrings', 'type', 'TAG', 'SEPARATOR', '|']
        ]);
      });
    });

    describe("and then the index is changed", () => {
      beforeEach(async () => {
        schema = createChangedJsonEntitySchema();
        repository = client.fetchRepository<SampleJsonEntity>(schema);

        await repository.createIndex();
        indexInfo = await fetchIndexInfo(client, 'sample-json-entity:index');
        indexHash = await fetchIndexHash(client, 'sample-json-entity:index:hash');
      });

      it("has new attributes", () => {
        let indexName = indexInfo[1];
        let keyType = indexInfo[5][1];
        let prefixes = indexInfo[5][3];

        expect(indexName).toBe('sample-json-entity:index');
        expect(keyType).toBe('JSON');
        expect(prefixes).toEqual(['sample-json-entity:']);
        expect(indexHash).toBe("Tm5jE5zHI3uyJd4HFJiMwPBPquo=");
      });
    });
  });
});
