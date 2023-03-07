import { Schema, SchemaDefinition, DataStructure } from '$lib/schema'
import { buildRediSearchSchema } from '$lib/indexer'


describe("#buildRediSearchSchema", () => {
  describe.each([

    ["that defines an unconfigured string for a HASH", {
      schemaDef: { aField: { type: 'string' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { aField: { type: 'TAG', AS: 'aField', SEPARATOR: '|' } }
    }],

    ["that defines an aliased string for a HASH", {
      schemaDef: { aField: { type: 'string', alias: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { anotherField: { type: 'TAG', AS: 'aField', SEPARATOR: '|' } }
    }],

    ["that defines a fielded string for a HASH", {
      schemaDef: { aField: { type: 'string', field: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { anotherField: { type: 'TAG', AS: 'aField', SEPARATOR: '|' } }
    }],

    ["that defines an unsorted string for a HASH", {
      schemaDef: { aField: { type: 'string', sortable: false } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { aField: { type: 'TAG', AS: 'aField', SEPARATOR: '|' } }
    }],

    ["that defines a sorted string for a HASH", {
      schemaDef: { aField: { type: 'string', sortable: true } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { aField: { type: 'TAG', AS: 'aField', SEPARATOR: '|', SORTABLE: true } }
    }],

    ["that defines a separated string for a HASH", {
      schemaDef: { aField: { type: 'string', separator: ',' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { aField: { type: 'TAG', AS: 'aField', SEPARATOR: ',' } }
    }],

    ["that defines an indexed string for a HASH", {
      schemaDef: { aField: { type: 'string', indexed: true } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { aField: { type: 'TAG', AS: 'aField', SEPARATOR: '|' } }
    }],

    ["that defines an unindexed string for a HASH", {
      schemaDef: { aField: { type: 'string', indexed: false } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { aField: { type: 'TAG', AS: 'aField', SEPARATOR: '|', NOINDEX: true } }
    }],

    ["that defines a caseSensitive string for a HASH", {
      schemaDef: { aField: { type: 'string', caseSensitive: true } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { aField: { type: 'TAG', AS: 'aField', SEPARATOR: '|', CASESENSITIVE: true } }
    }],

    ["that defines a fully configured string for a HASH", {
      schemaDef: { aField: { type: 'string', alias: 'ignoredField', field: 'anotherField', sortable: true, separator: ',', indexed: false, caseSensitive: true } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { anotherField: { type: 'TAG', AS: 'aField', SEPARATOR: ',', SORTABLE: true, NOINDEX: true, CASESENSITIVE: true } }
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
