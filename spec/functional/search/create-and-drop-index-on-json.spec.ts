import Client from '../../../lib/client';
import Schema from '../../../lib/schema/schema';
import Repository from '../../../lib/repository/repository';

import { createJsonEntitySchema, SampleJsonEntity } from '../helpers/data-helper';
import { fetchIndexInfo, flushAll  } from '../helpers/redis-helper';

describe("create and drop index on JSON", () => {

  let client: Client;
  let repository: Repository<SampleJsonEntity>;
  let schema: Schema<SampleJsonEntity>;
  let result: string[];

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
      result = await fetchIndexInfo(client, 'SampleJsonEntity:index');
    });

    it("has the expected name", () => {
      let indexName = result[1];
      expect(indexName).toBe('SampleJsonEntity:index');
    });

    it("has the expected key type", () => {
      let keyType = result[5][1];
      expect(keyType).toBe('JSON');
    });

    it("has the expected prefixes", () => {
      let prefixes = result[5][3];
      expect(prefixes).toEqual([ 'SampleJsonEntity:' ]);
    });

    it("has the expected fields", () => {
      let fields = result[7];
      expect(fields).toHaveLength(14);
      expect(fields).toEqual([
        [ 'identifier', '$.aString', 'attribute', 'aString', 'type', 'TAG', 'SEPARATOR', '|' ],
        [ 'identifier', '$.anotherString', 'attribute', 'anotherString', 'type', 'TAG', 'SEPARATOR', '|' ],
        [ 'identifier', '$.someText', 'attribute', 'someText', 'type', 'TEXT', 'WEIGHT', '1' ],
        [ 'identifier', '$.someOtherText', 'attribute', 'someOtherText', 'type', 'TEXT', 'WEIGHT', '1' ],
        [ 'identifier', '$.aNumber', 'attribute', 'aNumber', 'type', 'NUMERIC' ],
        [ 'identifier', '$.anotherNumber', 'attribute', 'anotherNumber', 'type', 'NUMERIC' ],
        [ 'identifier', '$.aBoolean', 'attribute', 'aBoolean', 'type', 'TAG', 'SEPARATOR', '' ],
        [ 'identifier', '$.anotherBoolean', 'attribute', 'anotherBoolean', 'type', 'TAG', 'SEPARATOR', '' ],
        [ 'identifier', '$.aPoint', 'attribute', 'aPoint', 'type', 'GEO' ],
        [ 'identifier', '$.anotherPoint', 'attribute', 'anotherPoint', 'type', 'GEO' ],
        [ 'identifier', '$.aDate', 'attribute', 'aDate', 'type', 'NUMERIC' ],
        [ 'identifier', '$.anotherDate', 'attribute', 'anotherDate', 'type', 'NUMERIC' ],
        [ 'identifier', '$.someStrings[*]', 'attribute', 'someStrings', 'type', 'TAG', 'SEPARATOR', '' ],
        [ 'identifier', '$.someOtherStrings[*]', 'attribute', 'someOtherStrings', 'type', 'TAG', 'SEPARATOR', '' ]
      ]);
    });

    describe("when the index is dropped", () => {
      beforeEach(async () => {
        await repository.dropIndex();
      });

      it("the index no longer exists", () => {
        expect(async () => await fetchIndexInfo(client, 'SampleJsonEntity:index'))
          .rejects.toThrow("Unknown Index name");
      });
    });
  });
});
