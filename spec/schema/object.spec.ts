import { schemaData } from "../../src/utils";
import { objectSchema } from "../constants";

describe("object field", () => {
    test("raw data", () => {
        expect(objectSchema.rawData).toStrictEqual({
            objectField1: {
                type: "object",
                properties: {
                    nestedProperty1: "string",
                    nestedProperty2: "number",
                    nestedProperty3: "boolean",
                    nestedProperty4: "text",
                    nestedProperty5: "date",
                    nestedProperty6: "point",
                    nestedProperty7: "array",
                    nestedProperty9: {
                        type: "object",
                        properties: {
                            deep1: "string",
                            deep2: {
                                type: "object",
                                properties: {
                                    nest: {
                                        type: "object",
                                        properties: {
                                            finalNestBczImLazy: "array"
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                default: {
                    nestedProperty9: {
                        deep1: "S"
                    }
                },
                required: true
            }
        });
    });

    test("formatted data", () => {
        expect(objectSchema[schemaData]).toStrictEqual({
            objectField1: {
                type: "object",
                properties: {
                    nestedProperty1: { type: "string", default: undefined, required: false },
                    nestedProperty2: { type: "number", default: undefined, required: false },
                    nestedProperty3: { type: "boolean", default: undefined, required: false },
                    nestedProperty4: { type: "text", default: undefined, required: false },
                    nestedProperty5: { type: "date", default: undefined, required: false },
                    nestedProperty6: { type: "point", default: undefined, required: false },
                    nestedProperty7: { type: "array", elements: "string", default: undefined, required: false },
                    nestedProperty9: {
                        type: "object",
                        properties: {
                            deep1: { type: "string", default: undefined, required: false },
                            deep2: {
                                type: "object",
                                properties: {
                                    nest: {
                                        type: "object",
                                        properties: {
                                            finalNestBczImLazy: { type: "array", elements: "string", default: undefined, required: false }
                                        },
                                        default: undefined,
                                        required: false
                                    }
                                },
                                default: undefined,
                                required: false
                            }
                        },
                        default: undefined,
                        required: false
                    }
                },
                default: {
                    nestedProperty9: {
                        deep1: "S"
                    }
                },
                required: true
            }
        })
    });
})