import { PrettyError } from "@infinite-fansub/logger";
import { inspect } from "node:util";
import { Color } from "colours.js";

import type { ObjectField, ParseSchema } from "../../typings";
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

export function stringsToObject(arr: Array<string>, val: unknown): Record<string, any> {
    let obj: any = {};
    arr.reduce((object, accessor, i) => {
        object[accessor] = {};

        if (arr.length - 1 === i) {
            object[accessor] = val;
        }

        return <Record<string, unknown>>object[accessor];
    }, obj);

    return <Record<string, any>>obj;
}

export function validateSchemaReferences(
    this: HASHDocument | JSONDocument,
    schema: ParseSchema<any>["references"],
    data: JSONDocument | ParseSchema<any>["references"] = this
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
                        marker: { text: "Content:" },
                        error: `Reference 'ids' must be strings.\nFound type: '${typeof dataVal[i]}'`
                    }
                ]
            });
        }
    }

}

export function validateSchemaData(
    this: HASHDocument | JSONDocument,
    schema: ParseSchema<any>["data"],
    data: HASHDocument | ParseSchema<any>["data"] = this,
    isField: boolean = false
): void {
    for (let i = 0, entries = Object.entries(schema), len = entries.length; i < len; i++) {
        const [key, value] = entries[i];

        if (isField && typeof data[key] === "undefined") throw new PrettyError(`Found a missing property inside an object: '${key}'`, {
            reference: "redis-om"
        });

        const dataVal = data[key];

        if (dataVal === null) throw new PrettyError("Cannot save 'null' to the database", {
            reference: "redis-om"
        });

        if (typeof dataVal === "undefined" && value.optional) continue;
        if (typeof dataVal === "undefined" && !value.optional && typeof value.default === "undefined") throw new PrettyError(`'${key}' is required but was not given a value`, {
            reference: "redis-om"
        });

        if (value.type === "object") {
            if (!(<ObjectField>value).properties) continue;
            //@ts-expect-error Typescript is getting confused due to the union of array and object
            validateSchemaData(value.properties, dataVal, true);
        } else if (value.type === "array") {
            dataVal.every((val: unknown) => {
                if (typeof val === "object") return;
                //@ts-expect-error Typescript is getting confused due to the union of array and object
                if (value.elements === "text") {
                    if (typeof val !== "string") throw new PrettyError(`Invalid text received. Expected type: 'string' got '${typeof val}'`, {
                        reference: "redis-om"
                    });
                    return;
                }
                //@ts-expect-error Typescript is getting confused due to the union of array and object
                if (typeof val !== value.elements) throw new PrettyError(`Got wrong type on array elements. Expected type: '${value.elements}' got '${typeof val}'`, {
                    reference: "redis-om"
                });
            });

        } else if (value.type === "tuple") {
            //@ts-expect-error Typescript is getting confused due to the union of array and object
            for (let j = 0, le = value.elements.length; j < le; j++) {
                //@ts-expect-error Typescript is getting confused due to the union of array and object
                validateSchemaData({ [j]: value.elements[j] }, { [j]: dataVal[j] });
            }
        } else if (value.type === "date") {
            if (!(dataVal instanceof Date) && typeof dataVal !== "number") throw new PrettyError(`Expected 'Date' or type 'number' but instead got ${typeof dataVal}`, {
                reference: "redis-om"
            });
        } else if (value.type === "point") {
            if (typeof dataVal !== "object") throw new PrettyError("Invalid 'point' format", {
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
                        error: typeof dataVal,
                        marker: { text: "Got: ", color: Color.fromHex("#00FF00"), spacedBefore: true }
                    }
                ]
            });
            if (!dataVal.longitude || !dataVal.latitude) throw new PrettyError("'longitude' or 'latitude' where not defined", {
                reference: "redis-om"
            });
            if (Object.keys(dataVal).length > 2) throw new PrettyError("Invalid 'point' format", {
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
                        error: inspect(dataVal, { colors: true }),
                        marker: { text: "Got:", color: Color.fromHex("#00FF00"), spacedBefore: true, newLine: true }
                    }
                ]
            });
        } else if (value.type === "text") {
            if (typeof dataVal !== "string") throw new PrettyError("Text field has to be a string");
        } else if (value.type === "vector") {
            if (!(dataVal instanceof Float32Array) && !(dataVal instanceof Float64Array) && !Array.isArray(dataVal)) throw new PrettyError("Got wrong vector format");
        } else {
            // This handles `number`, `boolean` and `string` types
            if (typeof dataVal !== value.type) throw new PrettyError(`Got wrong value type. Expected type: '${value.type}' got '${typeof dataVal}'`);
        }
    }
}