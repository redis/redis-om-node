import { schemaData } from "../../src/utils";
import { pointSchema } from "../constants";

describe("point fields", () => {
    test("raw data", () => {
        expect(pointSchema.rawData).toStrictEqual({
            pointField1: "point",
            pointField2: { type: "point" },
            pointField3: { type: "point", default: { longitude: 3, latitude: 3 } },
            pointField4: { type: "point", required: true },
            pointField5: { type: "point", default: { longitude: 5, latitude: 5 }, required: true }
        });
    });

    test("formatted data", () => {
        expect(pointSchema[schemaData]).toStrictEqual({
            pointField1: { type: "point", default: undefined, required: false },
            pointField2: { type: "point", default: undefined, required: false },
            pointField3: { type: "point", default: { longitude: 3, latitude: 3 }, required: false },
            pointField4: { type: "point", default: undefined, required: true },
            pointField5: { type: "point", default: { longitude: 5, latitude: 5 }, required: true }
        });
    });
})