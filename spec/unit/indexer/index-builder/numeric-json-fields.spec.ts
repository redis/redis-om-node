import { Schema, SchemaDefinition, DataStructure } from '$lib/schema'
import { buildRediSearchIndex } from '$lib/indexer'


describe("Schema", () => {
  describe.each([

    ["that defines an unconfigured number for a JSON", {
      schemaDef: { aField: { type: 'number' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'NUMERIC']
    }],

    ["that defines a sorted number for a JSON", {
      schemaDef: { aField: { type: 'number', sortable: true } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'NUMERIC', 'SORTABLE']
    }],

    ["that defines an unsorted number for a JSON", {
      schemaDef: { aField: { type: 'number', sortable: false } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'NUMERIC']
    }],

    ["that defines an indexed number for a JSON", {
      schemaDef: { aField: { type: 'number', indexed: true } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'NUMERIC']
    }],

    ["that defines an unindexed number for a JSON", {
      schemaDef: { aField: { type: 'number', indexed: false } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'NUMERIC', 'NOINDEX']
    }],

    ["that defines a fully-configured number for a JSON", {
      schemaDef: { aField: { type: 'number', sortable: true, indexed: false } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'NUMERIC', 'SORTABLE', 'NOINDEX']
    }]

  ])("%s", (_, data) => {
    it("generates a Redis schema for the field", () => {
      let schemaDef = data.schemaDef
      let dataStructure = data.dataStructure as DataStructure
      let expectedRedisSchema = data.expectedRedisSchema

      let schema = new Schema('TestEntity', schemaDef, { dataStructure })
      let actual = buildRediSearchIndex(schema)
      expect(actual).toEqual(expectedRedisSchema)
    })
  })
})
