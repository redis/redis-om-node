import EntityStringArrayField from "../../../lib/entity/fields/entity-string-array-field";
import { A_DATE, A_NUMBER, A_POINT, A_STRING, SOME_STRINGS } from "../../helpers/example-data";

const ALIAS = 'foo';

describe("EntityStringArrayField", () => {

  let field: EntityStringArrayField;

  describe("when created", () => {

    beforeEach(() => field = new EntityStringArrayField(ALIAS));

    it("has the expected alias", () => expect(field.alias).toBe(ALIAS));
    it("has a value of null", () => expect(field.value).toBeNull());

    it("can be set to a string[]", () => {
      field.value = SOME_STRINGS;
      expect(field.value).toEqual(SOME_STRINGS)
    });

    it("can be set to an any[]", () => {
      field.value = [ 42, true, 23, false ];
      expect(field.value).toEqual([ '42', 'true', '23', 'false' ])
    });

    it("can be set to null", () => {
      field.value = SOME_STRINGS; // set it to something else first
      field.value = null;
      expect(field.value).toBeNull();
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

  describe("when created with a string[]", () => {
    beforeEach(() => field = new EntityStringArrayField(ALIAS, SOME_STRINGS));
    it("has the expected value", () => expect(field.value).toEqual(SOME_STRINGS));
  });

  describe("when created with an any[]", () => {
    beforeEach(() => field = new EntityStringArrayField(ALIAS, [ 42, true, 23, false ]));
    it("has the expected value", () => expect(field.value).toEqual([ '42', 'true', '23', 'false' ]));
  });

  describe("when created with a null", () => {
    beforeEach(() => field = new EntityStringArrayField(ALIAS, null));
    it("has the expected value", () => expect(field.value).toBeNull());
  });

  it("complains when created with a string", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityStringArrayField(ALIAS, A_STRING))
      .toThrow(`Expected value with type of 'string[]' but received '${A_STRING}'.`);
  });

  it("complains when created with a boolean", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityStringArrayField(ALIAS, true))
      .toThrow(`Expected value with type of 'string[]' but received 'true'.`);
  });

  it("complains when created with a number", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityStringArrayField(ALIAS, A_NUMBER))
      .toThrow(`Expected value with type of 'string[]' but received '${A_NUMBER}'.`);
  });

  it("complains when created with a Point", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityStringArrayField(ALIAS, A_POINT))
      .toThrow(`Expected value with type of 'string[]' but received '${A_POINT}'.`);
  });

  it("complains when created with a Date", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityStringArrayField(ALIAS, A_DATE))
      .toThrow(`Expected value with type of 'string[]' but received '${A_DATE}'.`);
  });
});
