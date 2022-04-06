import EntityTextField from "../../../lib/entity/entity-text-field";
import { A_DATE, A_NUMBER, A_NUMBER_STRING, A_POINT, A_STRING, SOME_STRINGS } from "../../helpers/example-data";

const ALIAS = 'foo';

describe("EntityTextField", () => {

  let field: EntityTextField;

  describe("when created", () => {

    beforeEach(() => field = new EntityTextField(ALIAS));

    it("has the expected alias", () => expect(field.alias).toBe(ALIAS));
    it("has a value of null", () => expect(field.value).toBeNull());

    it("can be set to a string", () => {
      field.value = A_STRING;
      expect(field.value).toBe(A_STRING)
    });

    it("can be set to a boolean", () => {
      field.value = true;
      expect(field.value).toBe("true");
    });

    it("can be set to a number", () => {
      field.value = A_NUMBER;
      expect(field.value).toBe(A_NUMBER_STRING);
    });

    it("can be set to null", () => {
      field.value = A_STRING; // set it to something else first
      field.value = null;
      expect(field.value).toBeNull();
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

  describe("when created with a string", () => {
    beforeEach(() => field = new EntityTextField(ALIAS, A_STRING));
    it("has the expected value", () => expect(field.value).toBe(A_STRING));
  });

  describe("when created with a boolean", () => {
    beforeEach(() => field = new EntityTextField(ALIAS, true));
    it("has the expected value", () => expect(field.value).toBe("true"));
  });

  describe("when created with a number", () => {
    beforeEach(() => field = new EntityTextField(ALIAS, A_NUMBER));
    it("has the expected value", () => expect(field.value).toBe(A_NUMBER_STRING));
  });

  describe("when created with a null", () => {
    beforeEach(() => field = new EntityTextField(ALIAS, null));
    it("has the expected value", () => expect(field.value).toBeNull());
  });

  it("complains when created with a Point", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityTextField(ALIAS, A_POINT))
      .toThrow(`Expected value with type of 'text' but received '${A_POINT}'.`);
  });

  it("complains when created with a Date", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityTextField(ALIAS, A_DATE))
      .toThrow(`Expected value with type of 'text' but received '${A_DATE}'.`);
  });

  it("complains when created with an array of strings", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityTextField(ALIAS, SOME_STRINGS))
      .toThrow(`Expected value with type of 'text' but received '${SOME_STRINGS}'.`);
  });
});
