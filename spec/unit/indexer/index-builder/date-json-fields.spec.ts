import { Schema } from '$lib/schema/schema';
import { SchemaDefinition } from '$lib/schema/definition';
import { DataStructure } from '$lib/schema/options';
import { buildRediSearchIndex } from '$lib/indexer/index-builder';

describe("Schema", () => {
  describe.each([

    ["that defines an unconfigured date for a JSON", {
      schemaDef: { aField: { type: 'date' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'NUMERIC']
    }],

    ["that defines a sorted date for a JSON", {
      schemaDef: { aField: { type: 'date', sortable: true } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'NUMERIC', 'SORTABLE']
    }],

    ["that defines an unsorted date for a JSON", {
      schemaDef: { aField: { type: 'date', sortable: false } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'NUMERIC']
    }],

    ["that defines an indexed date for a JSON", {
      schemaDef: { aField: { type: 'date', indexed: true } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'NUMERIC']
    }],

    ["that defines an indexed date for a JSON", {
      schemaDef: { aField: { type: 'date', indexed: false } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'NUMERIC', 'NOINDEX']
    }],

    ["that defines a fully configured date for a JSON", {
      schemaDef: { aField: { type: 'date', sortable: true, indexed: false } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'NUMERIC', 'SORTABLE', 'NOINDEX']
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
