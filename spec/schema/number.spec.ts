import { schemaData } from "../../src/utils";
import { numberSchema } from "../constants";

describe("number fields", () => {
    test("raw data", () => {
        expect(numberSchema.rawData).toStrictEqual({
            numberField1: "number",
            numberField2: { type: "number" },
            numberField3: { type: "number", default: 3 },
            numberField4: { type: "number", required: true },
            numberField5: { type: "number", default: 5, required: true }
        });
    });

    test("formatted data", () => {
        expect(numberSchema[schemaData]).toStrictEqual({
            numberField1: { type: "number", default: undefined, required: false },
            numberField2: { type: "number", default: undefined, required: false },
            numberField3: { type: "number", default: 3, required: false },
            numberField4: { type: "number", default: undefined, required: true },
            numberField5: { type: "number", default: 5, required: true }
        });
    });
})