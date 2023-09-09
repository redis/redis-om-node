import { schemaData } from "../../src/utils/symbols";
import { textSchema } from "../constants";

describe("text fields", () => {
    test("formatted data", () => {
        expect(textSchema[schemaData].data).toStrictEqual({
            textField1: { type: "text", default: undefined, optional: false, sortable: false, index: true },
            textField2: { type: "text", default: undefined, optional: false, sortable: false, index: true },
            textField3: { type: "text", default: "T", optional: false, sortable: false, index: true },
            textField4: { type: "text", default: undefined, optional: true, sortable: false, index: true },
            textField5: { type: "text", default: "TT", optional: true, sortable: false, index: true }
        });
    });
})