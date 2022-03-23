import Schema from '../../../lib/schema/schema';
import Entity from '../../../lib/entity/entity';
import { SchemaDefinition } from '../../../lib/schema/schema-definitions';
import { SearchDataStructure } from '../../../lib';

describe("Schema", () => {
  describe.each([

    ["that defines an unconfigured string[] for a JSON", {
      schemaDef: { aField: { type: 'string[]' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField[*]', 'AS', 'aField', 'TAG']
    }],
    
    ["that defines an aliased string[] for a JSON", {
      schemaDef: { aField: { type: 'string[]', alias: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.anotherField[*]', 'AS', 'anotherField', 'TAG']
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
