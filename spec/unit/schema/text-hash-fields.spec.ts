import Schema from '../../../lib/schema/schema';
import Entity from '../../../lib/entity/entity';
import SchemaDefinition from '../../../lib/schema/definition/schema-definition';
import DataStructure from '../../../lib/schema/options/data-structure';

describe("Schema", () => {
  describe.each([

    ["that defines an unconfigured text for a HASH", {
      schemaDef: { aField: { type: 'text' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: ['aField', 'TEXT']
    }],

    ["that defines an aliased text for a HASH", {
      schemaDef: { aField: { type: 'text', alias: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: ['anotherField', 'TEXT']
    }],

    ["that defines a sorted text for a HASH", {
      schemaDef: { aField: { type: 'text', sortable: true } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: ['aField', 'TEXT', 'SORTABLE']
    }],

    ["that defines an unsorted text for a HASH", {
      schemaDef: { aField: { type: 'text', sortable: false } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: ['aField', 'TEXT']
    }],

    ["that defines a sorted and aliased text for a HASH", {
      schemaDef: { aField: { type: 'text', sortable: true, alias: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: ['anotherField', 'TEXT', 'SORTABLE']
    }],

    ["that defines an unsorted and aliased text for a HASH", {
      schemaDef: { aField: { type: 'text', sortable: false, alias: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: ['anotherField', 'TEXT']
    }]

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
