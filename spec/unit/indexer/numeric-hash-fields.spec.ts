import { Schema, SchemaDefinition, DataStructure } from '$lib/schema'
import { buildRediSearchSchema } from '$lib/indexer'


describe("#buildRediSearchSchema", () => {
  describe.each([

    ["that defines an unconfigured number for a HASH", {
      schemaDef: { aField: { type: 'number' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { aField: { type: 'NUMERIC', AS: 'aField' } }
    }],

    ["that defines an aliased number for a HASH", {
      schemaDef: { aField: { type: 'number', alias: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { anotherField: { type: 'NUMERIC', AS: 'aField' } }
    }],

    ["that defines a fielded number for a HASH", {
      schemaDef: { aField: { type: 'number', field: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { anotherField: { type: 'NUMERIC', AS: 'aField' } }
    }],

    ["that defines a sorted number for a HASH", {
      schemaDef: { aField: { type: 'number', sortable: true } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { aField: { type: 'NUMERIC', AS: 'aField', SORTABLE: true } }
    }],

    ["that defines an unsorted number for a HASH", {
      schemaDef: { aField: { type: 'number', sortable: false } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { aField: { type: 'NUMERIC', AS: 'aField' } }
    }],

    ["that defines an indexed number for a HASH", {
      schemaDef: { aField: { type: 'number', indexed: true } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { aField: { type: 'NUMERIC', AS: 'aField' } }
    }],

    ["that defines an unindexed number for a HASH", {
      schemaDef: { aField: { type: 'number', indexed: false } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { aField: { type: 'NUMERIC', AS: 'aField', NOINDEX: true } }
    }],

    ["that defines a fully-configured number for a HASH", {
      schemaDef: { aField: { type: 'number', alias: 'ignoredField', field: 'anotherField', sortable: true, indexed: false } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { anotherField: { type: 'NUMERIC', AS: 'aField', SORTABLE: true, NOINDEX: true } }
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
