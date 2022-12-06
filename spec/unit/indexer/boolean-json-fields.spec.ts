import { Schema, SchemaDefinition, DataStructure } from '$lib/schema'
import { buildRediSearchIndex } from '$lib/indexer'


const warnSpy = vi.spyOn(global.console, 'warn').mockImplementation(() => {})

describe("Schema", () => {
  describe.each([

    ["that defines an unconfigured boolean for a JSON", {
      schemaDef: { aField: { type: 'boolean' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'TAG'],
      expectedWarning: null
    }],

    ["that defines a sorted boolean for a JSON", {
      schemaDef: { aField: { type: 'boolean', sortable: true } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'TAG'],
      expectedWarning: "You have marked a boolean field as sortable but RediSearch doesn't support the SORTABLE argument on a TAG for JSON. Ignored."
    }],

    ["that defines an unsorted boolean for a JSON", {
      schemaDef: { aField: { type: 'boolean', sortable: false } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'TAG'],
      expectedWarning: null
    }],

    ["that defines an indexed boolean for a JSON", {
      schemaDef: { aField: { type: 'boolean', indexed: true } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'TAG'],
      expectedWarning: null
    }],

    ["that defines an unidexed boolean for a JSON", {
      schemaDef: { aField: { type: 'boolean', indexed: false } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'TAG', 'NOINDEX'],
      expectedWarning: null
    }],

    ["that defines a fully configured boolean for a JSON", {
      schemaDef: { aField: { type: 'boolean', sortable: true, indexed: false } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'TAG', 'NOINDEX'],
      expectedWarning: "You have marked a boolean field as sortable but RediSearch doesn't support the SORTABLE argument on a TAG for JSON. Ignored."
    }]

  ])("%s", (_, data) => {

    let redisSchema: Array<string>
    let schemaDef = data.schemaDef
    let dataStructure = data.dataStructure as DataStructure
    let expectedRedisSchema = data.expectedRedisSchema
    let expectedWarning = data.expectedWarning

    beforeEach(() => {
      warnSpy.mockReset()
      let schema = new Schema('TestEntity', schemaDef, { dataStructure })
      redisSchema = buildRediSearchIndex(schema)
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
