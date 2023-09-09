import { schemaData } from "../../src/utils/symbols";
import { booleanSchema } from "../constants";

describe("boolean fields", () => {
    test("formatted data", () => {
        expect(booleanSchema[schemaData].data).toStrictEqual({
            booleanField1: { type: "boolean", default: undefined, optional: false, sortable: false, index: true },
            booleanField2: { type: "boolean", default: undefined, optional: false, sortable: false, index: true },
            booleanField3: { type: "boolean", default: true, optional: false, sortable: false, index: true },
            booleanField4: { type: "boolean", default: undefined, optional: true, sortable: false, index: true },
            booleanField5: { type: "boolean", default: false, optional: true, sortable: false, index: true }
        });
    });
})