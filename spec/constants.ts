import { Schema } from "../src"

export const stringSchema = new Schema({
    stringField1: "string",
    stringField2: { type: "string" },
    stringField3: { type: "string", default: "S" },
    stringField4: { type: "string", required: true },
    stringField5: { type: "string", default: "SS", required: true }
})

export const numberSchema = new Schema({
    numberField1: "number",
    numberField2: { type: "number" },
    numberField3: { type: "number", default: 3 },
    numberField4: { type: "number", required: true },
    numberField5: { type: "number", default: 5, required: true }
})

export const booleanSchema = new Schema({
    booleanField1: "boolean",
    booleanField2: { type: "boolean" },
    booleanField3: { type: "boolean", default: true },
    booleanField4: { type: "boolean", required: true },
    booleanField5: { type: "boolean", default: false, required: true }
})

export const textSchema = new Schema({
    textField1: "text",
    textField2: { type: "text" },
    textField3: { type: "text", default: "T" },
    textField4: { type: "text", required: true },
    textField5: { type: "text", default: "TT", required: true }
})

export const dateSchema = new Schema({
    dateField1: "date",
    dateField2: { type: "date" },
    dateField3: { type: "date", default: 874195200000 },
    dateField4: { type: "date", required: true },
    dateField5: { type: "date", default: new Date(874195200000), required: true }
})

export const pointSchema = new Schema({
    pointField1: "point",
    pointField2: { type: "point" },
    pointField3: { type: "point", default: { longitude: 3, latitude: 3 } },
    pointField4: { type: "point", required: true },
    pointField5: { type: "point", default: { longitude: 5, latitude: 5 }, required: true }
})

export const arraySchema = new Schema({
    arrayField1: "array",
    arrayField2: { type: "array" },
    arrayField3: { type: "array", elements: "number" },
    arrayField4: { type: "array", default: ["s"] },
    arrayField5: { type: "array", required: true },
    arrayField6: { type: "array", elements: "boolean", default: [false], required: true },
    arrayField7: { type: "array", elements: { element1: "string" } }
})

export const objectSchema = new Schema({
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
})