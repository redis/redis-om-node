import EntityDateField from "../../../lib/entity/fields/entity-date-field";
import { A_DATE, A_DATE_EPOCH, A_DATE_ISO, A_NUMBER, A_POINT, A_STRING, SOME_STRINGS } from "../../helpers/example-data";

const ALIAS = 'foo';

describe("EntityDateField", () => {

  let field: EntityDateField;

  describe("when created", () => {

    beforeEach(() => field = new EntityDateField(ALIAS));

    it("has the expected alias", () => expect(field.alias).toBe(ALIAS));
    it("has a value of null", () => expect(field.value).toBeNull());

    it("can be set to a date", () => {
      field.value = A_DATE;
      expect(field.value).toEqual(A_DATE)
    });

    it("can be set to an ISO date", () => {
      field.value = A_DATE_ISO;
      expect(field.value).toEqual(A_DATE)
    });

    it("can be set to a UNIX epoch date", () => {
      field.value = A_DATE_EPOCH;
      expect(field.value).toEqual(A_DATE)
    });

    it("can be set to null", () => {
      field.value = A_DATE; // set it to something else first
      field.value = null;
      expect(field.value).toBeNull();
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

  describe("when created with a date", () => {
    beforeEach(() => field = new EntityDateField(ALIAS, A_DATE));
    it("has the expected value", () => expect(field.value).toEqual(A_DATE));
  });

  describe("when created with an ISO date", () => {
    beforeEach(() => field = new EntityDateField(ALIAS, A_DATE_ISO));
    it("has the expected value", () => expect(field.value).toEqual(A_DATE));
  });

  describe("when created with a UNIX epoch date", () => {
    beforeEach(() => field = new EntityDateField(ALIAS, A_DATE_EPOCH));
    it("has the expected value", () => expect(field.value).toEqual(A_DATE));
  });

  describe("when created with a null", () => {
    beforeEach(() => field = new EntityDateField(ALIAS, null));
    it("has the expected value", () => expect(field.value).toBeNull());
  });

  it("complains when created with a boolean", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityDateField(ALIAS, true))
      .toThrow(`Expected value with type of 'date' but received 'true'.`);
  });

  it("complains when created with a Point", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityDateField(ALIAS, A_POINT))
      .toThrow(`Expected value with type of 'date' but received '${A_POINT}'.`);
  });

  it("complains when created with an array of strings", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityDateField(ALIAS, SOME_STRINGS))
      .toThrow(`Expected value with type of 'date' but received '${SOME_STRINGS}'.`);
  });
});
