import { FieldDefinition } from "../../../lib";
import EntityPointField from "../../../lib/entity/fields/entity-point-field";
import { A_DATE, A_NUMBER, A_POINT, A_POINT_STRING, A_STRING, SOME_STRINGS } from "../../helpers/example-data";

const FIELD_NAME = 'foo';
const FIELD_DEF: FieldDefinition = { type: 'point' };
const EXPECTED_NULL_JSON_DATA = {};
const EXPECTED_JSON_DATA = { foo: A_POINT_STRING };

describe("EntityPointField", () => {

  let field: EntityPointField;

  describe("when created", () => {

    beforeEach(() => field = new EntityPointField(FIELD_NAME, FIELD_DEF));

    it("has the expected alias", () => expect(field.name).toBe(FIELD_NAME));
    it("has a value of null", () => expect(field.value).toBeNull());
    it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_NULL_JSON_DATA));

    it("can be set to a point", () => {
      field.value = A_POINT;
      expect(field.value).toEqual(A_POINT)
      expect(field.toRedisJson()).toEqual(EXPECTED_JSON_DATA);
    });

    it("can be set to null", () => {
      field.value = A_POINT; // set it to something else first
      field.value = null;
      expect(field.value).toBeNull();
      expect(field.toRedisJson()).toEqual(EXPECTED_NULL_JSON_DATA);
    });

    it("cannot be set to undefined", () => {
      // @ts-ignore: JavaScript trap
      expect(() => field.value = undefined)
        .toThrow("Property cannot be set to undefined. Use null instead.");
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
  });

  describe("when created with a null", () => {
    beforeEach(() => field = new EntityPointField(FIELD_NAME, FIELD_DEF, null));
    it("has the expected value", () => expect(field.value).toBeNull());
    it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_NULL_JSON_DATA));
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
