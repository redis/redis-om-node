import { schemaData } from "../../src/utils/symbols";
import { arraySchema } from "../constants";

describe("array fields", () => {
    test("formatted data", () => {
        expect(arraySchema[schemaData].data).toStrictEqual({
            arrayField1: { type: "array", elements: "string", default: undefined, optional: false, sortable: false, index: true, separator: "," },
            arrayField2: { type: "array", elements: "string", default: undefined, optional: false, sortable: false, index: true, separator: "," },
            arrayField3: { type: "array", elements: "number", default: undefined, optional: false, sortable: false, index: true, separator: "," },
            arrayField4: { type: "array", elements: "string", default: ["s"], optional: false, sortable: false, index: true, separator: "," },
            arrayField5: { type: "array", elements: "string", default: undefined, optional: true, sortable: false, index: true, separator: "," },
            arrayField6: { type: "array", elements: "boolean", default: [false], optional: true, sortable: false, index: true, separator: "," },
            arrayField7: { type: "array", elements: { element1: { type: "string", default: undefined, optional: false, sortable: false, index: true, literal: undefined } }, default: undefined, optional: false, sortable: false, index: true, separator: "," }
        });
    });
})