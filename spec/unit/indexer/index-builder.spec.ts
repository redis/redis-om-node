import { Schema, SchemaDefinition, DataStructure } from '$lib/schema'
import { buildRediSearchSchema } from '$lib/indexer'


describe("#buildRediSearchSchema", () => {
  describe.each([

    ["that is given an empty schema for a HASH", {
      schemaDef: {} as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: {}
    }],

    ["that is given an empty schema for JSON", {
      schemaDef: {} as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: {}
    }],

    ["that is given a well populated schema for a HASH", {
      schemaDef: {
        aString: { type: 'string' },
        anotherString: { type: 'string' },
        someText: { type: 'text' },
        someOtherText: { type: 'text' },
        aNumber: { type: 'number' },
        anotherNumber: { type: 'number' },
        aBoolean: { type: 'boolean' },
        anotherBoolean: { type: 'boolean' },
        aPoint: { type: 'point' },
        anotherPoint: { type: 'point' },
        aDate: { type: 'date' },
        anotherDate: { type: 'date' },
        someStrings: { type: 'string[]' },
        someOtherStrings: { type: 'string[]' }
      } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: {
        aString: { type: 'TAG', AS: 'aString', SEPARATOR: '|' },
        anotherString: { type: 'TAG', AS: 'anotherString', SEPARATOR: '|' },
        someText: { type: 'TEXT', AS: 'someText', },
        someOtherText: { type: 'TEXT', AS: 'someOtherText', },
        aNumber: { type: 'NUMERIC', AS: 'aNumber', },
        anotherNumber: { type: 'NUMERIC', AS: 'anotherNumber', },
        aBoolean: { type: 'TAG', AS: 'aBoolean', },
        anotherBoolean: { type: 'TAG', AS: 'anotherBoolean', },
        aPoint: { type: 'GEO', AS: 'aPoint', },
        anotherPoint: { type: 'GEO', AS: 'anotherPoint', },
        aDate: { type: 'NUMERIC', AS: 'aDate', },
        anotherDate: { type: 'NUMERIC', AS: 'anotherDate', },
        someStrings: { type: 'TAG', AS: 'someStrings', SEPARATOR: '|' },
        someOtherStrings: { type: 'TAG', AS: 'someOtherStrings', SEPARATOR: '|' }
      }
    }],

    ["that is given a well populated schema for a JSON", {
      schemaDef: {
        aString: { type: 'string' },
        anotherString: { type: 'string' },
        someText: { type: 'text' },
        someOtherText: { type: 'text' },
        aNumber: { type: 'number' },
        anotherNumber: { type: 'number' },
        aBoolean: { type: 'boolean' },
        anotherBoolean: { type: 'boolean' },
        aPoint: { type: 'point' },
        anotherPoint: { type: 'point' },
        aDate: { type: 'date' },
        anotherDate: { type: 'date' },
        someStrings: { type: 'string[]' },
        someOtherStrings: { type: 'string[]' }
      } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: {
        '$.aString': { type: 'TAG', AS: 'aString', SEPARATOR: '|' },
        '$.anotherString': { type: 'TAG', AS: 'anotherString', SEPARATOR: '|' },
        '$.someText': { type: 'TEXT', AS: 'someText' },
        '$.someOtherText': { type: 'TEXT', AS: 'someOtherText' },
        '$.aNumber': { type: 'NUMERIC', AS: 'aNumber' },
        '$.anotherNumber': { type: 'NUMERIC', AS: 'anotherNumber' },
        '$.aBoolean': { type: 'TAG', AS: 'aBoolean' },
        '$.anotherBoolean': { type: 'TAG', AS: 'anotherBoolean' },
        '$.aPoint': { type: 'GEO', AS: 'aPoint' },
        '$.anotherPoint': { type: 'GEO', AS: 'anotherPoint' },
        '$.aDate': { type: 'NUMERIC', AS: 'aDate' },
        '$.anotherDate': { type: 'NUMERIC', AS: 'anotherDate' },
        '$.someStrings[*]': { type: 'TAG', AS: 'someStrings', SEPARATOR: '|' },
        '$.someOtherStrings[*]': { type: 'TAG', AS: 'someOtherStrings', SEPARATOR: '|' }
      }
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
