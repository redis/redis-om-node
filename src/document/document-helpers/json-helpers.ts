import { dateToNumber, numberToDate } from "./general-helpers";

import type { ParsedFieldType, ParsedSchemaDefinition } from "../../typings";

export function documentFieldToJSONValue(field: ParsedFieldType | { type: ParsedFieldType["type"] }, value: any): unknown {
    if (field.type === "bigint") return value.toString();
    if (field.type === "date") return dateToNumber(value);
    if (field.type === "point") return `${value.longitude},${value.latitude}`;
    if (field.type === "vector") return Array.from(value);
    if (field.type === "object") {
        if (!("properties" in field) || field.properties === null) return value;
        return transformParsedDefinition(field.properties, value, documentFieldToJSONValue);
    }

    if (field.type === "array") {
        if (!("elements" in field)) return value;
        for (let i = 0, length = value.length; i < length; i++) {
            if (typeof field.elements === "object") {
                value[i] = transformParsedDefinition(field.elements, value[i], documentFieldToJSONValue);
                continue;
            }

            value[i] = documentFieldToJSONValue({ type: field.elements }, value[i]);
        }

        return value;
    }

    if (field.type === "tuple") {
        if (!("elements" in field)) return value;
        if (field.index) {
            const tempField: Record<number, ParsedFieldType> = { ...field.elements };
            const tempValue = { ...value };

            for (let i = 0, entries = Object.entries(tempField), length = entries.length; i < length; i++) {
                const val = entries[i][1];

                tempValue[i] = documentFieldToJSONValue(val, tempValue[i]);
            }

            return tempValue;
        }

        for (let i = 0, length = field.elements.length; i < length; i++) {
            value[i] = documentFieldToJSONValue(field.elements[i], value[i]);
        }

        return value;
    }

    return value;
}

function transformParsedDefinition(
    field: ParsedSchemaDefinition["data"],
    value: any,
    transformer: typeof documentFieldToJSONValue | typeof JSONValueToDocumentField
): Record<string, unknown> {
    const temp: Record<string, unknown> = {};

    for (let i = 0, entries = Object.entries(field), length = entries.length; i < length; i++) {
        const [key, val] = entries[i];
        if (typeof value[key] === "undefined") continue;

        temp[key] = transformer(val, value[key]);
    }

    return temp;
}

export function JSONValueToDocumentField(field: ParsedFieldType | { type: ParsedFieldType["type"] }, value: any): unknown {
    if (field.type === "bigint") return BigInt(value);
    if (field.type === "date") return numberToDate(value);
    if (field.type === "point") {
        const [longitude, latitude] = value.split(",");
        return { longitude: +longitude, latitude: +latitude };
    }

    if (field.type === "vector") {
        if (!("vecType" in field) || field.vecType === "FLOAT32") return new Float32Array(value);
        return new Float64Array(value);
    }

    if (field.type === "object") {
        if (!("properties" in field) || field.properties === null) return value;
        return transformParsedDefinition(field.properties, value, JSONValueToDocumentField);
    }

    if (field.type === "array") {
        if (!("elements" in field)) return value;
        for (let i = 0, length = value.length; i < length; i++) {
            if (typeof field.elements === "object") {
                value[i] = transformParsedDefinition(field.elements, value[i], JSONValueToDocumentField);
                continue;
            }

            value[i] = JSONValueToDocumentField({ type: field.elements }, value[i]);
        }

        return value;
    }

    if (field.type === "tuple") {
        if (!("elements" in field)) return value;
        if (field.index) {
            value = Object.values(value);
        }

        for (let i = 0, length = field.elements.length; i < length; i++) {
            value[i] = JSONValueToDocumentField(field.elements[i], value[i]);
        }

        return value;
    }

    return value;
}