import { FieldDefinition } from "../../../lib";
import EntityPointField from "../../../lib/entity/fields/entity-point-field";
import { A_DATE, A_NUMBER, A_POINT, A_POINT_STRING, A_STRING, SOME_STRINGS } from "../../helpers/example-data";

const FIELD_NAME = 'foo';
const FIELD_DEF: FieldDefinition = { type: 'point' };
const EXPECTED_NULL_JSON_DATA = {};
const EXPECTED_NULL_HASH_DATA = {};
const EXPECTED_JSON_DATA = { foo: A_POINT_STRING };
const EXPECTED_HASH_DATA = { foo: A_POINT_STRING };

describe("EntityPointField", () => {

  let field: EntityPointField;

  describe("when created", () => {

    beforeEach(() => field = new EntityPointField(FIELD_NAME, FIELD_DEF));

    it("has the expected alias", () => expect(field.name).toBe(FIELD_NAME));
    it("has a value of null", () => expect(field.value).toBeNull());
    it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_NULL_JSON_DATA));
    it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual(EXPECTED_NULL_HASH_DATA));

    describe("when loaded from Redis JSON data", () => {
      beforeEach(() => field.fromRedisJson(A_POINT_STRING));
      it("has the expected value", () => expect(field.value).toEqual(A_POINT));
    });

    describe("when loaded from Redis JSON data containing a null", () => {
      beforeEach(() => field.fromRedisJson(null));
      it("has the expected value", () => expect(field.value).toBeNull());
    });

    it("complains when loaded from invalid Redis JSON data", () => {
      expect(() => field.fromRedisJson('foo'))
        .toThrow(`Non-point value of 'foo' read from Redis for point field.`);
      expect(() => field.fromRedisJson(42))
        .toThrow(`Non-point value of '42' read from Redis for point field.`);
      expect(() => field.fromRedisJson(true))
        .toThrow(`Non-point value of 'true' read from Redis for point field.`);
    });

    describe("when loaded from Redis Hash data", () => {
      beforeEach(() => field.fromRedisHash(A_POINT_STRING));
      it("has the expected value", () => expect(field.value).toEqual(A_POINT));
    });

    it("complains when loaded from invalid Redis Hash data", () => {
      expect(() => field.fromRedisHash('foo'))
        .toThrow("Non-point value of 'foo' read from Redis for point field.");
    });

    describe("when created with a point", () => {
      beforeEach(() => field.value = A_POINT);
      it("has the expected value", () => expect(field.value).toEqual(A_POINT));
      it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_JSON_DATA));
      it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual(EXPECTED_HASH_DATA));
    });

    describe("when created with a null", () => {
      beforeEach(() => {
        field.value = A_POINT; // set it to something else first
        field.value = null;
      });
      it("has the expected value", () => expect(field.value).toBeNull());
      it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_NULL_JSON_DATA));
      it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual(EXPECTED_NULL_HASH_DATA));
    });

    it("cannot be set to a string", () => {
      // @ts-ignore: JavaScript trap
      expect(() => field.value = A_STRING)
        .toThrow(`Expected value with type of 'point' but received '${A_STRING}'.`);
    });

    it("cannot be set to a boolean", () => {
      // @ts-ignore: JavaScript trap
      expect(() => field.value = true)
        .toThrow(`Expected value with type of 'point' but received 'true'.`);
    });

    it("cannot be set to a number", () => {
      // @ts-ignore: JavaScript trap
      expect(() => field.value = A_NUMBER)
        .toThrow(`Expected value with type of 'point' but received '${A_NUMBER}'.`);
    });

    it("cannot be set to a Date", () => {
      // @ts-ignore: JavaScript trap
      expect(() => field.value = A_DATE)
        .toThrow(`Expected value with type of 'point' but received '${A_DATE}'.`);
    });

    it("cannot be set to an array of strings", () => {
      // @ts-ignore: JavaScript trap
      expect(() => field.value = SOME_STRINGS)
        .toThrow(`Expected value with type of 'point' but received '${SOME_STRINGS}'.`);
    });
  });

  describe("when created with an alias", () => {
    beforeEach(() => field = new EntityPointField(FIELD_NAME, { type: 'point', alias: 'bar' }));
    it("has the aliased name", () => expect(field.name).toBe('bar'));
  });

  describe("when created with a point", () => {
    beforeEach(() => field = new EntityPointField(FIELD_NAME, FIELD_DEF, A_POINT));
    it("has the expected value", () => expect(field.value).toEqual(A_POINT));
    it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_JSON_DATA));
    it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual(EXPECTED_HASH_DATA));
  });

  describe("when created with a null", () => {
    beforeEach(() => field = new EntityPointField(FIELD_NAME, FIELD_DEF, null));
    it("has the expected value", () => expect(field.value).toBeNull());
    it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_NULL_JSON_DATA));
    it("converts to the expected Redis Hash data", () => expect(field.toRedisHash()).toEqual(EXPECTED_NULL_HASH_DATA));
  });

  it("complains when created with a string", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityPointField(FIELD_NAME, FIELD_DEF, A_STRING))
      .toThrow(`Expected value with type of 'point' but received '${A_STRING}'.`);
  });

  it("complains when created with a boolean", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityPointField(FIELD_NAME, FIELD_DEF, true))
      .toThrow(`Expected value with type of 'point' but received 'true'.`);
  });

  it("complains when created with a number", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityPointField(FIELD_NAME, FIELD_DEF, A_NUMBER))
      .toThrow(`Expected value with type of 'point' but received '${A_NUMBER}'.`);
  });

  it("complains when created with a Date", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityPointField(FIELD_NAME, FIELD_DEF, A_DATE))
      .toThrow(`Expected value with type of 'point' but received '${A_DATE}'.`);
  });

  it("complains when created with an array of strings", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityPointField(FIELD_NAME, FIELD_DEF, SOME_STRINGS))
      .toThrow(`Expected value with type of 'point' but received '${SOME_STRINGS}'.`);
  });
});
