import Schema from '../../../lib/schema/schema';
import Entity from '../../../lib/entity/entity';
import SchemaDefinition from '../../../lib/schema/definition/schema-definition';
import DataStructure from '../../../lib/schema/options/data-structure';

describe("Schema", () => {
  describe.each([

    ["that defines an unconfigured point for a JSON", {
      schemaDef: { aField: { type: 'point' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'GEO']
    }],

    ["that defines an aliased point for a JSON", {
      schemaDef: { aField: { type: 'point', alias: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.anotherField', 'AS', 'anotherField', 'GEO']
    }],

    ["that defines an indexed point for a JSON", {
      schemaDef: { aField: { type: 'point', indexed: true } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'GEO']
    }],

    ["that defines an unindexed point for a JSON", {
      schemaDef: { aField: { type: 'point', indexed: false } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'GEO', 'NOINDEX']
    }],

    ["that defines a fully-configured point for a JSON", {
      schemaDef: { aField: { type: 'point', alias: 'anotherField', indexed: false } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.anotherField', 'AS', 'anotherField', 'GEO', 'NOINDEX']
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
