import Schema from '../../../lib/schema/schema';
import Entity from '../../../lib/entity/entity';
import { SchemaDefinition } from '../../../lib/schema/schema-definitions';
import { SearchDataStructure } from '../../../lib';

describe("Schema", () => {
  describe.each([

    ["that defines an unconfigured boolean for a JSON", {
      schemaDef: { aField: { type: 'boolean' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'TAG']
    }],
    
    ["that defines an aliased boolean for a JSON", {
      schemaDef: { aField: { type: 'boolean', alias: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.anotherField', 'AS', 'anotherField', 'TAG']
    }],

    ["that defines a sorted boolean for a JSON", {
      schemaDef: { aField: { type: 'boolean', sortable: true } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'TAG']
    }],

    ["that defines an unsorted boolean for a JSON", {
      schemaDef: { aField: { type: 'boolean', sortable: false } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'TAG']
    }],

    ["that defines a sorted and aliased boolean for a JSON", {
      schemaDef: { aField: { type: 'boolean', sortable: true, alias: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.anotherField', 'AS', 'anotherField', 'TAG']
    }],

    ["that defines an unsorted and aliased boolean for a JSON", {
      schemaDef: { aField: { type: 'boolean', sortable: false, alias: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.anotherField', 'AS', 'anotherField', 'TAG']
    }]

  ])("%s", (_, data) => {

    class TestEntity extends Entity {}

    it("generates a Redis schema for the field", () => {
      let schemaDef = data.schemaDef;
      let dataStructure = data.dataStructure as SearchDataStructure;
      let expectedRedisSchema = data.expectedRedisSchema;

      let schema = new Schema<TestEntity>(TestEntity, schemaDef, { dataStructure });
      expect(schema.redisSchema).toEqual(expectedRedisSchema);
    });
  });
});
