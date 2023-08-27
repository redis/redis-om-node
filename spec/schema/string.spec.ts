import { schemaData } from "../../src/utils";
import { stringSchema } from "../constants";

describe("string fields", () => {
    test("raw data", () => {
        expect(stringSchema.rawData).toStrictEqual({
            stringField1: "string",
            stringField2: { type: "string" },
            stringField3: { type: "string", default: "S" },
            stringField4: { type: "string", required: true },
            stringField5: { type: "string", default: "SS", required: true }
        });
    });

    test("formatted data", () => {
        expect(stringSchema[schemaData]).toStrictEqual({
            stringField1: { type: "string", default: undefined, required: false },
            stringField2: { type: "string", default: undefined, required: false },
            stringField3: { type: "string", default: "S", required: false },
            stringField4: { type: "string", default: undefined, required: true },
            stringField5: { type: "string", default: "SS", required: true }
        });
    });
})