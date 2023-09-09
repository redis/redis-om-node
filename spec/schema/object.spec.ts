import { schemaData } from "../../src/utils/symbols";
import { objectSchema } from "../constants";

describe("object field", () => {
    test("formatted data", () => {
        expect(objectSchema[schemaData].data).toStrictEqual({
            objectField1: {
                type: "object",
                properties: {
                    nestedProperty1: { type: "string", default: undefined, optional: false, sortable: false, index: true, literal: undefined },
                    nestedProperty2: { type: "number", default: undefined, optional: false, sortable: false, index: true, literal: undefined },
                    nestedProperty3: { type: "boolean", default: undefined, optional: false, sortable: false, index: true },
                    nestedProperty4: { type: "text", default: undefined, optional: false, sortable: false, index: true },
                    nestedProperty5: { type: "date", default: undefined, optional: false, sortable: false, index: true },
                    nestedProperty6: { type: "point", default: undefined, optional: false, sortable: false, index: true },
                    nestedProperty7: { type: "array", elements: "string", default: undefined, optional: false, sortable: false, index: true, separator: "," },
                    nestedProperty9: {
                        type: "object",
                        properties: {
                            deep1: { type: "string", default: undefined, optional: false, sortable: false, index: true, literal: undefined },
                            deep2: {
                                type: "object",
                                properties: {
                                    nest: {
                                        type: "object",
                                        properties: {
                                            finalNestBczImLazy: { type: "array", elements: "string", default: undefined, optional: false, sortable: false, index: true, separator: "," }
                                        },
                                        default: undefined,
                                        optional: false
                                    }
                                },
                                default: undefined,
                                optional: false
                            }
                        },
                        default: undefined,
                        optional: false
                    }
                },
                default: {
                    nestedProperty9: {
                        deep1: "S"
                    }
                },
                optional: true
            }
        })
    });
})