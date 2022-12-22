import { RediSearchSchema } from 'redis'

import { Schema, SchemaDefinition, DataStructure } from '$lib/schema'
import { buildRediSearchSchema } from '$lib/indexer'


const warnSpy = vi.spyOn(global.console, 'warn').mockImplementation(() => {})

describe("#buildRediSearchSchema", () => {
  describe.each([

    ["that defines an unconfigured string for a JSON", {
      schemaDef: { aField: { type: 'string' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.aField': { AS: 'aField', type: 'TAG', SEPARATOR: '|' } },
      expectedWarning: null
    }],

    ["that defines an aliased string for a JSON", {
      schemaDef: { aField: { type: 'string', alias: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.anotherField': { AS: 'aField', type: 'TAG', SEPARATOR: '|' } },
      expectedWarning: null
    }],

    ["that defines a pathed string for a JSON", {
      schemaDef: { aField: { type: 'string', path: '$.anotherField' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.anotherField': { AS: 'aField', type: 'TAG', SEPARATOR: '|' } },
      expectedWarning: null
    }],

    ["that defines an unsorted string for a JSON", {
      schemaDef: { aField: { type: 'string', sortable: false } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.aField': { AS: 'aField', type: 'TAG', SEPARATOR: '|' } },
      expectedWarning: null
    }],

    ["that defines a sorted string for a JSON", {
      schemaDef: { aField: { type: 'string', sortable: true } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.aField': { AS: 'aField', type: 'TAG', SEPARATOR: '|' } },
      expectedWarning: "You have marked a string field as sortable but RediSearch doesn't support the SORTABLE argument on a TAG for JSON. Ignored."
    }],

    ["that defines a separated string for a JSON", {
      schemaDef: { aField: { type: 'string', separator: ',' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.aField': { AS: 'aField', type: 'TAG', SEPARATOR: ',' } },
      expectedWarning: null
    }],

    ["that defines an indexed string for a JSON", {
      schemaDef: { aField: { type: 'string', indexed: true } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.aField': { AS: 'aField', type: 'TAG', SEPARATOR: '|' } },
      expectedWarning: null
    }],

    ["that defines an unindexed string for a JSON", {
      schemaDef: { aField: { type: 'string', indexed: false } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.aField': { AS: 'aField', type: 'TAG', SEPARATOR: '|', NOINDEX: true } },
      expectedWarning: null
    }],

    ["that defines a caseSensitive string for a JSON", {
      schemaDef: { aField: { type: 'string', caseSensitive: true } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.aField': { AS: 'aField', type: 'TAG', SEPARATOR: '|', CASESENSITIVE: true } },
      expectedWarning: null
    }],

    ["that defines a fully configured string for a JSON", {
      schemaDef: { aField: { type: 'string', alias: 'ignoredField', path: '$.anotherField', sortable: true, separator: ',', indexed: false, caseSensitive: true } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.anotherField': { AS: 'aField', type: 'TAG', SEPARATOR: ',', NOINDEX: true, CASESENSITIVE: true } },
      expectedWarning: "You have marked a string field as sortable but RediSearch doesn't support the SORTABLE argument on a TAG for JSON. Ignored."
    }]

  ])("%s", (_, data) => {

    let redisSchema: RediSearchSchema
    let schemaDef = data.schemaDef
    let dataStructure = data.dataStructure as DataStructure
    let expectedRedisSchema = data.expectedRedisSchema
    let expectedWarning = data.expectedWarning

    beforeEach(() => {
      warnSpy.mockReset()
      let schema = new Schema('TestEntity', schemaDef, { dataStructure })
      redisSchema = buildRediSearchSchema(schema)
    })

    it("generates a Redis schema for the field", () => {
      expect(redisSchema).toEqual(expectedRedisSchema)
    })

    if (expectedWarning) {
      it("generates the expected warning", () => {
        expect(warnSpy).toHaveBeenCalledWith(expectedWarning)
      })
    } else {
      it("does not generate a warning", () => {
        expect(warnSpy).not.toHaveBeenCalled()
      })
    }

  })
})
