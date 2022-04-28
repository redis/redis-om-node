import { FieldDefinition } from "../../../lib";
import EntityTextField from "../../../lib/entity/fields/entity-text-field";
import { A_DATE, A_NUMBER, A_NUMBER_STRING, A_POINT, A_STRING, SOME_STRINGS } from "../../helpers/example-data";

const FIELD_NAME = 'foo';
const FIELD_DEF: FieldDefinition = { type: 'string' };
const EXPECTED_NULL_JSON_DATA = {};
const EXPECTED_NULL_HASH_DATA = {};
const EXPECTED_JSON_STRING_DATA = { foo: A_STRING };
const EXPECTED_HASH_STRING_DATA = { foo: A_STRING };
const EXPECTED_JSON_BOOLEAN_DATA = { foo: "true" };
const EXPECTED_HASH_BOOLEAN_DATA = { foo: "true" };
const EXPECTED_JSON_NUMBER_DATA = { foo: A_NUMBER_STRING };
const EXPECTED_HASH_NUMBER_DATA = { foo: A_NUMBER_STRING };

describe("EntityTextField", () => {

  let field: EntityTextField;

  describe("when created", () => {

    beforeEach(() => field = new EntityTextField(FIELD_NAME, FIELD_DEF));

    it("has the expected alias", () => expect(field.name).toBe(FIELD_NAME));
    it("has a value of null", () => expect(field.value).toBeNull());
    it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_NULL_JSON_DATA));
    it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual(EXPECTED_NULL_HASH_DATA));

    describe("when loaded from Redis JSON data", () => {
      beforeEach(() => field.fromRedisJson(A_STRING));
      it("has the expected value", () => expect(field.value).toEqual(A_STRING));
    });

    describe("when loaded from Redis JSON data containing a number", () => {
      beforeEach(() => field.fromRedisJson(A_NUMBER));
      it("has the expected value", () => expect(field.value).toEqual(A_NUMBER_STRING));
    });

    describe("when loaded from Redis JSON data containing a boolean", () => {
      beforeEach(() => field.fromRedisJson(true));
      it("has the expected value", () => expect(field.value).toEqual("true"));
    });

    describe("when loaded from Redis JSON data containing a null", () => {
      beforeEach(() => field.fromRedisJson(null));
      it("has the expected value", () => expect(field.value).toBeNull());
    });

    it("complains when loaded from invalid Redis JSON data", () => {
      expect(() => field.fromRedisJson(SOME_STRINGS))
        .toThrow(`Expected value with type of 'text' but received 'alfa,bravo,charlie'.`);
    });

    describe("when loaded from Redis Hash data", () => {
      beforeEach(() => field.fromRedisHash(A_STRING));
      it("has the expected value", () => expect(field.value).toEqual(A_STRING));
    });

    describe("when created with a string", () => {
      beforeEach(() => field.value = A_STRING);
      it("has the expected value", () => expect(field.value).toBe(A_STRING));
      it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_JSON_STRING_DATA));
      it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual(EXPECTED_HASH_STRING_DATA));
    });

    describe("when created with a boolean", () => {
      beforeEach(() => field.value = true);
      it("has the expected value", () => expect(field.value).toBe("true"));
      it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_JSON_BOOLEAN_DATA));
      it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual(EXPECTED_HASH_BOOLEAN_DATA));
    });

    describe("when created with a number", () => {
      beforeEach(() => field.value = A_NUMBER);
      it("has the expected value", () => expect(field.value).toBe(A_NUMBER_STRING));
      it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_JSON_NUMBER_DATA));
      it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual(EXPECTED_HASH_NUMBER_DATA));
    });

    describe("when created with a null", () => {
      beforeEach(() => {
        field.value = A_STRING; // set it to something else first
        field.value = null;
      });
      it("has the expected value", () => expect(field.value).toBeNull());
      it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_NULL_JSON_DATA));
      it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual(EXPECTED_NULL_HASH_DATA));
    });

    it("cannot be set to undefined", () => {
      // @ts-ignore: JavaScript trap
      expect(() => field.value = undefined)
        .toThrow("Property cannot be set to undefined. Use null instead.");
    });

    it("cannot be set to a Point", () => {
      // @ts-ignore: JavaScript trap
      expect(() => field.value = A_POINT)
        .toThrow(`Expected value with type of 'text' but received '${A_POINT}'.`);
    });

    it("cannot be set to a Date", () => {
      // @ts-ignore: JavaScript trap
      expect(() => field.value = A_DATE)
        .toThrow(`Expected value with type of 'text' but received '${A_DATE}'.`);
    });

    it("cannot be set to an array of strings", () => {
      // @ts-ignore: JavaScript trap
      expect(() => field.value = SOME_STRINGS)
        .toThrow(`Expected value with type of 'text' but received '${SOME_STRINGS}'.`);
    });
  });

  describe("when created with an alias", () => {
    beforeEach(() => field = new EntityTextField(FIELD_NAME, { type: 'string',  alias: 'bar' }));
    it("has the aliased name", () => expect(field.name).toBe('bar'));
  });

  describe("when created with a string", () => {
    beforeEach(() => field = new EntityTextField(FIELD_NAME, FIELD_DEF, A_STRING));
    it("has the expected value", () => expect(field.value).toBe(A_STRING));
    it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_JSON_STRING_DATA));
    it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual(EXPECTED_HASH_STRING_DATA));
  });

  describe("when created with a boolean", () => {
    beforeEach(() => field = new EntityTextField(FIELD_NAME, FIELD_DEF, true));
    it("has the expected value", () => expect(field.value).toBe("true"));
    it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_JSON_BOOLEAN_DATA));
    it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual(EXPECTED_HASH_BOOLEAN_DATA));
  });

  describe("when created with a number", () => {
    beforeEach(() => field = new EntityTextField(FIELD_NAME, FIELD_DEF, A_NUMBER));
    it("has the expected value", () => expect(field.value).toBe(A_NUMBER_STRING));
    it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_JSON_NUMBER_DATA));
    it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual(EXPECTED_HASH_NUMBER_DATA));
  });

  describe("when created with a null", () => {
    beforeEach(() => field = new EntityTextField(FIELD_NAME, FIELD_DEF, null));
    it("has the expected value", () => expect(field.value).toBeNull());
    it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_NULL_JSON_DATA));
    it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual(EXPECTED_NULL_HASH_DATA));
  });

  it("complains when created with a Point", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityTextField(FIELD_NAME, FIELD_DEF, A_POINT))
      .toThrow(`Expected value with type of 'text' but received '${A_POINT}'.`);
  });

  it("complains when created with a Date", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityTextField(FIELD_NAME, FIELD_DEF, A_DATE))
      .toThrow(`Expected value with type of 'text' but received '${A_DATE}'.`);
  });

  it("complains when created with an array of strings", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityTextField(FIELD_NAME, FIELD_DEF, SOME_STRINGS))
      .toThrow(`Expected value with type of 'text' but received '${SOME_STRINGS}'.`);
  });
});
