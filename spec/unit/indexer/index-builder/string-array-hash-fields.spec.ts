import { Schema, SchemaDefinition, DataStructure } from '$lib/schema'
import { buildRediSearchIndex } from '$lib/indexer'


describe("Schema", () => {
  describe.each([

    ["that defines an unconfigured array for a HASH", {
      schemaDef: { aField: { type: 'string[]' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: ['aField', 'TAG', 'SEPARATOR', '|']
    }],

    ["that defines an aliased array for a HASH", {
      schemaDef: { aField: { type: 'string[]', alias: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: ['anotherField', 'TAG', 'SEPARATOR', '|']
    }],

    ["that defines a separated array for a HASH", {
      schemaDef: { aField: { type: 'string[]', separator: '' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: ['aField', 'TAG', 'SEPARATOR', '']
    }],

    ["that defines an indexed array for a HASH", {
      schemaDef: { aField: { type: 'string[]', indexed: true } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: ['aField', 'TAG', 'SEPARATOR', '|']
    }],

    ["that defines an unindexed array for a HASH", {
      schemaDef: { aField: { type: 'string[]', indexed: false } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: ['aField', 'TAG', 'SEPARATOR', '|', 'NOINDEX']
    }],

    ["that defines a fully-configured array for a HASH", {
      schemaDef: { aField: { type: 'string[]', alias: 'anotherField', separator: '', indexed: false } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: ['anotherField', 'TAG', 'SEPARATOR', '', 'NOINDEX']
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
