import { Schema, EmbeddedSchema } from '$lib/schema/schema';
import { Entity } from '$lib/entity/entity';
import { SchemaDefinition } from '$lib/schema/definition/schema-definition';
import { DataStructure } from '$lib/schema/options/data-structure';

describe("Schema", () => {

  class TestEmbeddedEntity extends Entity {}
  const testSchema = new EmbeddedSchema<TestEmbeddedEntity>(TestEmbeddedEntity, {
    aNumber: { type: 'number' },
    aString: { type: 'string' },
    someText: { type: 'text' }
  })

  describe.each([

    ["that defines an unconfigured object for a JSON", {
      schemaDef: { aField: { type: 'object', schema: testSchema } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: [
        '$.aField.aNumber', 'AS', 'aField.aNumber', 'NUMERIC',
        '$.aField.aString', 'AS', 'aField.aString', 'TAG', 'SEPARATOR', '|',
        '$.aField.someText', 'AS', 'aField.someText', 'TEXT'
      ]
    }],

    ["that defines an aliased object for a JSON", {
      schemaDef: { aField: { type: 'object', alias: 'anotherField', schema: testSchema } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: [
        '$.anotherField.aNumber', 'AS', 'anotherField.aNumber', 'NUMERIC',
        '$.anotherField.aString', 'AS', 'anotherField.aString', 'TAG', 'SEPARATOR', '|',
        '$.anotherField.someText', 'AS', 'anotherField.someText', 'TEXT'
      ]
    }],

  ])("%s", (_, data) => {

    class TestEntity extends Entity {}

    it("generates a Redis schema for the field", () => {
      let schemaDef = data.schemaDef;
      let dataStructure = data.dataStructure as DataStructure;
      let expectedRedisSchema = data.expectedRedisSchema;

      let schema = new Schema<TestEntity>(TestEntity, schemaDef, { dataStructure });
      expect(schema.redisSchema).toEqual(expectedRedisSchema);
    });
  });
});
