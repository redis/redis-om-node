import { Schema, SchemaDefinition, SchemaOptions } from '$lib/schema'

const EMPTY_SCHEMA_DEF: SchemaDefinition = {}
const WELL_POPULATED_SCHEMA_DEF: SchemaDefinition = {
  aString: { type: 'string' }, anotherString: { type: 'string' },
  someText: { type: 'text' }, someOtherText: { type: 'text' },
  aNumber: { type: 'number' }, anotherNumber: { type: 'number' },
  aBoolean: { type: 'boolean' }, anotherBoolean: { type: 'boolean' },
  aPoint: { type: 'point' }, anotherPoint: { type: 'point' },
  aDate: { type: 'date' }, anotherDate: { type: 'date' },
  someStrings: { type: 'string[]' }, someOtherStrings: { type: 'string[]' }
}

const EMPTY_HASH = "9UJTUMAzgvhnE/cOJXT1D3KPGYg="
const WELL_POPULATED_HASH = "F+GgQDhzmXhvTNhQczPZtCIJ0BA="

describe("Schema", () => {
  describe("#indexHash", () => {

    describe.each([
      ["that is given a well populated schema", {
        schemaDef: WELL_POPULATED_SCHEMA_DEF,
        options: {} as SchemaOptions,
        expectedHash: WELL_POPULATED_HASH
      }],
      ["that is given an empty schema", {
        schemaDef: EMPTY_SCHEMA_DEF,
        options: {} as SchemaOptions,
        expectedHash: EMPTY_HASH
      }],
      ["that is given the default data strucutre of JSON", {
        schemaDef: EMPTY_SCHEMA_DEF,
        options: { dataStructure: 'JSON' } as SchemaOptions,
        expectedHash: EMPTY_HASH
      }],
      ["that overrides the data structure to be HASH", {
        schemaDef: EMPTY_SCHEMA_DEF,
        options: { dataStructure: 'HASH' } as SchemaOptions,
        expectedHash: "nd4P5YFFLxYr/3glJ6Thvlk+0tg="
      }],
      ["that overrides the index name", {
        schemaDef: EMPTY_SCHEMA_DEF,
        options: { indexName: 'test-index' } as SchemaOptions,
        expectedHash: "DgFE5XI/doj0oQNTZQ5yqPHtb6M="
      }],
      ["that overrides the index hash name", {
        schemaDef: EMPTY_SCHEMA_DEF,
        options: { indexHashName: 'test-index-hash' } as SchemaOptions,
        expectedHash: "p1OuQrsovszDdUD5pnbxTT5sbpI="
      }],
      ["that overrides the id generation strategy", {
        schemaDef: EMPTY_SCHEMA_DEF,
        options: { idStrategy: async () => '1' } as SchemaOptions,
        expectedHash: EMPTY_HASH
      }],
      ["that disables stop words", {
        schemaDef: EMPTY_SCHEMA_DEF,
        options: { useStopWords: 'OFF' } as SchemaOptions,
        expectedHash: "W7+Ri6W8CIo8GUkRY+uabQgpNVA="
      }],
      ["that uses default stop words", {
        schemaDef: EMPTY_SCHEMA_DEF,
        options: { useStopWords: 'DEFAULT' } as SchemaOptions,
        expectedHash: EMPTY_HASH
      }],
      ["that uses custom stop words", {
        schemaDef: EMPTY_SCHEMA_DEF,
        options: { useStopWords: 'CUSTOM' } as SchemaOptions,
        expectedHash: "nEC4s/DEz7EvTApCOKzQlXFTgSA="
      }],
      ["that sets custom stop words", {
        schemaDef: EMPTY_SCHEMA_DEF,
        options: { stopWords: ['foo', 'bar', 'baz'] } as SchemaOptions,
        expectedHash: "odwqZJal1kQTrLjIqu79U4ZHtDs="
      }]
    ])("%s", (_, data) => {
      it("generates the expected hash", () => {
        const schema = new Schema('TestEntity', data.schemaDef, data.options)
        expect(schema.indexHash).toBe(data.expectedHash)
      })
    })
  })
})
