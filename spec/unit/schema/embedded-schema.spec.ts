import { EmbeddedSchema } from '$lib/schema/schema';
import { Entity } from '$lib/entity/entity';

describe("Schema", () => {

  interface TestEntity { }
  class TestEntity extends Entity { }
  let schema: EmbeddedSchema<TestEntity>;

  describe("that is empty", () => {
    beforeEach(() => {
      schema = new EmbeddedSchema<TestEntity>(TestEntity, {})
    });

    it("has the constructor for the entity", () => expect(schema.entityCtor).toBe(TestEntity));
  });

  describe("that is well populated", () => {
    beforeEach(() => {
      schema = new EmbeddedSchema<TestEntity>(TestEntity, {
        aString: { type: 'string' }, anotherString: { type: 'string' },
        someText: { type: 'text' }, someOtherText: { type: 'text' },
        aNumber: { type: 'number' }, anotherNumber: { type: 'number' },
        aBoolean: { type: 'boolean' }, anotherBoolean: { type: 'boolean' },
        aPoint: { type: 'point' }, anotherPoint: { type: 'point' },
        aDate: { type: 'date' }, anotherDate: { type: 'date' },
        someStrings: { type: 'string[]' }, someOtherStrings: { type: 'string[]' }
      })
    });

    it("has the constructor for the entity", () => expect(schema.entityCtor).toBe(TestEntity));
  });

  describe("that is misconfigured", () => {
    it("throws an exception when the type is missing on a field definition", () =>
      // @ts-ignore: JavaScript test
      expect(() => new EmbeddedSchema<TestEntity>(TestEntity, { aField: {} }))
        .toThrow("The field 'aField' is configured with a type of 'undefined'. Valid types include 'boolean', 'date', 'number', 'object', 'point', 'string', 'string[]', and 'text'."));

    it("throws an exception when the type is invalid on a field definition", () =>
      // @ts-ignore: JavaScript test
      expect(() => new EmbeddedSchema<TestEntity>(TestEntity, { aField: { type: 'foo' } }))
        .toThrow("The field 'aField' is configured with a type of 'foo'. Valid types include 'boolean', 'date', 'number', 'object', 'point', 'string', 'string[]', and 'text'."));
  });
});
