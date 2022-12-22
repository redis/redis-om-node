import { Schema, SchemaDefinition, DataStructure } from '$lib/schema'
import { buildRediSearchSchema } from '$lib/indexer'


describe("#buildRediSearchSchema", () => {
  describe.each([

    ["that defines an unconfigured array for a JSON", {
      schemaDef: { aField: { type: 'string[]' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.aField[*]': { AS: 'aField', type: 'TAG', SEPARATOR: '|' } }
    }],

    ["that defines an aliased array for a JSON", {
      schemaDef: { aField: { type: 'string[]', alias: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.anotherField[*]': { AS: 'aField', type: 'TAG', SEPARATOR: '|' } }
    }],

    ["that defines a pathed array for a JSON", {
      schemaDef: { aField: { type: 'string[]', path: '$.anotherField[*]' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.anotherField[*]': { AS: 'aField', type: 'TAG', SEPARATOR: '|' } }
    }],

    ["that defines an indexed array for a JSON", {
      schemaDef: { aField: { type: 'string[]', indexed: true } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.aField[*]': { AS: 'aField', type: 'TAG', SEPARATOR: '|' } }
    }],

    ["that defines an unindexed array for a JSON", {
      schemaDef: { aField: { type: 'string[]', indexed: false } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.aField[*]': { AS: 'aField', type: 'TAG', SEPARATOR: '|', NOINDEX: true } }
    }],

    ["that defines a fully-configured array for a JSON", {
      schemaDef: { aField: { type: 'string[]', alias: 'ignoredField', path: '$.anotherField[*]', indexed: false } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.anotherField[*]': { AS: 'aField', type: 'TAG', SEPARATOR: '|', NOINDEX: true } }
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
