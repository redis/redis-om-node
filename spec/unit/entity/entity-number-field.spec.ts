import EntityNumberField from "../../../lib/entity/fields/entity-number-field";
import { A_DATE, A_NUMBER, A_POINT, A_STRING, SOME_STRINGS } from "../../helpers/example-data";

const ALIAS = 'foo';

describe("EntityNumberField", () => {

  let field: EntityNumberField;

  describe("when created", () => {

    beforeEach(() => field = new EntityNumberField(ALIAS));

    it("has the expected alias", () => expect(field.alias).toBe(ALIAS));
    it("has a value of null", () => expect(field.value).toBeNull());

    it("can be set to a number", () => {
      field.value = A_NUMBER;
      expect(field.value).toBe(A_NUMBER)
    });

    it("can be set to null", () => {
      field.value = A_NUMBER; // set it to something else first
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

  describe("when created with a number", () => {
    beforeEach(() => field = new EntityNumberField(ALIAS, A_NUMBER));
    it("has the expected value", () => expect(field.value).toBe(A_NUMBER));
  });

  describe("when created with a null", () => {
    beforeEach(() => field = new EntityNumberField(ALIAS, null));
    it("has the expected value", () => expect(field.value).toBeNull());
  });

  it("complains when created with a string", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityNumberField(ALIAS, A_STRING))
      .toThrow(`Expected value with type of 'number' but received '${A_STRING}'.`);
  });

  it("complains when created with a boolean", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityNumberField(ALIAS, true))
      .toThrow(`Expected value with type of 'number' but received 'true'.`);
  });

  it("complains when created with a Point", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityNumberField(ALIAS, A_POINT))
      .toThrow(`Expected value with type of 'number' but received '${A_POINT}'.`);
  });

  it("complains when created with a Date", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityNumberField(ALIAS, A_DATE))
      .toThrow(`Expected value with type of 'number' but received '${A_DATE}'.`);
  });

  it("complains when created with an array of strings", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityNumberField(ALIAS, SOME_STRINGS))
      .toThrow(`Expected value with type of 'number' but received '${SOME_STRINGS}'.`);
  });
});
