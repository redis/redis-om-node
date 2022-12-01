import { Schema } from '$lib/schema/schema';
import { SchemaDefinition } from '$lib/schema/definition';
import { DataStructure } from '$lib/schema/options';
import { buildRediSearchIndex } from '$lib/indexer/index-builder';

describe("#buildRediSearchIndex", () => {
  describe.each([

    ["that is given an empty schema for a HASH", {
      schemaDef: {} as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: []
    }],

    ["that is given an empty schema for JSON", {
      schemaDef: {} as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: []
    }],

    ["that is given a well populated schema for a HASH", {
      schemaDef: {
        aString: { type: 'string' }, anotherString: { type: 'string' },
        someText: { type: 'text' }, someOtherText: { type: 'text' },
        aNumber: { type: 'number' }, anotherNumber: { type: 'number' },
        aBoolean: { type: 'boolean' }, anotherBoolean: { type: 'boolean' },
        aPoint: { type: 'point' }, anotherPoint: { type: 'point' },
        aDate: { type: 'date' }, anotherDate: { type: 'date' },
        someStrings: { type: 'string[]' }, someOtherStrings: { type: 'string[]' }
      } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: [
        'aString', 'TAG', 'SEPARATOR', '|',
        'anotherString', 'TAG', 'SEPARATOR', '|',
        'someText', 'TEXT',
        'someOtherText', 'TEXT',
        'aNumber', 'NUMERIC',
        'anotherNumber', 'NUMERIC',
        'aBoolean', 'TAG',
        'anotherBoolean', 'TAG',
        'aPoint', 'GEO',
        'anotherPoint', 'GEO',
        'aDate', 'NUMERIC',
        'anotherDate', 'NUMERIC',
        'someStrings', 'TAG', 'SEPARATOR', '|',
        'someOtherStrings', 'TAG', 'SEPARATOR', '|'
      ]
    }],

    ["that is given a well populated schema for a JSON", {
      schemaDef: {
        aString: { type: 'string' }, anotherString: { type: 'string' },
        someText: { type: 'text' }, someOtherText: { type: 'text' },
        aNumber: { type: 'number' }, anotherNumber: { type: 'number' },
        aBoolean: { type: 'boolean' }, anotherBoolean: { type: 'boolean' },
        aPoint: { type: 'point' }, anotherPoint: { type: 'point' },
        aDate: { type: 'date' }, anotherDate: { type: 'date' },
        someStrings: { type: 'string[]' }, someOtherStrings: { type: 'string[]' }
      } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: [
        '$.aString', 'AS', 'aString', 'TAG', 'SEPARATOR', '|',
        '$.anotherString', 'AS', 'anotherString', 'TAG', 'SEPARATOR', '|',
        '$.someText', 'AS', 'someText', 'TEXT',
        '$.someOtherText', 'AS', 'someOtherText', 'TEXT',
        '$.aNumber', 'AS', 'aNumber', 'NUMERIC',
        '$.anotherNumber', 'AS', 'anotherNumber', 'NUMERIC',
        '$.aBoolean', 'AS', 'aBoolean', 'TAG',
        '$.anotherBoolean', 'AS', 'anotherBoolean', 'TAG',
        '$.aPoint', 'AS', 'aPoint', 'GEO',
        '$.anotherPoint', 'AS', 'anotherPoint', 'GEO',
        '$.aDate', 'AS', 'aDate', 'NUMERIC',
        '$.anotherDate', 'AS', 'anotherDate', 'NUMERIC',
        '$.someStrings[*]', 'AS', 'someStrings', 'TAG', 'SEPARATOR', '|',
        '$.someOtherStrings[*]', 'AS', 'someOtherStrings', 'TAG', 'SEPARATOR', '|'
      ]
    }]

  ])("%s", (_, data) => {
    it("generates a Redis schema for the field", () => {
      let schemaDef = data.schemaDef;
      let dataStructure = data.dataStructure as DataStructure;
      let expectedRedisSchema = data.expectedRedisSchema;

      let schema = new Schema('TestEntity', schemaDef, { dataStructure });
      let actual = buildRediSearchIndex(schema);
      expect(actual).toEqual(expectedRedisSchema);
    });
  });
});
