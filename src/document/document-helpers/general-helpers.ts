/* eslint-disable array-element-newline */
import { PrettyError } from "@infinite-fansub/logger";
import { inspect } from "node:util";
import { Color } from "colours.js";

import type { ParsedFieldType, ParsedSchemaDefinition } from "../../typings";
import type { HASHDocument } from "../hash-document";
import type { JSONDocument } from "../json-document";

export function dateToNumber(val: Date | string | number): number {
    if (val instanceof Date) return val.getTime();
    if (typeof val === "string" || typeof val === "number") return new Date(val).getTime();
    throw new PrettyError("An invalid value was given");
}

export function numberToDate(val: number): Date {
    return new Date(val);
}

export function validateSchemaReferences(
    schema: ParsedSchemaDefinition["references"],
    data: JSONDocument | HASHDocument
): void {
    for (let i = 0, keys = Object.keys(schema), len = keys.length; i < len; i++) {
        const key = keys[i];
        const dataVal = data[key];

        if (typeof dataVal === "undefined") throw new PrettyError(`Found a missing reference: '${key}'`, {
            reference: "redis-om"
        });

        for (let j = 0, le = dataVal.length; j < le; j++) {
            if (typeof dataVal[i] !== "string") throw new PrettyError("Invalid id inside a reference", {
                reference: "redis-om",
                lines: [
                    {
                        marker: { text: "Content: " },
                        error: `Reference 'ids' must be strings.\nFound type: '${typeof dataVal[i]}'`
                    }
                ]
            });
        }
    }

}

export function validateSchemaData(
    schema: ParsedSchemaDefinition["data"],
    data: JSONDocument | HASHDocument
): void {
    for (let i = 0, entries = Object.entries(schema), length = entries.length; i < length; i++) {
        const [key, field] = entries[i];

        validate(field, data[key], key);
    }
}

function validate(
    field: ParsedFieldType,
    value: any,
    workingKey: string
): void {
    if (value === null) throw new PrettyError("Cannot save 'null' to the database", {
        reference: "redis-om"
    });

    if (typeof value === "undefined"
        || typeof value === "object" && !(value instanceof Date) && (value.length === 0 || Object.keys(value).length === 0)
    ) {
        if (field.optional) return;
        if (typeof field.default === "undefined") throw new PrettyError(`'${workingKey}' is required but was not given a value`, {
            reference: "redis-om"
        });
    }

    if (field.type === "object") {
        if (field.properties === null) return;
        validateSchemaData(field.properties, value);
    } else if (field.type === "array") {
        for (let i = 0, len = value.length; i < len; i++) {
            const val = value[i];

            if (typeof field.elements === "object") {
                validateSchemaData(field.elements, val);
            } else {
                // This should work without problems...
                validate(<never>{ type: field.elements }, val, `${workingKey}.${i}`);
            }
        }
    } else if (field.type === "tuple") {
        for (let i = 0, length = field.elements.length; i < length; i++) {
            validate(field.elements[i], value[i], `${workingKey}.${i}`);
        }
    } else if (field.type === "date") {
        if (!(value instanceof Date) && typeof value !== "number") throw new PrettyError(`Expected 'Date' or type 'number' but instead got ${typeof value}`, {
            reference: "redis-om"
        });
    } else if (field.type === "point") {
        if (typeof value !== "object") throw new PrettyError("Invalid 'point' format", {
            reference: "redis-om",
            lines: [
                {
                    error: inspect({
                        longitude: "number",
                        latitude: "number"
                    }, { colors: true }),
                    marker: { text: "Expected:", color: Color.fromHex("#00FF00"), spacedBefore: true, newLine: true }
                },
                {
                    error: typeof value,
                    marker: { text: "Got: ", color: Color.fromHex("#00FF00"), spacedBefore: true }
                }
            ]
        });
        if (!value.longitude || !value.latitude) throw new PrettyError("'longitude' or 'latitude' where not defined", {
            reference: "redis-om"
        });
        if (Object.keys(value).length > 2) throw new PrettyError("Invalid 'point' format", {
            reference: "redis-om",
            lines: [
                {
                    error: inspect({
                        longitude: "number",
                        latitude: "number"
                    }, { colors: true }),
                    marker: { text: "Expected:", color: Color.fromHex("#00FF00"), spacedBefore: true, newLine: true }
                },
                {
                    error: inspect(value, { colors: true }),
                    marker: { text: "Got:", color: Color.fromHex("#00FF00"), spacedBefore: true, newLine: true }
                }
            ]
        });
    } else if (field.type === "text") {
        if (typeof value !== "string") throw new PrettyError("Text field has to be a string");
    } else if (field.type === "vector") {
        if (!(value instanceof Float32Array) && !(value instanceof Float64Array) && !Array.isArray(value)) throw new PrettyError("Got wrong vector format");
    } else if (field.type === "string" || field.type === "number" || field.type === "bigint") {
        if (typeof field.literal !== "undefined") {
            if (!field.literal.includes(<never>value)) {
                throw new PrettyError(`Got wrong value. Expected one of: '${field.literal}' got '${value}'`, {
                    reference: "redis-om"
                });
            }

        } else if (typeof value !== field.type) {
            throw new PrettyError(`Got wrong value type. Expected type: '${field.type}' got '${typeof value}'`, {
                reference: "redis-om"
            });
        }
    } else /* Handles `boolean` */ {
        if (typeof value !== field.type) throw new PrettyError(`Got wrong value type. Expected type: '${field.type}' got '${typeof value}'`);
    }
}