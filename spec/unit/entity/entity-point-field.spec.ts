import EntityPointField from "../../../lib/entity/entity-point-field";
import { A_DATE, A_NUMBER, A_POINT, A_STRING, SOME_STRINGS } from "../../helpers/example-data";

const ALIAS = 'foo';

describe("EntityPointField", () => {

  let field: EntityPointField;

  describe("when created", () => {

    beforeEach(() => field = new EntityPointField(ALIAS));

    it("has the expected alias", () => expect(field.alias).toBe(ALIAS));
    it("has a value of null", () => expect(field.value).toBeNull());

    it("can be set to a point", () => {
      field.value = A_POINT;
      expect(field.value).toEqual(A_POINT)
    });

    it("can be set to null", () => {
      field.value = A_POINT; // set it to something else first
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

  describe("when created with a point", () => {
    beforeEach(() => field = new EntityPointField(ALIAS, A_POINT));
    it("has the expected value", () => expect(field.value).toEqual(A_POINT));
  });

  describe("when created with a null", () => {
    beforeEach(() => field = new EntityPointField(ALIAS, null));
    it("has the expected value", () => expect(field.value).toBeNull());
  });

  it("complains when created with a string", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityPointField(ALIAS, A_STRING))
      .toThrow(`Expected value with type of 'point' but received '${A_STRING}'.`);
  });

  it("complains when created with a boolean", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityPointField(ALIAS, true))
      .toThrow(`Expected value with type of 'point' but received 'true'.`);
  });

  it("complains when created with a number", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityPointField(ALIAS, A_NUMBER))
      .toThrow(`Expected value with type of 'point' but received '${A_NUMBER}'.`);
  });

  it("complains when created with a Date", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityPointField(ALIAS, A_DATE))
      .toThrow(`Expected value with type of 'point' but received '${A_DATE}'.`);
  });

  it("complains when created with an array of strings", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityPointField(ALIAS, SOME_STRINGS))
      .toThrow(`Expected value with type of 'point' but received '${SOME_STRINGS}'.`);
  });
});
