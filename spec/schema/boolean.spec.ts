import { schemaData } from "../../src/utils";
import { booleanSchema } from "../constants";

describe("boolean fields", () => {
    test("raw data", () => {
        expect(booleanSchema.rawData).toStrictEqual({
            booleanField1: "boolean",
            booleanField2: { type: "boolean" },
            booleanField3: { type: "boolean", default: true },
            booleanField4: { type: "boolean", required: true },
            booleanField5: { type: "boolean", default: false, required: true }
        });
    });

    test("formatted data", () => {
        expect(booleanSchema[schemaData]).toStrictEqual({
            booleanField1: { type: "boolean", default: undefined, required: false },
            booleanField2: { type: "boolean", default: undefined, required: false },
            booleanField3: { type: "boolean", default: true, required: false },
            booleanField4: { type: "boolean", default: undefined, required: true },
            booleanField5: { type: "boolean", default: false, required: true }
        });
    });
})