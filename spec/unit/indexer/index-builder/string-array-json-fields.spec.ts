import { Schema } from '$lib/schema/schema'
import { SchemaDefinition } from '$lib/schema/definition'
import { DataStructure } from '$lib/schema/options'
import { buildRediSearchIndex } from '$lib/indexer/index-builder'

describe("Schema", () => {
  describe.each([

    ["that defines an unconfigured array for a JSON", {
      schemaDef: { aField: { type: 'string[]' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField[*]', 'AS', 'aField', 'TAG', 'SEPARATOR', '|']
    }],

    ["that defines an indexed array for a JSON", {
      schemaDef: { aField: { type: 'string[]', indexed: true } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField[*]', 'AS', 'aField', 'TAG', 'SEPARATOR', '|']
    }],

    ["that defines an unindexed array for a JSON", {
      schemaDef: { aField: { type: 'string[]', indexed: false } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField[*]', 'AS', 'aField', 'TAG', 'SEPARATOR', '|', 'NOINDEX']
    }],

    ["that defines a fully-configured array for a JSON", {
      schemaDef: { aField: { type: 'string[]', indexed: false } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField[*]', 'AS', 'aField', 'TAG', 'SEPARATOR', '|', 'NOINDEX']
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
