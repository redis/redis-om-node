import { FieldDefinition } from "../../../lib";
import EntityNumberField from "../../../lib/entity/fields/entity-number-field";
import { A_DATE, A_NUMBER, A_NUMBER_STRING, A_POINT, A_STRING, SOME_STRINGS } from "../../helpers/example-data";

const FIELD_NAME = 'foo';
const FIELD_DEF: FieldDefinition = { type: 'number' };
const EXPECTED_NULL_JSON_DATA = {};
const EXPECTED_NULL_HASH_DATA = {};
const EXPECTED_JSON_DATA = { foo: A_NUMBER };
const EXPECTED_HASH_DATA = { foo: A_NUMBER_STRING };

describe("EntityNumberField", () => {

  let field: EntityNumberField;

  describe("when created", () => {

    beforeEach(() => field = new EntityNumberField(FIELD_NAME, FIELD_DEF));

    it("has the expected alias", () => expect(field.name).toBe(FIELD_NAME));
    it("has a value of null", () => expect(field.value).toBeNull());
    it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_NULL_JSON_DATA));
    it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual(EXPECTED_NULL_HASH_DATA));

    describe("when loaded from Redis JSON data", () => {
      beforeEach(() => field.fromRedisJson(A_NUMBER));
      it("has the expected value", () => expect(field.value).toEqual(A_NUMBER));
    });

    describe("when loaded from Redis JSON data containing a null", () => {
      beforeEach(() => field.fromRedisJson(null));
      it("has the expected value", () => expect(field.value).toBeNull());
    });

    it("complains when loaded from invalid Redis JSON data", () => {
      expect(() => field.fromRedisJson('foo'))
        .toThrow(`Expected value with type of 'number' but received 'foo'.`);
    });

    describe("when loaded from Redis Hash data", () => {
      beforeEach(() => field.fromRedisHash(A_NUMBER_STRING));
      it("has the expected value", () => expect(field.value).toEqual(A_NUMBER));
    });

    it("complains when loaded from invalid Redis Hash data", () => {
      // @ts-ignore: JavaScript trap
      expect(() => field.fromRedisHash('foo'))
        .toThrow("Non-numeric value of 'foo' read from Redis for number field.");
    });

    describe("when created with a number", () => {
      beforeEach(() => field.value = A_NUMBER);
      it("has the expected value", () => expect(field.value).toBe(A_NUMBER));
      it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_JSON_DATA));
      it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual(EXPECTED_HASH_DATA));
    });

    describe("when created with a null", () => {
      beforeEach(() => {
        field.value = A_NUMBER; // set it to something else first
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

    it("cannot be set to a string", () => {
      // @ts-ignore: JavaScript trap
      expect(() => field.value = A_STRING)
        .toThrow(`Expected value with type of 'number' but received '${A_STRING}'.`);
    });

    it("cannot be set to a boolean", () => {
      // @ts-ignore: JavaScript trap
      expect(() => field.value = true)
        .toThrow(`Expected value with type of 'number' but received 'true'.`);
    });

    it("cannot be set to a Point", () => {
      // @ts-ignore: JavaScript trap
      expect(() => field.value = A_POINT)
        .toThrow(`Expected value with type of 'number' but received '${A_POINT}'.`);
    });

    it("cannot be set to a Date", () => {
      // @ts-ignore: JavaScript trap
      expect(() => field.value = A_DATE)
        .toThrow(`Expected value with type of 'number' but received '${A_DATE}'.`);
    });

    it("cannot be set to an array of strings", () => {
      // @ts-ignore: JavaScript trap
      expect(() => field.value = SOME_STRINGS)
        .toThrow(`Expected value with type of 'number' but received '${SOME_STRINGS}'.`);
    });
  });

  describe("when created with an alias", () => {
    beforeEach(() => field = new EntityNumberField(FIELD_NAME, { type: 'number', alias: 'bar' }));
    it("has the aliased name", () => expect(field.name).toBe('bar'));
  });

  describe("when created with a number", () => {
    beforeEach(() => field = new EntityNumberField(FIELD_NAME, FIELD_DEF, A_NUMBER));
    it("has the expected value", () => expect(field.value).toBe(A_NUMBER));
    it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_JSON_DATA));
    it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual(EXPECTED_HASH_DATA));
  });

  describe("when created with a null", () => {
    beforeEach(() => field = new EntityNumberField(FIELD_NAME, FIELD_DEF, null));
    it("has the expected value", () => expect(field.value).toBeNull());
    it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_NULL_JSON_DATA));
    it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual(EXPECTED_NULL_HASH_DATA));
  });

  it("complains when created with a string", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityNumberField(FIELD_NAME, FIELD_DEF, A_STRING))
      .toThrow(`Expected value with type of 'number' but received '${A_STRING}'.`);
  });

  it("complains when created with a boolean", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityNumberField(FIELD_NAME, FIELD_DEF, true))
      .toThrow(`Expected value with type of 'number' but received 'true'.`);
  });

  it("complains when created with a Point", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityNumberField(FIELD_NAME, FIELD_DEF, A_POINT))
      .toThrow(`Expected value with type of 'number' but received '${A_POINT}'.`);
  });

  it("complains when created with a Date", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityNumberField(FIELD_NAME, FIELD_DEF, A_DATE))
      .toThrow(`Expected value with type of 'number' but received '${A_DATE}'.`);
  });

  it("complains when created with an array of strings", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityNumberField(FIELD_NAME, FIELD_DEF, SOME_STRINGS))
      .toThrow(`Expected value with type of 'number' but received '${SOME_STRINGS}'.`);
  });
});
