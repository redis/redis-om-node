import { schemaData } from "../../src/utils/symbols";
import { stringSchema } from "../constants";

describe("string fields", () => {
    test("formatted data", () => {
        expect(stringSchema[schemaData].data).toStrictEqual({
            stringField1: { type: "string", default: undefined, optional: false, sortable: false, index: true, literal: undefined },
            stringField2: { type: "string", default: undefined, optional: false, sortable: false, index: true, literal: undefined },
            stringField3: { type: "string", default: "S", optional: false, sortable: false, index: true, literal: undefined },
            stringField4: { type: "string", default: undefined, optional: true, sortable: false, index: true, literal: undefined },
            stringField5: { type: "string", default: "SS", optional: true, sortable: false, index: true, literal: undefined }
        });
    });
})