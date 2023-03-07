import { Schema, SchemaDefinition, DataStructure } from '$lib/schema'
import { buildRediSearchSchema } from '$lib/indexer'


describe("#buildRediSearchSchema", () => {
  describe.each([

    ["that defines an unconfigured point for a HASH", {
      schemaDef: { aField: { type: 'point' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { aField: { type: 'GEO', AS: 'aField' } }
    }],

    ["that defines an aliased point for a HASH", {
      schemaDef: { aField: { type: 'point', alias: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { anotherField: { type: 'GEO', AS: 'aField' } }
    }],

    ["that defines a fielded point for a HASH", {
      schemaDef: { aField: { type: 'point', field: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { anotherField: { type: 'GEO', AS: 'aField' } }
    }],

    ["that defines an indexed point for a HASH", {
      schemaDef: { aField: { type: 'point', indexed: true } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { aField: { type: 'GEO', AS: 'aField' } }
    }],

    ["that defines an unindexed point for a HASH", {
      schemaDef: { aField: { type: 'point', indexed: false } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { aField: { type: 'GEO', AS: 'aField', NOINDEX: true } }
    }],

    ["that defines a fully-configured point for a HASH", {
      schemaDef: { aField: { type: 'point', alias: 'ignoredField', field: 'anotherField', indexed: false } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { anotherField: { type: 'GEO', AS: 'aField', NOINDEX: true } }
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
