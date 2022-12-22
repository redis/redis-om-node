import { RediSearchSchema } from 'redis'

import { Schema, SchemaDefinition, DataStructure } from '$lib/schema'
import { buildRediSearchSchema } from '$lib/indexer'


const warnSpy = vi.spyOn(global.console, 'warn').mockImplementation(() => {})

describe("#buildRediSearchSchema", () => {
  describe.each([

    ["that defines an unconfigured boolean for a JSON", {
      schemaDef: { aField: { type: 'boolean' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.aField': { AS: 'aField', type: 'TAG' } },
      expectedWarning: null
    }],

    ["that defines an aliased boolean for a JSON", {
      schemaDef: { aField: { type: 'boolean', alias: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.anotherField': { AS: 'aField', type: 'TAG' } },
      expectedWarning: null
    }],

    ["that defines a pathed boolean for a JSON", {
      schemaDef: { aField: { type: 'boolean', path: '$.anotherField' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.anotherField': { AS: 'aField', type: 'TAG' } },
      expectedWarning: null
    }],

    ["that defines a sorted boolean for a JSON", {
      schemaDef: { aField: { type: 'boolean', sortable: true } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.aField': { AS: 'aField', type: 'TAG' } },
      expectedWarning: "You have marked a boolean field as sortable but RediSearch doesn't support the SORTABLE argument on a TAG for JSON. Ignored."
    }],

    ["that defines an unsorted boolean for a JSON", {
      schemaDef: { aField: { type: 'boolean', sortable: false } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.aField': { AS: 'aField', type: 'TAG' } },
      expectedWarning: null
    }],

    ["that defines an indexed boolean for a JSON", {
      schemaDef: { aField: { type: 'boolean', indexed: true } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.aField': { AS: 'aField', type: 'TAG' } },
      expectedWarning: null
    }],

    ["that defines an unidexed boolean for a JSON", {
      schemaDef: { aField: { type: 'boolean', indexed: false } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.aField': { AS: 'aField', type: 'TAG', NOINDEX: true } },
      expectedWarning: null
    }],

    ["that defines a fully configured boolean for a JSON", {
      schemaDef: { aField: { type: 'boolean', alias: 'ignoredField', path: '$.anotherField', sortable: true, indexed: false } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: { '$.anotherField': { AS: 'aField', type: 'TAG', NOINDEX: true } },
      expectedWarning: "You have marked a boolean field as sortable but RediSearch doesn't support the SORTABLE argument on a TAG for JSON. Ignored."
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
