import { FieldDefinition } from "../../../lib";
import EntityStringArrayField from "../../../lib/entity/fields/entity-string-array-field";
import { A_DATE, A_NUMBER, A_POINT, A_STRING, SOME_STRINGS, SOME_STRINGS_JOINED } from "../../helpers/example-data";

const FIELD_NAME = 'foo';
const FIELD_DEF: FieldDefinition = { type: 'string[]' };
const EXPECTED_NULL_JSON_DATA = {};
const EXPECTED_NULL_HASH_DATA = {};
const EXPECTED_JSON_DATA = { foo: SOME_STRINGS };
const EXPECTED_HASH_DATA = { foo: SOME_STRINGS.join('|') };
const EXPECTED_HASH_SEPARATOR_DATA = { foo: SOME_STRINGS.join('|') };
const EXPECTED_JSON_ANY_DATA = { foo: [ '42', 'true', '23', 'false' ] };
const EXPECTED_HASH_ANY_DATA = { foo: "42|true|23|false" };

describe("EntityStringArrayField", () => {

  let field: EntityStringArrayField;

  describe("when created", () => {

    beforeEach(() => field = new EntityStringArrayField(FIELD_NAME, FIELD_DEF));

    it("has the expected alias", () => expect(field.name).toBe(FIELD_NAME));
    it("has a value of null", () => expect(field.value).toBeNull());
    it("converts to the expected RedisJSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_NULL_JSON_DATA));
    it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual(EXPECTED_NULL_HASH_DATA));

    it("can be set to a string[]", () => {
      field.value = SOME_STRINGS;
      expect(field.value).toEqual(SOME_STRINGS)
      expect(field.toRedisJson()).toEqual(EXPECTED_JSON_DATA);
      expect(field.toRedisHash()).toEqual(EXPECTED_HASH_DATA);
    });

    it("can be set to an any[]", () => {
      field.value = [ 42, true, 23, false ];
      expect(field.value).toEqual([ '42', 'true', '23', 'false' ])
      expect(field.toRedisJson()).toEqual(EXPECTED_JSON_ANY_DATA);
      expect(field.toRedisHash()).toEqual(EXPECTED_HASH_ANY_DATA);
    });

    it("can be set to null", () => {
      field.value = SOME_STRINGS; // set it to something else first
      field.value = null;
      expect(field.value).toBeNull();
      expect(field.toRedisJson()).toEqual(EXPECTED_NULL_JSON_DATA);
      expect(field.toRedisHash()).toEqual(EXPECTED_NULL_HASH_DATA);
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

  describe("when created with a separator and a string[]", () => {
    beforeEach(() => field = new EntityStringArrayField(FIELD_NAME, { type: 'string[]', separator: ';' }, SOME_STRINGS));
    it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual({ foo: "alfa;bravo;charlie" }));
  });

  describe("when created with a separator and an any[]", () => {
    beforeEach(() => field = new EntityStringArrayField(FIELD_NAME, { type: 'string[]', separator: ';' }, [ 42, true, 23, false ]));
    it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual({ foo: "42;true;23;false" }));
  });

  describe("when created with a string[]", () => {
    beforeEach(() => field = new EntityStringArrayField(FIELD_NAME, FIELD_DEF, SOME_STRINGS));
    it("has the expected value", () => expect(field.value).toEqual(SOME_STRINGS));
    it("converts to the expected RedisJSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_JSON_DATA));
    it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual(EXPECTED_HASH_DATA));
  });

  describe("when created with an any[]", () => {
    beforeEach(() => field = new EntityStringArrayField(FIELD_NAME, FIELD_DEF, [ 42, true, 23, false ]));
    it("has the expected value", () => expect(field.value).toEqual([ '42', 'true', '23', 'false' ]));
    it("converts to the expected RedisJSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_JSON_ANY_DATA));
    it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual(EXPECTED_HASH_ANY_DATA));
  });

  describe("when created with a null", () => {
    beforeEach(() => field = new EntityStringArrayField(FIELD_NAME, FIELD_DEF, null));
    it("has the expected value", () => expect(field.value).toBeNull());
    it("converts to the expected RedisJSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_NULL_JSON_DATA));
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
