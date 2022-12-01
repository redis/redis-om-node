import { Schema } from '$lib/schema/schema';
import { SchemaDefinition } from '$lib/schema/definition';
import { DataStructure } from '$lib/schema/options';
import { buildRediSearchIndex } from '$lib/indexer/index-builder';

describe("Schema", () => {
  describe.each([

    ["that defines an unconfigured string for a HASH", {
      schemaDef: { aField: { type: 'string' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: ['aField', 'TAG', 'SEPARATOR', '|']
    }],

    ["that defines an aliased string for a HASH", {
      schemaDef: { aField: { type: 'string', alias: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: ['anotherField', 'TAG', 'SEPARATOR', '|']
    }],

    ["that defines an unsorted string for a HASH", {
      schemaDef: { aField: { type: 'string', sortable: false } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: ['aField', 'TAG', 'SEPARATOR', '|']
    }],

    ["that defines a sorted string for a HASH", {
      schemaDef: { aField: { type: 'string', sortable: true } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: ['aField', 'TAG', 'SEPARATOR', '|', 'SORTABLE']
    }],

    ["that defines a separated string for a HASH", {
      schemaDef: { aField: { type: 'string', separator: ';' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: ['aField', 'TAG', 'SEPARATOR', ';']
    }],

    ["that defines an indexed string for a HASH", {
      schemaDef: { aField: { type: 'string', indexed: true } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: ['aField', 'TAG', 'SEPARATOR', '|']
    }],

    ["that defines an unindexed string for a HASH", {
      schemaDef: { aField: { type: 'string', indexed: false } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: ['aField', 'TAG', 'SEPARATOR', '|', 'NOINDEX']
    }],

    ["that defines a caseSensitive string for a HASH", {
      schemaDef: { aField: { type: 'string', caseSensitive: true } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: ['aField', 'TAG', 'CASESENSITIVE', 'SEPARATOR', '|']
    }],

    ["that defines a fully configured string for a HASH", {
      schemaDef: { aField: { type: 'string', alias: 'anotherField', sortable: true, separator: ';', indexed: false } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: ['anotherField', 'TAG', 'SEPARATOR', ';', 'SORTABLE', 'NOINDEX']
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
