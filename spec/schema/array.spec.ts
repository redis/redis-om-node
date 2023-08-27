import { schemaData } from "../../src/utils";
import { arraySchema } from "../constants";

describe("array fields", () => {
    test("raw data", () => {
        expect(arraySchema.rawData).toStrictEqual({
            arrayField1: "array",
            arrayField2: { type: "array" },
            arrayField3: { type: "array", elements: "number" },
            arrayField4: { type: "array", default: ["s"] },
            arrayField5: { type: "array", required: true },
            arrayField6: { type: "array", elements: "boolean", default: [false], required: true },
            arrayField7: { type: "array", elements: { element1: "string" } }
        });
    });

    test("formatted data", () => {
        expect(arraySchema[schemaData]).toStrictEqual({
            arrayField1: { type: "array", elements: "string", default: undefined, required: false },
            arrayField2: { type: "array", elements: "string", default: undefined, required: false },
            arrayField3: { type: "array", elements: "number", default: undefined, required: false },
            arrayField4: { type: "array", elements: "string", default: ["s"], required: false },
            arrayField5: { type: "array", elements: "string", default: undefined, required: true },
            arrayField6: { type: "array", elements: "boolean", default: [false], required: true },
            arrayField7: { type: "array", elements: { element1: { type: "string", default: undefined, required: false } }, default: undefined, required: false }
        });
    });
})