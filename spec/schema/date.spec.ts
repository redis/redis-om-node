import { schemaData } from "../../src/utils";
import { dateSchema } from "../constants";

describe("date fields", () => {
    test("raw data", () => {
        expect(dateSchema.rawData).toStrictEqual({
            dateField1: "date",
            dateField2: { type: "date" },
            dateField3: { type: "date", default: 874195200000 },
            dateField4: { type: "date", required: true },
            dateField5: { type: "date", default: new Date(874195200000), required: true }
        });
    });

    test("formatted data", () => {
        expect(dateSchema[schemaData]).toStrictEqual({
            dateField1: { type: "date", default: undefined, required: false },
            dateField2: { type: "date", default: undefined, required: false },
            dateField3: { type: "date", default: 874195200000, required: false },
            dateField4: { type: "date", default: undefined, required: true },
            dateField5: { type: "date", default: 874195200000, required: true }
        });
    });
})