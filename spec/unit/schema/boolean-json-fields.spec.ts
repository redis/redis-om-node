import Schema from '../../../lib/schema/schema';
import Entity from '../../../lib/entity/entity';
import SchemaDefinition from '../../../lib/schema/definition/schema-definition';
import DataStructure from '../../../lib/schema/options/data-structure';

import * as logger from '../../../lib/shims/logger';

const warnSpy = jest.spyOn(logger, 'warn');

describe("Schema", () => {
  describe.each([

    ["that defines an unconfigured boolean for a JSON", {
      schemaDef: { aField: { type: 'boolean' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'TAG'],
      expectedWarning: null
    }],

    ["that defines an aliased boolean for a JSON", {
      schemaDef: { aField: { type: 'boolean', alias: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.anotherField', 'AS', 'anotherField', 'TAG'],
      expectedWarning: null
    }],

    ["that defines a sorted boolean for a JSON", {
      schemaDef: { aField: { type: 'boolean', sortable: true } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'TAG'],
      expectedWarning: "You have marked the boolean field 'aField' as sortable but RediSearch doesn't support the SORTABLE argument on a TAG for JSON. Ignored."
    }],

    ["that defines an unsorted boolean for a JSON", {
      schemaDef: { aField: { type: 'boolean', sortable: false } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'TAG'],
      expectedWarning: null
    }],

    ["that defines a sorted and aliased boolean for a JSON", {
      schemaDef: { aField: { type: 'boolean', sortable: true, alias: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.anotherField', 'AS', 'anotherField', 'TAG'],
      expectedWarning: "You have marked the boolean field 'aField' as sortable but RediSearch doesn't support the SORTABLE argument on a TAG for JSON. Ignored."
    }],

    ["that defines an unsorted and aliased boolean for a JSON", {
      schemaDef: { aField: { type: 'boolean', sortable: false, alias: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.anotherField', 'AS', 'anotherField', 'TAG'],
      expectedWarning: null
    }]

  ])("%s", (_, data) => {

    class TestEntity extends Entity { }

    let redisSchema: Array<string>;
    let schemaDef = data.schemaDef;
    let dataStructure = data.dataStructure as DataStructure;
    let expectedRedisSchema = data.expectedRedisSchema;
    let expectedWarning = data.expectedWarning;

    beforeEach(() => {
      warnSpy.mockReset();
      let schema = new Schema<TestEntity>(TestEntity, schemaDef, { dataStructure });
      redisSchema = schema.redisSchema
    });

    it("generates a Redis schema for the field", () => {
      expect(redisSchema).toEqual(expectedRedisSchema);
    });

    if (expectedWarning) {
      it("generates the expected warning", () => {
        expect(warnSpy).toHaveBeenCalledWith(expectedWarning);
      });
    } else {
      it("does not generate a warning", () => {
        expect(warnSpy).not.toHaveBeenCalled();
      });
    }

  });
});
