import { Schema, SchemaDefinition, DataStructure } from '$lib/schema'
import { buildRediSearchSchema } from '$lib/indexer'


describe("#buildRediSearchSchema", () => {
  describe.each([

    ["that defines an unconfigured point for a JSON", {
      schemaDef: { aField: { type: 'point' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.aField': { AS: 'aField', type: 'GEO' } }
    }],

    ["that defines an aliased point for a JSON", {
      schemaDef: { aField: { type: 'point', alias: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.anotherField': { AS: 'aField', type: 'GEO' } }
    }],

    ["that defines a pathed point for a JSON", {
      schemaDef: { aField: { type: 'point', path: '$.anotherField' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.anotherField': { AS: 'aField', type: 'GEO' } }
    }],

    ["that defines an indexed point for a JSON", {
      schemaDef: { aField: { type: 'point', indexed: true } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.aField': { AS: 'aField', type: 'GEO' } }
    }],

    ["that defines an unindexed point for a JSON", {
      schemaDef: { aField: { type: 'point', indexed: false } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.aField': { AS: 'aField', type: 'GEO', NOINDEX: true } }
    }],

    ["that defines a fully-configured point for a JSON", {
      schemaDef: { aField: { type: 'point', alias: 'ignoredField', path: '$.anotherField', indexed: false } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.anotherField': { AS: 'aField', type: 'GEO', NOINDEX: true } }
    }]


  ])("%s", (_, data) => {
    it("generates a Redis schema for the field", () => {
      let schemaDef = data.schemaDef
      let dataStructure = data.dataStructure as DataStructure
      let expectedRedisSchema = data.expectedRedisSchema

      let schema = new Schema('TestEntity', schemaDef, { dataStructure })
      let actual = buildRediSearchSchema(schema)
      expect(actual).toEqual(expectedRedisSchema)
    })
  })
})
