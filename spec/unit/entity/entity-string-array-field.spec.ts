import { FieldDefinition } from "../../../lib";
import EntityStringArrayField from "../../../lib/entity/fields/entity-string-array-field";
import { A_DATE, A_NUMBER, A_POINT, A_STRING, SOME_STRINGS, SOME_STRINGS_JOINED } from "../../helpers/example-data";

const SOME_STRINGABLES = [42, true, 23, false];

const FIELD_NAME = 'foo';
const FIELD_DEF: FieldDefinition = { type: 'string[]' };
const EXPECTED_ANY_ARRAY = ['42', 'true', '23', 'false'];
const EXPECTED_NULL_JSON_DATA = {};
const EXPECTED_NULL_HASH_DATA = {};
const EXPECTED_JSON_DATA = { foo: SOME_STRINGS };
const EXPECTED_HASH_DATA = { foo: SOME_STRINGS.join('|') };
const EXPECTED_HASH_SEPARATOR_DATA = { foo: SOME_STRINGS.join(';') };
const EXPECTED_JSON_ANY_DATA = { foo: EXPECTED_ANY_ARRAY };
const EXPECTED_HASH_ANY_DATA = { foo: EXPECTED_ANY_ARRAY.join("|") };
const EXPECTED_HASH_ANY_SEPARATOR_DATA = { foo: EXPECTED_ANY_ARRAY.join(";") };

