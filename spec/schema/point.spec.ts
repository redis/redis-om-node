import { schemaData } from "../../src/utils/symbols";
import { pointSchema } from "../constants";

describe("point fields", () => {
    test("formatted data", () => {
        expect(pointSchema[schemaData].data).toStrictEqual({
            pointField1: { type: "point", default: undefined, optional: false, sortable: false, index: true },
            pointField2: { type: "point", default: undefined, optional: false, sortable: false, index: true },
            pointField3: { type: "point", default: { longitude: 3, latitude: 3 }, optional: false, sortable: false, index: true },
            pointField4: { type: "point", default: undefined, optional: true, sortable: false, index: true },
            pointField5: { type: "point", default: { longitude: 5, latitude: 5 }, optional: true, sortable: false, index: true }
        });
    });
})