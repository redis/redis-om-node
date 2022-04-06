import Schema from '../../../lib/schema/schema';
import Entity from '../../../lib/entity/entity';
import { SchemaDefinition } from '../../../lib/schema/definition/schema-definitions';
import { SearchDataStructure } from '../../../lib';

describe("Schema", () => {
  describe.each([

    ["that defines an unconfigured point for a HASH", {
      schemaDef: { aField: { type: 'point' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: ['aField', 'GEO']
    }],

    ["that defines an aliased point for a HASH", {
      schemaDef: { aField: { type: 'point', alias: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: ['anotherField', 'GEO']
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
