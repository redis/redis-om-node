import Schema from '../../../lib/schema/schema';
import Entity from '../../../lib/entity/entity';
import { SchemaDefinition } from '../../../lib/schema/schema-definitions';
import { SearchDataStructure } from '../../../lib';

describe("Schema", () => {
  describe.each([

    ["that defines an unconfigured string for a JSON", {
      schemaDef: { aField: { type: 'string' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'TAG', 'SEPARATOR', '|']
    }],
    
    ["that defines an aliased string for a JSON", {
      schemaDef: { aField: { type: 'string', alias: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.anotherField', 'AS', 'anotherField', 'TAG', 'SEPARATOR', '|']
    }],

    ["that defines an unsorted string for a JSON", {
      schemaDef: { aField: { type: 'string', sortable: false } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'TAG', 'SEPARATOR', '|']
    }],

    ["that defines an unsorted and aliased string for a JSON", {
      schemaDef: { aField: { type: 'string', sortable: false, alias: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.anotherField', 'AS', 'anotherField', 'TAG', 'SEPARATOR', '|']
    }],

    ["that defines a sorted string for a JSON", {
      schemaDef: { aField: { type: 'string', sortable: true } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'TAG', 'SEPARATOR', '|']
    }],

    ["that defines a sorted and aliased string for a JSON", {
      schemaDef: { aField: { type: 'string', sortable: true, alias: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.anotherField', 'AS', 'anotherField', 'TAG', 'SEPARATOR', '|']
    }],

    ["that defines a separated string for a JSON", {
      schemaDef: { aField: { type: 'string', separator: ';' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'TAG', 'SEPARATOR', ';']
    }],
    
    ["that defines a separated and aliased string for a JSON", {
      schemaDef: { aField: { type: 'string', alias: 'anotherField', separator: ';' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.anotherField', 'AS', 'anotherField', 'TAG', 'SEPARATOR', ';']
    }],

    ["that defines a separated and unsorted string for a JSON", {
      schemaDef: { aField: { type: 'string', sortable: false, separator: ';' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'TAG', 'SEPARATOR', ';']
    }],

    ["that defines a separated and unsorted and aliased string for a JSON", {
      schemaDef: { aField: { type: 'string', sortable: false, alias: 'anotherField', separator: ';' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.anotherField', 'AS', 'anotherField', 'TAG', 'SEPARATOR', ';']
    }],

    ["that defines a separated and sorted string for a JSON", {
      schemaDef: { aField: { type: 'string', sortable: true, separator: ';' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'TAG', 'SEPARATOR', ';']
    }],

    ["that defines a separated and sorted and aliased string for a JSON", {
      schemaDef: { aField: { type: 'string', sortable: true, alias: 'anotherField', separator: ';' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.anotherField', 'AS', 'anotherField', 'TAG', 'SEPARATOR', ';']
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
