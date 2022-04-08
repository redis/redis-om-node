import { FieldDefinition } from "../../../lib";
import EntityDateField from "../../../lib/entity/fields/entity-date-field";
import { A_DATE, A_DATE_EPOCH, A_DATE_EPOCH_STRING, A_DATE_ISO, A_NUMBER, A_POINT, A_STRING, SOME_STRINGS } from "../../helpers/example-data";

const FIELD_NAME = 'foo';
const FIELD_DEF: FieldDefinition = { type: 'date' };
const EXPECTED_NULL_JSON_DATA = {};
const EXPECTED_NULL_HASH_DATA = {};
const EXPECTED_JSON_DATA = { foo: A_DATE_EPOCH };
const EXPECTED_HASH_DATA = { foo: A_DATE_EPOCH_STRING };

describe("EntityDateField", () => {

  let field: EntityDateField;

  describe("when created", () => {

    beforeEach(() => field = new EntityDateField(FIELD_NAME, FIELD_DEF));

    it("has the expected alias", () => expect(field.name).toBe(FIELD_NAME));
    it("has a value of null", () => expect(field.value).toBeNull());
    it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_NULL_JSON_DATA));
    it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual(EXPECTED_NULL_HASH_DATA));

    describe("when set to a date", () => {
      beforeEach(() => field.value = A_DATE);
      it("has the expected value", () => expect(field.value).toEqual(A_DATE));
      it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_JSON_DATA));
      it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual(EXPECTED_HASH_DATA));
    });

    describe("when created with an ISO date", () => {
      beforeEach(() => field.value = A_DATE_ISO);
      it("has the expected value", () => expect(field.value).toEqual(A_DATE));
      it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_JSON_DATA));
      it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual(EXPECTED_HASH_DATA));
    });

    describe("when created with a UNIX epoch date", () => {
      beforeEach(() => field.value = A_DATE_EPOCH);
      it("has the expected value", () => expect(field.value).toEqual(A_DATE));
      it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_JSON_DATA));
      it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual(EXPECTED_HASH_DATA));
    });

    describe("when created with a null", () => {
      beforeEach(() => {
        field.value = A_DATE; // set it to something else first
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

    it("cannot be set to a boolean", () => {
      // @ts-ignore: JavaScript trap
      expect(() => field.value = true)
        .toThrow(`Expected value with type of 'date' but received 'true'.`);
    });

    it("cannot be set to a Point", () => {
      // @ts-ignore: JavaScript trap
      expect(() => field.value = A_POINT)
        .toThrow(`Expected value with type of 'date' but received '${A_POINT}'.`);
    });

    it("cannot be set to an array of strings", () => {
      // @ts-ignore: JavaScript trap
      expect(() => field.value = SOME_STRINGS)
        .toThrow(`Expected value with type of 'date' but received '${SOME_STRINGS}'.`);
    });
  });

  describe("when created with an alias", () => {
    beforeEach(() => field = new EntityDateField(FIELD_NAME, { type: 'date', alias: 'bar' }));
    it("has the aliased name", () => expect(field.name).toBe('bar'));
  });

  describe("when created with a date", () => {
    beforeEach(() => field = new EntityDateField(FIELD_NAME, FIELD_DEF, A_DATE));
    it("has the expected value", () => expect(field.value).toEqual(A_DATE));
    it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_JSON_DATA));
    it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual(EXPECTED_HASH_DATA));
  });

  describe("when created with an ISO date", () => {
    beforeEach(() => field = new EntityDateField(FIELD_NAME, FIELD_DEF, A_DATE_ISO));
    it("has the expected value", () => expect(field.value).toEqual(A_DATE));
    it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_JSON_DATA));
    it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual(EXPECTED_HASH_DATA));
  });

  describe("when created with a UNIX epoch date", () => {
    beforeEach(() => field = new EntityDateField(FIELD_NAME, FIELD_DEF, A_DATE_EPOCH));
    it("has the expected value", () => expect(field.value).toEqual(A_DATE));
    it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_JSON_DATA));
    it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual(EXPECTED_HASH_DATA));
  });

  describe("when created with a null", () => {
    beforeEach(() => field = new EntityDateField(FIELD_NAME, FIELD_DEF, null));
    it("has the expected value", () => expect(field.value).toBeNull());
    it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_NULL_JSON_DATA));
    it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual(EXPECTED_NULL_HASH_DATA));
  });

  it("complains when created with a boolean", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityDateField(FIELD_NAME, FIELD_DEF, true))
      .toThrow(`Expected value with type of 'date' but received 'true'.`);
  });

  it("complains when created with a Point", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityDateField(FIELD_NAME, FIELD_DEF, A_POINT))
      .toThrow(`Expected value with type of 'date' but received '${A_POINT}'.`);
  });

  it("complains when created with an array of strings", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityDateField(FIELD_NAME, FIELD_DEF, SOME_STRINGS))
      .toThrow(`Expected value with type of 'date' but received '${SOME_STRINGS}'.`);
  });
});
