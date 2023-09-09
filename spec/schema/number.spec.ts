import { schemaData } from "../../src/utils/symbols";
import { numberSchema } from "../constants";

describe("number fields", () => {
    test("formatted data", () => {
        expect(numberSchema[schemaData].data).toStrictEqual({
            numberField1: { type: "number", default: undefined, optional: false, sortable: false, index: true, literal: undefined },
            numberField2: { type: "number", default: undefined, optional: false, sortable: false, index: true, literal: undefined },
            numberField3: { type: "number", default: 3, optional: false, sortable: false, index: true, literal: undefined },
            numberField4: { type: "number", default: undefined, optional: true, sortable: false, index: true, literal: undefined },
            numberField5: { type: "number", default: 5, optional: true, sortable: false, index: true, literal: undefined }
        });
    });
})