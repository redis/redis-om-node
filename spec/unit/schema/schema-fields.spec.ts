import Schema from '../../../lib/schema/schema';
import Entity, { EntityData } from '../../../lib/entity/entity';
import { SchemaDefinition } from '../../../lib/schema/schema-definitions';
import { SearchDataStructure } from '../../../lib/client';
import { ANOTHER_ARRAY, ANOTHER_DATE, ANOTHER_GEOPOINT, AN_ARRAY, A_DATE, A_GEOPOINT } from '../../helpers/example-data';

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
    providedEntityFieldValue: 42,
    expectedPropertyValue: 42,
    providedAlternatePropertyValue: 23,
    expectedAlternatePropertyValue: 23
  };

  let STRING_HASH_DEFAULTS = {
    ...HASH_DEFAULTS,
    providedEntityFieldValue: 'foo',
    expectedPropertyValue: 'foo',
    providedAlternatePropertyValue: 'bar',
    expectedAlternatePropertyValue: 'bar',
  };

  let GEO_HASH_DEFAULTS = {
    ...HASH_DEFAULTS,
    providedEntityFieldValue: A_GEOPOINT,
    expectedPropertyValue: A_GEOPOINT,
    providedAlternatePropertyValue: ANOTHER_GEOPOINT,
    expectedAlternatePropertyValue: ANOTHER_GEOPOINT
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
    providedEntityFieldValue: AN_ARRAY,
    expectedPropertyValue: AN_ARRAY,
    providedAlternatePropertyValue: ANOTHER_ARRAY,
    expectedAlternatePropertyValue: ANOTHER_ARRAY
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
    providedEntityFieldValue: 42,
    expectedPropertyValue: 42,
    providedAlternatePropertyValue: 23,
    expectedAlternatePropertyValue: 23
  };

  let STRING_JSON_DEFAULTS = {
    ...JSON_DEFAULTS,
    providedEntityFieldValue: 'foo',
    expectedPropertyValue: 'foo',
    providedAlternatePropertyValue: 'bar',
    expectedAlternatePropertyValue: 'bar'
  };

  let GEO_JSON_DEFAULTS = {
    ...JSON_DEFAULTS,
    providedEntityFieldValue: A_GEOPOINT,
    expectedPropertyValue: A_GEOPOINT,
    providedAlternatePropertyValue: ANOTHER_GEOPOINT,
    expectedAlternatePropertyValue: ANOTHER_GEOPOINT
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
    providedEntityFieldValue: AN_ARRAY,
    expectedPropertyValue: AN_ARRAY,
    providedAlternatePropertyValue: ANOTHER_ARRAY,
    expectedAlternatePropertyValue: ANOTHER_ARRAY
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

    ["that defines a string configured for full text search for a HASH", {
      ...STRING_HASH_DEFAULTS,
      schemaDef: { aField: { type: 'string', textSearch: true } } as SchemaDefinition,
      expectedRedisSchema: ['aField', 'TEXT']
    }],

    ["that defines a string *not* configured for full text search for a HASH", {
      ...STRING_HASH_DEFAULTS,
      schemaDef: { aField: { type: 'string', textSearch: false } } as SchemaDefinition,
      expectedRedisSchema: ['aField', 'TAG', 'SEPARATOR', '|']
    }],

    ["that defines a string configured with an alternative separator for a HASH", {
      ...STRING_HASH_DEFAULTS,
      schemaDef: { aField: { type: 'string', separator: ';' } } as SchemaDefinition,
      expectedRedisSchema: ['aField', 'TAG', 'SEPARATOR', ';']
    }],

    ["that defines an unconfigured geopoint for a HASH", {
      ...GEO_HASH_DEFAULTS,
      schemaDef: { aField: { type: 'geopoint' } } as SchemaDefinition,
      expectedRedisSchema: ['aField', 'GEO']
    }],

    ["that defines an aliased geopoint for a HASH", {
      ...GEO_HASH_DEFAULTS,
      schemaDef: { aField: { type: 'geopoint', alias: 'anotherField' } } as SchemaDefinition,
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

    ["that defines an unconfigured array for a HASH", {
      ...ARRAY_HASH_DEFAULTS,
      schemaDef: { aField: { type: 'array' } } as SchemaDefinition,
      expectedRedisSchema: ['aField', 'TAG', 'SEPARATOR', '|']
    }],

    ["that defines an aliased array for a HASH", {
      ...ARRAY_HASH_DEFAULTS,
      schemaDef: { aField: { type: 'array', alias: 'anotherField' } } as SchemaDefinition,
      providedEntityFieldName: 'anotherField',
      expectedRedisSchema: ['anotherField', 'TAG', 'SEPARATOR', '|']
    }],

    ["that defines an array configured with an alternative separator for a HASH", {
      ...ARRAY_HASH_DEFAULTS,
      schemaDef: { aField: { type: 'array', separator: ';'} } as SchemaDefinition,
      providedEntityFieldValue: AN_ARRAY,
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

    ["that defines a string configured for full text search for JSON", {
      ...STRING_JSON_DEFAULTS,
      schemaDef: { aField: { type: 'string', textSearch: true } } as SchemaDefinition,
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'TEXT']
    }],

    ["that defines a string *not* configured for full text search for JSON", {
      ...STRING_JSON_DEFAULTS,
      schemaDef: { aField: { type: 'string', textSearch: false } } as SchemaDefinition,
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'TAG', 'SEPARATOR', '|']
    }],

    ["that defines a string configured with an alternative separator for JSON", {
      ...STRING_JSON_DEFAULTS,
      schemaDef: { aField: { type: 'string', separator: ';' } } as SchemaDefinition,
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'TAG', 'SEPARATOR', ';']
    }],

    ["that defines an unconfigured geopoint for JSON", {
      ...GEO_JSON_DEFAULTS,
      schemaDef: { aField: { type: 'geopoint' } } as SchemaDefinition,
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'GEO']
    }],

    ["that defines an aliased geopoint for JSON", {
      ...GEO_JSON_DEFAULTS,
      schemaDef: { aField: { type: 'geopoint', alias: 'anotherField' } } as SchemaDefinition,
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

    ["that defines an unconfigured array for JSON", {
      ...ARRAY_JSON_DEFAULTS,
      schemaDef: { aField: { type: 'array' } } as SchemaDefinition,
      expectedRedisSchema: ['$.aField[*]', 'AS', 'aField', 'TAG']
    }],

    ["that defines an aliased array for JSON", {
      ...ARRAY_JSON_DEFAULTS,
      schemaDef: { aField: { type: 'array', alias: 'anotherField' } } as SchemaDefinition,
      providedEntityFieldName: 'anotherField',
      expectedRedisSchema: ['$.anotherField[*]', 'AS', 'anotherField', 'TAG']
    }],

    ["that defines an array configured with an ignored separator for JSON", {
      ...ARRAY_JSON_DEFAULTS,
      schemaDef: { aField: { type: 'array', separator: ';' } } as SchemaDefinition,
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
      entity = new TestEntity(data.schemaDef, 'foo', entityData)
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
