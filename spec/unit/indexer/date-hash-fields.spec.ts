import { Schema, SchemaDefinition, DataStructure } from '$lib/schema'
import { buildRediSearchSchema } from '$lib/indexer'


describe("#buildRediSearchSchema", () => {
  describe.each([

    ["that defines an unconfigured date for a HASH", {
      schemaDef: { aField: { type: 'date' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { aField: { type: 'NUMERIC', AS: 'aField' } }
    }],

    ["that defines an aliased date for a HASH", {
      schemaDef: { aField: { type: 'date', alias: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { anotherField: { type: 'NUMERIC', AS: 'aField' } }
    }],

    ["that defines a fielded date for a HASH", {
      schemaDef: { aField: { type: 'date', field: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { anotherField: { type: 'NUMERIC', AS: 'aField' } }
    }],

    ["that defines a sorted date for a HASH", {
      schemaDef: { aField: { type: 'date', sortable: true } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { aField: { type: 'NUMERIC', AS: 'aField', SORTABLE: true } }
    }],

    ["that defines an unsorted date for a HASH", {
      schemaDef: { aField: { type: 'date', sortable: false } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { aField: { type: 'NUMERIC', AS: 'aField' } }
    }],

    ["that defines an indexed date for a HASH", {
      schemaDef: { aField: { type: 'date', indexed: true } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { aField: { type: 'NUMERIC', AS: 'aField' } }
    }],

    ["that defines an unindexed date for a HASH", {
      schemaDef: { aField: { type: 'date', indexed: false } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { aField: { type: 'NUMERIC', AS: 'aField', NOINDEX: true } }
    }],

    ["that defines a fully configured date for a HASH", {
      schemaDef: { aField: { type: 'date', alias: 'ignoredField', field: 'anotherField', sortable: true, indexed: false } } as SchemaDefinition,
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
