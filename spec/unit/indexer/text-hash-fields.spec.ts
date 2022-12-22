import { Schema, SchemaDefinition, DataStructure } from '$lib/schema'
import { buildRediSearchSchema } from '$lib/indexer'


describe("#buildRediSearchSchema", () => {
  describe.each([

    ["that defines an unconfigured text for a HASH", {
      schemaDef: { aField: { type: 'text' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { aField: { AS: 'aField', type: 'TEXT' } }
    }],

    ["that defines an aliased text for a HASH", {
      schemaDef: { aField: { type: 'text', alias: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { anotherField: { AS: 'aField', type: 'TEXT' } }
    }],

    ["that defines a fielded text for a HASH", {
      schemaDef: { aField: { type: 'text', field: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { anotherField: { AS: 'aField', type: 'TEXT' } }
    }],

    ["that defines a sorted text for a HASH", {
      schemaDef: { aField: { type: 'text', sortable: true } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { aField: { AS: 'aField', type: 'TEXT', SORTABLE: true } }
    }],

    ["that defines an unsorted text for a HASH", {
      schemaDef: { aField: { type: 'text', sortable: false } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { aField: { AS: 'aField', type: 'TEXT' } }
    }],

    ["that defines an indexed text for a HASH", {
      schemaDef: { aField: { type: 'text', indexed: true } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { aField: { AS: 'aField', type: 'TEXT' } }
    }],

    ["that defines an unindexed text for a HASH", {
      schemaDef: { aField: { type: 'text', indexed: false } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { aField: { AS: 'aField', type: 'TEXT', NOINDEX: true } }
    }],

    ["that defines a phonetic matcher text for a HASH", {
      schemaDef: { aField: { type: 'text', matcher: 'dm:en' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { aField: { AS: 'aField', type: 'TEXT', PHONETIC: 'dm:en' } }
    }],

    ["that defines an unstemmed text for a HASH", {
      schemaDef: { aField: { type: 'text', stemming: false } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { aField: { AS: 'aField', type: 'TEXT', NOSTEM: true } }
    }],

    ["that defines an unnormalized text for a HASH", {
      schemaDef: { aField: { type: 'text', normalized: false } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { aField: { AS: 'aField', type: 'TEXT', SORTABLE: 'UNF' } }
    }],

    ["that defines a weighted text for a HASH", {
      schemaDef: { aField: { type: 'text', weight: 2 } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { aField: { AS: 'aField', type: 'TEXT', WEIGHT: 2 } }
    }],

    ["that defines a fully configured text for a HASH", {
      schemaDef: { aField: { type: 'text', alias: 'ignoredField', field: 'anotherField', sortable: true, indexed: false, matcher: 'dm:en', stemming: false, normalized: false, weight: 2 } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: { anotherField: { AS: 'aField', type: 'TEXT', SORTABLE: 'UNF', NOINDEX: true, PHONETIC: 'dm:en', NOSTEM: true, WEIGHT: 2 } }
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
