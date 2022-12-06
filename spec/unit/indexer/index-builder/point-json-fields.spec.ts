import { Schema, SchemaDefinition, DataStructure } from '$lib/schema'
import { buildRediSearchIndex } from '$lib/indexer'


describe("Schema", () => {
  describe.each([

    ["that defines an unconfigured point for a JSON", {
      schemaDef: { aField: { type: 'point' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'GEO']
    }],

    ["that defines an indexed point for a JSON", {
      schemaDef: { aField: { type: 'point', indexed: true } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'GEO']
    }],

    ["that defines an unindexed point for a JSON", {
      schemaDef: { aField: { type: 'point', indexed: false } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'GEO', 'NOINDEX']
    }],

    ["that defines a fully-configured point for a JSON", {
      schemaDef: { aField: { type: 'point', indexed: false } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'GEO', 'NOINDEX']
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