describe("EntityStringArrayField", () => {

  let field: EntityStringArrayField;

  describe("when created", () => {

    beforeEach(() => field = new EntityStringArrayField(FIELD_NAME, FIELD_DEF));

    it("has the expected alias", () => expect(field.name).toBe(FIELD_NAME));
    it("has a value of null", () => expect(field.value).toBeNull());
    it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_NULL_JSON_DATA));
    it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual(EXPECTED_NULL_HASH_DATA));

    describe("when loaded from Redis JSON data", () => {
      beforeEach(() => field.fromRedisJson(SOME_STRINGS));
      it("has the expected value", () => expect(field.value).toEqual(SOME_STRINGS));
    });

    describe("when loaded from Redis JSON data with stringable types", () => {
      beforeEach(() => field.fromRedisJson(SOME_STRINGABLES));
      it("has the expected value", () => expect(field.value).toEqual(EXPECTED_ANY_ARRAY));
    });

    describe("when loaded from Redis JSON data containing a null", () => {
      beforeEach(() => field.fromRedisJson(null));
      it("has the expected value", () => expect(field.value).toBeNull());
    });

    it("complains when loaded from invalid Redis JSON data", () => {
      expect(() => field.fromRedisJson('foo'))
        .toThrow(`Expected value with type of 'string[]' but received 'foo'.`);
    });

    describe("when loaded from Redis Hash data", () => {
      beforeEach(() => field.fromRedisHash(SOME_STRINGS.join('|')));
      it("has the expected value", () => expect(field.value).toEqual(SOME_STRINGS));
    });

    describe("when set to a array", () => {
      beforeEach(() => field.value = SOME_STRINGS);
      it("has the expected value", () => expect(field.value).toEqual(SOME_STRINGS));
      it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_JSON_DATA));
      it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual(EXPECTED_HASH_DATA));
    });

    describe("when set to an any[]", () => {
      beforeEach(() => field.value = SOME_STRINGABLES);
      it("has the expected value", () => expect(field.value).toEqual(EXPECTED_ANY_ARRAY));
      it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_JSON_ANY_DATA));
      it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual(EXPECTED_HASH_ANY_DATA));
    });

    describe("when set to null", () => {
      beforeEach(() => {
        field.value = SOME_STRINGS; // set it to something else first
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
        .toThrow(`Expected value with type of 'string[]' but received '${A_STRING}'.`);
    });

    it("cannot be set to a boolean", () => {
      // @ts-ignore: JavaScript trap
      expect(() => field.value = true)
        .toThrow(`Expected value with type of 'string[]' but received 'true'.`);
    });

    it("cannot be set to a number", () => {
      // @ts-ignore: JavaScript trap
      expect(() => field.value = A_NUMBER)
        .toThrow(`Expected value with type of 'string[]' but received '${A_NUMBER}'.`);
    });

    it("cannot be set to a Point", () => {
      // @ts-ignore: JavaScript trap
      expect(() => field.value = A_POINT)
        .toThrow(`Expected value with type of 'string[]' but received '${A_POINT}'.`);
    });

    it("cannot be set to a Date", () => {
      // @ts-ignore: JavaScript trap
      expect(() => field.value = A_DATE)
        .toThrow(`Expected value with type of 'string[]' but received '${A_DATE}'.`);
    });
  });

  describe("when created with an alias", () => {
    beforeEach(() => field = new EntityStringArrayField(FIELD_NAME, { type: 'string[]', alias: 'bar' }));
    it("has the aliased name", () => expect(field.name).toBe('bar'));
  });

  describe("when created with a separator and a array", () => {
    beforeEach(() => field = new EntityStringArrayField(FIELD_NAME, { type: 'string[]', separator: ';' }, SOME_STRINGS));
    it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual(EXPECTED_HASH_SEPARATOR_DATA));

    describe("and then loaded from Redis Hash data", () => {
      beforeEach(() => field.fromRedisHash(SOME_STRINGS.join(';')));
      it("has the expected value", () => expect(field.value).toEqual(SOME_STRINGS));
    });
  });

  describe("when created with a separator and an any[]", () => {
    beforeEach(() => field = new EntityStringArrayField(FIELD_NAME, { type: 'string[]', separator: ';' }, SOME_STRINGABLES));
    it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual(EXPECTED_HASH_ANY_SEPARATOR_DATA));
  });

  describe("when created with a array", () => {
    beforeEach(() => field = new EntityStringArrayField(FIELD_NAME, FIELD_DEF, SOME_STRINGS));
    it("has the expected value", () => expect(field.value).toEqual(SOME_STRINGS));
    it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_JSON_DATA));
    it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual(EXPECTED_HASH_DATA));
  });

  describe("when created with an any[]", () => {
    beforeEach(() => field = new EntityStringArrayField(FIELD_NAME, FIELD_DEF, SOME_STRINGABLES));
    it("has the expected value", () => expect(field.value).toEqual(EXPECTED_ANY_ARRAY));
    it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_JSON_ANY_DATA));
    it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual(EXPECTED_HASH_ANY_DATA));
  });

  describe("when created with a null", () => {
    beforeEach(() => field = new EntityStringArrayField(FIELD_NAME, FIELD_DEF, null));
    it("has the expected value", () => expect(field.value).toBeNull());
    it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_NULL_JSON_DATA));
    it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual(EXPECTED_NULL_HASH_DATA));
  });

  it("complains when created with a string", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityStringArrayField(FIELD_NAME, FIELD_DEF, A_STRING))
      .toThrow(`Expected value with type of 'string[]' but received '${A_STRING}'.`);
  });

  it("complains when created with a boolean", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityStringArrayField(FIELD_NAME, FIELD_DEF, true))
      .toThrow(`Expected value with type of 'string[]' but received 'true'.`);
  });

  it("complains when created with a number", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityStringArrayField(FIELD_NAME, FIELD_DEF, A_NUMBER))
      .toThrow(`Expected value with type of 'string[]' but received '${A_NUMBER}'.`);
  });

  it("complains when created with a Point", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityStringArrayField(FIELD_NAME, FIELD_DEF, A_POINT))
      .toThrow(`Expected value with type of 'string[]' but received '${A_POINT}'.`);
  });

  it("complains when created with a Date", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityStringArrayField(FIELD_NAME, FIELD_DEF, A_DATE))
      .toThrow(`Expected value with type of 'string[]' but received '${A_DATE}'.`);
  });
});
