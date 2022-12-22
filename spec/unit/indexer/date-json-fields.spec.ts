import { Schema, SchemaDefinition, DataStructure } from '$lib/schema'
import { buildRediSearchSchema } from '$lib/indexer'


describe("#buildRediSearchSchema", () => {
  describe.each([

    ["that defines an unconfigured date for a JSON", {
      schemaDef: { aField: { type: 'date' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.aField': { AS: 'aField', type: 'NUMERIC' } }
    }],

    ["that defines an aliased date for a JSON", {
      schemaDef: { aField: { type: 'date', alias: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.anotherField': { AS: 'aField', type: 'NUMERIC' } }
    }],

    ["that defines an pathed date for a JSON", {
      schemaDef: { aField: { type: 'date', path: '$.anotherField' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.anotherField': { AS: 'aField', type: 'NUMERIC' } }
    }],

    ["that defines a sorted date for a JSON", {
      schemaDef: { aField: { type: 'date', sortable: true } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.aField': { AS: 'aField', type: 'NUMERIC', SORTABLE: true } }
    }],

    ["that defines an unsorted date for a JSON", {
      schemaDef: { aField: { type: 'date', sortable: false } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.aField': { AS: 'aField', type: 'NUMERIC' } }
    }],

    ["that defines an indexed date for a JSON", {
      schemaDef: { aField: { type: 'date', indexed: true } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.aField': { AS: 'aField', type: 'NUMERIC' } }
    }],

    ["that defines an indexed date for a JSON", {
      schemaDef: { aField: { type: 'date', indexed: false } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.aField': { AS: 'aField', type: 'NUMERIC', NOINDEX: true } }
    }],

    ["that defines a fully configured date for a JSON", {
      schemaDef: { aField: { type: 'date', alias: 'ignoredField', path: '$.anotherField', sortable: true, indexed: false } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.anotherField': { AS: 'aField', type: 'NUMERIC', SORTABLE: true, NOINDEX: true } }
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
