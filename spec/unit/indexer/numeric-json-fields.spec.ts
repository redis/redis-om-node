import { Schema, SchemaDefinition, DataStructure } from '$lib/schema'
import { buildRediSearchSchema } from '$lib/indexer'


describe("#buildRediSearchSchema", () => {
  describe.each([

    ["that defines an unconfigured number for a JSON", {
      schemaDef: { aField: { type: 'number' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.aField' : { AS: 'aField', type: 'NUMERIC' } }
    }],

    ["that defines an aliased number for a JSON", {
      schemaDef: { aField: { type: 'number', alias: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.anotherField' : { AS: 'aField', type: 'NUMERIC' } }
    }],

    ["that defines an pathed number for a JSON", {
      schemaDef: { aField: { type: 'number', path: '$.anotherField' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.anotherField' : { AS: 'aField', type: 'NUMERIC' } }
    }],

    ["that defines a sorted number for a JSON", {
      schemaDef: { aField: { type: 'number', sortable: true } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.aField' : { AS: 'aField', type: 'NUMERIC', SORTABLE: true } }
    }],

    ["that defines an unsorted number for a JSON", {
      schemaDef: { aField: { type: 'number', sortable: false } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.aField' : { AS: 'aField', type: 'NUMERIC' } }
    }],

    ["that defines an indexed number for a JSON", {
      schemaDef: { aField: { type: 'number', indexed: true } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.aField' : { AS: 'aField', type: 'NUMERIC' } }
    }],

    ["that defines an unindexed number for a JSON", {
      schemaDef: { aField: { type: 'number', indexed: false } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.aField' : { AS: 'aField', type: 'NUMERIC', NOINDEX: true } }
    }],

    ["that defines a fully-configured number for a JSON", {
      schemaDef: { aField: { type: 'number', alias: 'ignoredField', path: '$.anotherField', sortable: true, indexed: false } } as SchemaDefinition,
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
