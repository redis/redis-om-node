import { Schema, SchemaDefinition, DataStructure } from '$lib/schema'
import { buildRediSearchSchema } from '$lib/indexer'


describe("#buildRediSearchSchema", () => {
  describe.each([

    ["that defines an unconfigured array for a HASH", {
      schemaDef: { aField: { type: 'string[]' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { aField: { AS: 'aField', type: 'TAG', SEPARATOR: '|' } }
    }],

    ["that defines an aliased array for a HASH", {
      schemaDef: { aField: { type: 'string[]', alias: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { anotherField: { AS: 'aField', type: 'TAG', SEPARATOR: '|' } }
    }],

    ["that defines a fielded array for a HASH", {
      schemaDef: { aField: { type: 'string[]', alias: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { anotherField: { AS: 'aField', type: 'TAG', SEPARATOR: '|' } }
    }],

    ["that defines a separated array for a HASH", {
      schemaDef: { aField: { type: 'string[]', separator: ',' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { aField: { AS: 'aField', type: 'TAG', SEPARATOR: ',' } }
    }],

    ["that defines an indexed array for a HASH", {
      schemaDef: { aField: { type: 'string[]', indexed: true } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { aField: { AS: 'aField', type: 'TAG', SEPARATOR: '|' } }
    }],

    ["that defines an unindexed array for a HASH", {
      schemaDef: { aField: { type: 'string[]', indexed: false } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { aField: { AS: 'aField', type: 'TAG', SEPARATOR: '|', NOINDEX: true } }
    }],

    ["that defines a fully-configured array for a HASH", {
      schemaDef: { aField: { type: 'string[]', alias: 'ignoredField', field: 'anotherField', separator: ',', indexed: false } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { anotherField: { AS: 'aField', type: 'TAG', SEPARATOR: ',', NOINDEX: true } }
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
