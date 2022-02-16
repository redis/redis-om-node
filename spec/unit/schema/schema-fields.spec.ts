import Schema from '../../../lib/schema/schema';
import Entity, { EntityData } from '../../../lib/entity/entity';
import { SchemaDefinition } from '../../../lib/schema/schema-definitions';
import { SearchDataStructure } from '../../../lib/client';
import {
  A_STRING, ANOTHER_STRING,
  A_NUMBER, ANOTHER_NUMBER,
  SOME_STRINGS, SOME_OTHER_STRINGS,
  SOME_TEXT, SOME_OTHER_TEXT,
  A_DATE, ANOTHER_DATE,
  A_POINT, ANOTHER_POINT } from '../../helpers/example-data';

describe("Schema", () => {

  let DEFAULTS = {
    providedEntityFieldName: 'aField'
  };

  let HASH_DEFAULTS = {
    ...DEFAULTS,
    providedDataStructure: 'HASH' as SearchDataStructure
  }

  let JSON_DEFAULTS = {
    ...DEFAULTS,
    providedDataStructure: 'JSON' as SearchDataStructure
  }

  let BOOLEAN_HASH_DEFAULTS = {
    ...HASH_DEFAULTS,
    providedEntityFieldValue: true,
    expectedPropertyValue: true,
    providedAlternatePropertyValue: false,
    expectedAlternatePropertyValue: false
  };

  let NUMBER_HASH_DEFAULTS = {
    ...HASH_DEFAULTS,
    providedEntityFieldValue: A_NUMBER,
    expectedPropertyValue: A_NUMBER,
    providedAlternatePropertyValue: ANOTHER_NUMBER,
    expectedAlternatePropertyValue: ANOTHER_NUMBER
  };

  let STRING_HASH_DEFAULTS = {
    ...HASH_DEFAULTS,
    providedEntityFieldValue: A_STRING,
    expectedPropertyValue: A_STRING,
    providedAlternatePropertyValue: ANOTHER_STRING,
    expectedAlternatePropertyValue: ANOTHER_STRING
  };

  let TEXT_HASH_DEFAULTS = {
    ...HASH_DEFAULTS,
    providedEntityFieldValue: SOME_TEXT,
    expectedPropertyValue: SOME_TEXT,
    providedAlternatePropertyValue: SOME_OTHER_TEXT,
    expectedAlternatePropertyValue: SOME_OTHER_TEXT
  };

  let GEO_HASH_DEFAULTS = {
    ...HASH_DEFAULTS,
    providedEntityFieldValue: A_POINT,
    expectedPropertyValue: A_POINT,
    providedAlternatePropertyValue: ANOTHER_POINT,
    expectedAlternatePropertyValue: ANOTHER_POINT
  }

  let DATE_HASH_DEFAULTS = {
    ...HASH_DEFAULTS,
    providedEntityFieldValue: A_DATE,
    expectedPropertyValue: A_DATE,
    providedAlternatePropertyValue: ANOTHER_DATE,
    expectedAlternatePropertyValue: ANOTHER_DATE
  };

  let ARRAY_HASH_DEFAULTS = {
    ...HASH_DEFAULTS,
    providedEntityFieldValue: SOME_STRINGS,
    expectedPropertyValue: SOME_STRINGS,
    providedAlternatePropertyValue: SOME_OTHER_STRINGS,
    expectedAlternatePropertyValue: SOME_OTHER_STRINGS
  };

  let BOOLEAN_JSON_DEFAULTS = {
    ...JSON_DEFAULTS,
    providedEntityFieldValue: true,
    expectedPropertyValue: true,
    providedAlternatePropertyValue: false,
    expectedAlternatePropertyValue: false
  };

  let NUMBER_JSON_DEFAULTS = {
    ...JSON_DEFAULTS,
    providedEntityFieldValue: A_NUMBER,
    expectedPropertyValue: A_NUMBER,
    providedAlternatePropertyValue: ANOTHER_NUMBER,
    expectedAlternatePropertyValue: ANOTHER_NUMBER
  };

  let STRING_JSON_DEFAULTS = {
    ...JSON_DEFAULTS,
    providedEntityFieldValue: A_STRING,
    expectedPropertyValue: A_STRING,
    providedAlternatePropertyValue: ANOTHER_STRING,
    expectedAlternatePropertyValue: ANOTHER_STRING
  };

  let TEXT_JSON_DEFAULTS = {
    ...JSON_DEFAULTS,
    providedEntityFieldValue: SOME_TEXT,
    expectedPropertyValue: SOME_TEXT,
    providedAlternatePropertyValue: SOME_OTHER_TEXT,
    expectedAlternatePropertyValue: SOME_OTHER_TEXT,
  };

  let GEO_JSON_DEFAULTS = {
    ...JSON_DEFAULTS,
    providedEntityFieldValue: A_POINT,
    expectedPropertyValue: A_POINT,
    providedAlternatePropertyValue: ANOTHER_POINT,
    expectedAlternatePropertyValue: ANOTHER_POINT
  };

  let DATE_JSON_DEFAULTS = {
    ...JSON_DEFAULTS,
    providedEntityFieldValue: A_DATE,
    expectedPropertyValue: A_DATE,
    providedAlternatePropertyValue: ANOTHER_DATE,
    expectedAlternatePropertyValue: ANOTHER_DATE
  };

  let ARRAY_JSON_DEFAULTS = {
    ...JSON_DEFAULTS,
    providedEntityFieldValue: SOME_STRINGS,
    expectedPropertyValue: SOME_STRINGS,
    providedAlternatePropertyValue: SOME_OTHER_STRINGS,
    expectedAlternatePropertyValue: SOME_OTHER_STRINGS
  };

  describe.each([

    ["that defines an unconfigured boolean for a HASH", {
      ...BOOLEAN_HASH_DEFAULTS,
      schemaDef: {  aField: { type: 'boolean' } } as SchemaDefinition,
      expectedRedisSchema: ['aField', 'TAG']
    }],

    ["that defines an aliased boolean for a HASH", {
      ...BOOLEAN_HASH_DEFAULTS,
      schemaDef: { aField: { type: 'boolean', alias: 'anotherField' } } as SchemaDefinition,
      providedEntityFieldName: 'anotherField',
      expectedRedisSchema: ['anotherField', 'TAG']
    }],

    ["that defines an unconfigured number for a HASH", {
      ...NUMBER_HASH_DEFAULTS,
      schemaDef: { aField: { type: 'number' } } as SchemaDefinition,
      expectedRedisSchema: ['aField', 'NUMERIC']
    }],

    ["that defines an aliased number for a HASH", {
      ...NUMBER_HASH_DEFAULTS,
      schemaDef: { aField: { type: 'number', alias: 'anotherField' } } as SchemaDefinition,
      providedEntityFieldName: 'anotherField',
      expectedRedisSchema: ['anotherField', 'NUMERIC']
    }],

    ["that defines an unconfigured string for a HASH", {
      ...STRING_HASH_DEFAULTS,
      schemaDef: { aField: { type: 'string' } } as SchemaDefinition,
      expectedRedisSchema: ['aField', 'TAG', 'SEPARATOR', '|']
    }],

    ["that defines an aliased string for a HASH", {
      ...STRING_HASH_DEFAULTS,
      schemaDef: { aField: { type: 'string', alias: 'anotherField' } } as SchemaDefinition,
      providedEntityFieldName: 'anotherField',
      expectedRedisSchema: ['anotherField', 'TAG', 'SEPARATOR', '|']
    }],

    ["that defines a string configured with an alternative separator for a HASH", {
      ...STRING_HASH_DEFAULTS,
      schemaDef: { aField: { type: 'string', separator: ';' } } as SchemaDefinition,
      expectedRedisSchema: ['aField', 'TAG', 'SEPARATOR', ';']
    }],

    ["that defines an unconfigured text for a HASH", {
      ...TEXT_HASH_DEFAULTS,
      schemaDef: { aField: { type: 'text' } } as SchemaDefinition,
      expectedRedisSchema: ['aField', 'TEXT']
    }],

    ["that defines an alaised text for a HASH", {
      ...TEXT_HASH_DEFAULTS,
      schemaDef: { aField: { type: 'text', alias: 'anotherField' } } as SchemaDefinition,
      providedEntityFieldName: 'anotherField',
      expectedRedisSchema: ['anotherField', 'TEXT']
    }],

    ["that defines an unconfigured point for a HASH", {
      ...GEO_HASH_DEFAULTS,
      schemaDef: { aField: { type: 'point' } } as SchemaDefinition,
      expectedRedisSchema: ['aField', 'GEO']
    }],

    ["that defines an aliased point for a HASH", {
      ...GEO_HASH_DEFAULTS,
      schemaDef: { aField: { type: 'point', alias: 'anotherField' } } as SchemaDefinition,
      providedEntityFieldName: 'anotherField',
      expectedRedisSchema: ['anotherField', 'GEO']
    }],

    ["that defines an unconfigured date for a HASH", {
      ...DATE_HASH_DEFAULTS,
      schemaDef: { aField: { type: 'date' } } as SchemaDefinition,
      expectedRedisSchema: ['aField', 'NUMERIC']
    }],

    ["that defines an aliased date for a HASH", {
      ...DATE_HASH_DEFAULTS,
      schemaDef: { aField: { type: 'date', alias: 'anotherField' } } as SchemaDefinition,
      providedEntityFieldName: 'anotherField',
      expectedRedisSchema: ['anotherField', 'NUMERIC']
    }],

    ["that defines an unconfigured string[] for a HASH", {
      ...ARRAY_HASH_DEFAULTS,
      schemaDef: { aField: { type: 'string[]' } } as SchemaDefinition,
      expectedRedisSchema: ['aField', 'TAG', 'SEPARATOR', '|']
    }],

    ["that defines an aliased string[] for a HASH", {
      ...ARRAY_HASH_DEFAULTS,
      schemaDef: { aField: { type: 'string[]', alias: 'anotherField' } } as SchemaDefinition,
      providedEntityFieldName: 'anotherField',
      expectedRedisSchema: ['anotherField', 'TAG', 'SEPARATOR', '|']
    }],

    ["that defines a string[] configured with an alternative separator for a HASH", {
      ...ARRAY_HASH_DEFAULTS,
      schemaDef: { aField: { type: 'string[]', separator: ';'} } as SchemaDefinition,
      providedEntityFieldValue: SOME_STRINGS,
      expectedRedisSchema: ['aField', 'TAG', 'SEPARATOR', ';']
    }],

    ["that defines an unconfigured boolean for JSON", {
      ...BOOLEAN_JSON_DEFAULTS,
      schemaDef: { aField: { type: 'boolean' } } as SchemaDefinition,
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'TAG']
    }],

    ["that defines an aliased boolean for JSON", {
      ...BOOLEAN_JSON_DEFAULTS,
      schemaDef: { aField: { type: 'boolean', alias: 'anotherField' } } as SchemaDefinition,
      providedEntityFieldName: 'anotherField',
      expectedRedisSchema: ['$.anotherField', 'AS', 'anotherField', 'TAG']
    }],

    ["that defines an unconfigured number for JSON", {
      ...NUMBER_JSON_DEFAULTS,
      schemaDef: { aField: { type: 'number' } } as SchemaDefinition,
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'NUMERIC']
    }],

    ["that defines an aliased number for JSON", {
      ...NUMBER_JSON_DEFAULTS,
      schemaDef: { aField: { type: 'number', alias: 'anotherField' } } as SchemaDefinition,
      providedEntityFieldName: 'anotherField',
      expectedRedisSchema: ['$.anotherField', 'AS', 'anotherField', 'NUMERIC']
    }],

    ["that defines an unconfigured string for JSON", {
      ...STRING_JSON_DEFAULTS,
      schemaDef: { aField: { type: 'string' } } as SchemaDefinition,
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'TAG', 'SEPARATOR', '|']
    }],

    ["that defines an aliased string for JSON", {
      ...STRING_JSON_DEFAULTS,
      schemaDef: { aField: { type: 'string', alias: 'anotherField' } } as SchemaDefinition,
      providedEntityFieldName: 'anotherField',
      expectedRedisSchema: ['$.anotherField', 'AS', 'anotherField', 'TAG', 'SEPARATOR', '|']
    }],

    ["that defines a string configured with an alternative separator for JSON", {
      ...STRING_JSON_DEFAULTS,
      schemaDef: { aField: { type: 'string', separator: ';' } } as SchemaDefinition,
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'TAG', 'SEPARATOR', ';']
    }],

    ["that defines an unconfigured text for a JSON", {
      ...TEXT_JSON_DEFAULTS,
      schemaDef: { aField: { type: 'text' } } as SchemaDefinition,
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'TEXT']
    }],

    ["that defines an alaised text for a JSON", {
      ...TEXT_JSON_DEFAULTS,
      schemaDef: { aField: { type: 'text', alias: 'anotherField' } } as SchemaDefinition,
      providedEntityFieldName: 'anotherField',
      expectedRedisSchema: ['$.anotherField', 'AS', 'anotherField', 'TEXT']
    }],

    ["that defines an unconfigured point for JSON", {
      ...GEO_JSON_DEFAULTS,
      schemaDef: { aField: { type: 'point' } } as SchemaDefinition,
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'GEO']
    }],

    ["that defines an aliased point for JSON", {
      ...GEO_JSON_DEFAULTS,
      schemaDef: { aField: { type: 'point', alias: 'anotherField' } } as SchemaDefinition,
      providedEntityFieldName: 'anotherField',
      expectedRedisSchema: ['$.anotherField', 'AS', 'anotherField', 'GEO']
    }],

    ["that defines an unconfigured date for JSON", {
      ...DATE_JSON_DEFAULTS,
      schemaDef: { aField: { type: 'date' } } as SchemaDefinition,
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'NUMERIC']
    }],

    ["that defines an aliased date for JSON", {
      ...DATE_JSON_DEFAULTS,
      schemaDef: { aField: { type: 'date', alias: 'anotherField' } } as SchemaDefinition,
      providedEntityFieldName: 'anotherField',
      expectedRedisSchema: ['$.anotherField', 'AS', 'anotherField', 'NUMERIC']
    }],

    ["that defines an unconfigured string[] for JSON", {
      ...ARRAY_JSON_DEFAULTS,
      schemaDef: { aField: { type: 'string[]' } } as SchemaDefinition,
      expectedRedisSchema: ['$.aField[*]', 'AS', 'aField', 'TAG']
    }],

    ["that defines an aliased string[] for JSON", {
      ...ARRAY_JSON_DEFAULTS,
      schemaDef: { aField: { type: 'string[]', alias: 'anotherField' } } as SchemaDefinition,
      providedEntityFieldName: 'anotherField',
      expectedRedisSchema: ['$.anotherField[*]', 'AS', 'anotherField', 'TAG']
    }],

    ["that defines a string[] configured with an ignored separator for JSON", {
      ...ARRAY_JSON_DEFAULTS,
      schemaDef: { aField: { type: 'string[]', separator: ';' } } as SchemaDefinition,
      expectedRedisSchema: ['$.aField[*]', 'AS', 'aField', 'TAG']
    }]
  ])("%s", (_, data) => {

    interface TestEntity {
      aField: any;
    }

    class TestEntity extends Entity {}

    let schema: Schema<TestEntity>;
    let entity: TestEntity;

    beforeAll(() => {
      schema = new Schema<TestEntity>(TestEntity, data.schemaDef, { dataStructure: data.providedDataStructure });
    });

    beforeEach(() => {
      let entityData: EntityData = {};
      entityData[data.providedEntityFieldName] = data.providedEntityFieldValue;
      entity = new TestEntity(data.schemaDef, A_STRING, entityData)
    });

    it("adds the getter and setter for the field from the schema definition to the entity", () => {
      expect(entity).toHaveProperty('aField', data.expectedPropertyValue);
      entity.aField = data.providedAlternatePropertyValue;
      expect(entity.aField).toEqual(data.expectedAlternatePropertyValue);
    });

    it("generates a Redis schema for the field", () => {
      expect(schema.redisSchema).toEqual(data.expectedRedisSchema);
    });
  });
});
