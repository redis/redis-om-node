import Schema from '../../../lib/schema/schema';
import Entity from '../../../lib/entity/entity';
import SchemaDefinition from '../../../lib/schema/definition/schema-definition';
import DataStructure from '../../../lib/schema/options/data-structure';

describe("Schema", () => {
  describe.each([

    ["that defines an unconfigured array for a JSON", {
      schemaDef: { aField: { type: 'string[]' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField[*]', 'AS', 'aField', 'TAG', 'SEPARATOR', '|']
    }],

    ["that defines an aliased array for a JSON", {
      schemaDef: { aField: { type: 'string[]', alias: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.anotherField[*]', 'AS', 'anotherField', 'TAG', 'SEPARATOR', '|']
    }],

    ["that defines an indexed array for a JSON", {
      schemaDef: { aField: { type: 'string[]', indexed: true } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField[*]', 'AS', 'aField', 'TAG', 'SEPARATOR', '|']
    }],

    ["that defines an unindexed array for a JSON", {
      schemaDef: { aField: { type: 'string[]', indexed: false } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField[*]', 'AS', 'aField', 'TAG', 'SEPARATOR', '|', 'NOINDEX']
    }],

    ["that defines a fully-configured array for a JSON", {
      schemaDef: { aField: { type: 'string[]', alias: 'anotherField', indexed: false } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.anotherField[*]', 'AS', 'anotherField', 'TAG', 'SEPARATOR', '|', 'NOINDEX']
    }]

  ])("%s", (_, data) => {

    class TestEntity extends Entity { }

    it("generates a Redis schema for the field", () => {
      let schemaDef = data.schemaDef;
      let dataStructure = data.dataStructure as DataStructure;
      let expectedRedisSchema = data.expectedRedisSchema;

      let schema = new Schema<TestEntity>(TestEntity, schemaDef, { dataStructure });
      expect(schema.redisSchema).toEqual(expectedRedisSchema);
    });
  });
});
