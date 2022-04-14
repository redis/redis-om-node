import { FieldDefinition } from "../../../lib";
import EntityBooleanField from "../../../lib/entity/fields/entity-boolean-field";
import { A_DATE, A_NUMBER, A_POINT, A_STRING, SOME_STRINGS } from "../../helpers/example-data";

const FIELD_NAME = 'foo';
const FIELD_DEF: FieldDefinition = { type: 'boolean' };
const EXPECTED_NULL_JSON_DATA = {};
const EXPECTED_NULL_HASH_DATA = {};
const EXPECTED_JSON_TRUE_DATA = { foo: true };
const EXPECTED_HASH_TRUE_DATA = { foo: '1' };
const EXPECTED_JSON_FALSE_DATA = { foo: false };
const EXPECTED_HASH_FALSE_DATA = { foo: '0' };

describe("EntityBooleanField", () => {

  let field: EntityBooleanField;

  describe("when created", () => {

    beforeEach(() => field = new EntityBooleanField(FIELD_NAME, FIELD_DEF));

    it("has the expected name", () => expect(field.name).toBe(FIELD_NAME));
    it("has a value of null", () => expect(field.value).toBeNull());
    it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_NULL_JSON_DATA));
    it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual(EXPECTED_NULL_HASH_DATA));

    describe("when loaded from Redis JSON data", () => {
      beforeEach(() => field.fromRedisJson(true));
      it("has the expected value", () => expect(field.value).toEqual(true));
    });

    describe("when loaded from Redis JSON data containing a null", () => {
      beforeEach(() => field.fromRedisJson(null));
      it("has the expected value", () => expect(field.value).toBeNull());
    });

    it("complains when loaded from invalid Redis JSON data", () => {
      expect(() => field.fromRedisJson('foo'))
        .toThrow(`Expected value with type of 'boolean' but received 'foo'.`);
    });

    describe("when loaded from true Redis Hash data", () => {
      beforeEach(() => field.fromRedisHash('1'));
      it("has the expected value", () => expect(field.value).toEqual(true));
    });

    describe("when loaded from false Redis Hash data", () => {
      beforeEach(() => field.fromRedisHash('0'));
      it("has the expected value", () => expect(field.value).toEqual(false));
    });

    it("complains when loaded from invalid Redis Hash data", () => {
      // @ts-ignore: JavaScript trap
      expect(() => field.fromRedisHash('foo'))
        .toThrow("Non-boolean value of 'foo' read from Redis for boolean field.");
    });

    describe("when set to true", () => {
      beforeEach(() => field.value = true);
      it("has the expected value", () => expect(field.value).toEqual(true));
      it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_JSON_TRUE_DATA));
      it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual(EXPECTED_HASH_TRUE_DATA));
    });

    describe("when set to false", () => {
      beforeEach(() => field.value = false);
      it("has the expected value", () => expect(field.value).toEqual(false));
      it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_JSON_FALSE_DATA));
      it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual(EXPECTED_HASH_FALSE_DATA));
    });

    describe("when set to null", () => {
      beforeEach(() => {
        field.value = true; // set it to something else first
        field.value = null;
      });
      it("has a value of null", () => expect(field.value).toBeNull());
      it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_NULL_JSON_DATA));
      it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual(EXPECTED_NULL_HASH_DATA));
    });

    it("cannot be set to undefined", () => {
      // @ts-ignore: JavaScript trap
      expect(() => field.value = undefined)
        .toThrow("Property cannot be set to undefined. Use null instead.");
    });

    it("cannot be set to a string", () => {
      // @ts-ignore: JavaScript trap
      expect(() => field.value = A_STRING)
        .toThrow(`Expected value with type of 'boolean' but received '${A_STRING}'.`);
    });

    it("cannot be set to a number", () => {
      // @ts-ignore: JavaScript trap
      expect(() => field.value = A_NUMBER)
        .toThrow(`Expected value with type of 'boolean' but received '${A_NUMBER}'.`);
    });

    it("cannot be set to a Point", () => {
      // @ts-ignore: JavaScript trap
      expect(() => field.value = A_POINT)
        .toThrow(`Expected value with type of 'boolean' but received '${A_POINT}'.`);
    });

    it("cannot be set to a Date", () => {
      // @ts-ignore: JavaScript trap
      expect(() => field.value = A_DATE)
        .toThrow(`Expected value with type of 'boolean' but received '${A_DATE}'.`);
    });

    it("cannot be set to an array of strings", () => {
      // @ts-ignore: JavaScript trap
      expect(() => field.value = SOME_STRINGS)
        .toThrow(`Expected value with type of 'boolean' but received '${SOME_STRINGS}'.`);
    });
  });

  describe("when created with an alias", () => {
    beforeEach(() => field = new EntityBooleanField(FIELD_NAME, { type: 'boolean', alias: 'bar' }));
    it("has the aliased name", () => expect(field.name).toBe('bar'));
  });

  describe("when created with true", () => {
    beforeEach(() => field = new EntityBooleanField(FIELD_NAME, FIELD_DEF, true));
    it("has the expected value", () => expect(field.value).toBe(true));
    it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_JSON_TRUE_DATA));
    it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual(EXPECTED_HASH_TRUE_DATA));
  });

  describe("when created with false", () => {
    beforeEach(() => field = new EntityBooleanField(FIELD_NAME, FIELD_DEF, false));
    it("has the expected value", () => expect(field.value).toBe(false));
    it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_JSON_FALSE_DATA));
    it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual(EXPECTED_HASH_FALSE_DATA));
  });

  describe("when created with a null", () => {
    beforeEach(() => field = new EntityBooleanField(FIELD_NAME, FIELD_DEF, null));
    it("has the expected value", () => expect(field.value).toBeNull());
    it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_NULL_JSON_DATA));
    it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual(EXPECTED_NULL_HASH_DATA));
  });

  it("complains when created with a string", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityBooleanField(FIELD_NAME, FIELD_DEF, A_STRING))
      .toThrow(`Expected value with type of 'boolean' but received '${A_STRING}'.`);
  });

  it("complains when created with a number", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityBooleanField(FIELD_NAME, FIELD_DEF, A_NUMBER))
      .toThrow(`Expected value with type of 'boolean' but received '${A_NUMBER}'.`);
  });

  it("complains when created with a Point", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityBooleanField(FIELD_NAME, FIELD_DEF, A_POINT))
      .toThrow(`Expected value with type of 'boolean' but received '${A_POINT}'.`);
  });

  it("complains when created with a Date", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityBooleanField(FIELD_NAME, FIELD_DEF, A_DATE))
      .toThrow(`Expected value with type of 'boolean' but received '${A_DATE}'.`);
  });

  it("complains when created with an array of strings", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityBooleanField(FIELD_NAME, FIELD_DEF, SOME_STRINGS))
      .toThrow(`Expected value with type of 'boolean' but received '${SOME_STRINGS}'.`);
  });
});
