import Schema from '../../../lib/schema/schema';
import Entity from '../../../lib/entity/entity';
import SchemaDefinition from '../../../lib/schema/definition/schema-definition';
import DataStructure from '../../../lib/schema/options/data-structure';

describe("Schema", () => {
  describe.each([

    ["that defines an unconfigured array for a HASH", {
      schemaDef: { aField: { type: 'string[]' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: ['aField', 'TAG', 'SEPARATOR', '|']
    }],

    ["that defines an aliased array for a HASH", {
      schemaDef: { aField: { type: 'string[]', alias: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: ['anotherField', 'TAG', 'SEPARATOR', '|']
    }],

    ["that defines a separated array for a HASH", {
      schemaDef: { aField: { type: 'string[]', separator: ';' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: ['aField', 'TAG', 'SEPARATOR', ';']
    }],

    ["that defines a separated and aliased array for a HASH", {
      schemaDef: { aField: { type: 'string[]', alias: 'anotherField', separator: ';' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: ['anotherField', 'TAG', 'SEPARATOR', ';']
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
