import { schemaData } from "../../src/utils/symbols";
import { dateSchema } from "../constants";

describe("date fields", () => {
    test("formatted data", () => {
        expect(dateSchema[schemaData].data).toStrictEqual({
            dateField1: { type: "date", default: undefined, optional: false, sortable: false, index: true },
            dateField2: { type: "date", default: undefined, optional: false, sortable: false, index: true },
            dateField3: { type: "date", default: 874195200000, optional: false, sortable: false, index: true },
            dateField4: { type: "date", default: undefined, optional: true, sortable: false, index: true },
            dateField5: { type: "date", default: 874195200000, optional: true, sortable: false, index: true }
        });
    });
})