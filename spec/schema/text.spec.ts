import { schemaData } from "../../src/utils";
import { textSchema } from "../constants";

describe("text fields", () => {
    test("raw data", () => {
        expect(textSchema.rawData).toStrictEqual({
            textField1: "text",
            textField2: { type: "text" },
            textField3: { type: "text", default: "T" },
            textField4: { type: "text", required: true },
            textField5: { type: "text", default: "TT", required: true }
        });
    });

    test("formatted data", () => {
        expect(textSchema[schemaData]).toStrictEqual({
            textField1: { type: "text", default: undefined, required: false },
            textField2: { type: "text", default: undefined, required: false },
            textField3: { type: "text", default: "T", required: false },
            textField4: { type: "text", default: undefined, required: true },
            textField5: { type: "text", default: "TT", required: true }
        });
    });
})