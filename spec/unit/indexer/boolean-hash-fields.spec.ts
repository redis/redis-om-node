import { Schema, SchemaDefinition, DataStructure } from '$lib/schema'
import { buildRediSearchSchema } from '$lib/indexer'


describe("#buildRediSearchSchema", () => {
  describe.each([

    ["that defines an unconfigured boolean for a HASH", {
      schemaDef: { aField: { type: 'boolean' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { aField: { type: 'TAG', AS: 'aField' } }
    }],

    ["that defines an aliased boolean for a HASH", {
      schemaDef: { aField: { type: 'boolean', alias: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { anotherField: { type: 'TAG', AS: 'aField' } }
    }],

    ["that defines a fielded boolean for a HASH", {
      schemaDef: { aField: { type: 'boolean', field: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { anotherField: { type: 'TAG', AS: 'aField' } }
    }],

    ["that defines a sorted boolean for a HASH", {
      schemaDef: { aField: { type: 'boolean', sortable: true } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { aField: { type: 'TAG', AS: 'aField', SORTABLE: true } }
    }],

    ["that defines an unsorted boolean for a HASH", {
      schemaDef: { aField: { type: 'boolean', sortable: false } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { aField: { type: 'TAG', AS: 'aField' } }
    }],

    ["that defines an indexed boolean for a HASH", {
      schemaDef: { aField: { type: 'boolean', indexed: true } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { aField: { type: 'TAG', AS: 'aField' } }
    }],

    ["that defines an unindexed boolean for a HASH", {
      schemaDef: { aField: { type: 'boolean', indexed: false } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { aField: { type: 'TAG', AS: 'aField', NOINDEX: true } }
    }],

    ["that defines a fully configured boolean for a HASH", {
      schemaDef: { aField: { type: 'boolean', alias: 'ignoredField', field: 'anotherField', sortable: true, indexed: false } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { anotherField: { type: 'TAG', AS: 'aField', SORTABLE: true, NOINDEX: true } }
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
