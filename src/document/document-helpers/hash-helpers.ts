import { PrettyError } from "@infinite-fansub/logger";

import { dateToNumber, numberToDate } from "./general-helpers";

import type { ParsedFieldType, ParsedSchemaDefinition } from "../../typings";

export function documentFieldToHASHValue(field: ParsedFieldType | { type: ParsedFieldType["type"] }, value: any, key?: string): Array<string> {
    if (field.type === "boolean") return keyExists(booleanToString(value), key);
    if (field.type === "date") return keyExists(dateToNumber(value).toString(), key);
    if (field.type === "point") return keyExists(`${value.longitude},${value.latitude}`, key);
    if (field.type === "vector") return keyExists(Buffer.from(value).toString(), key);
    if (field.type === "object") {
        if (!("properties" in field) || field.properties === null) return keyExists(JSON.stringify(value), key);
        if (!key) throw new PrettyError("Something went terribly wrong");
        return flatten(field.properties, value, key);
    }

    if (field.type === "array") {
        if (!("elements" in field)) return keyExists(value.toString(), key);
        const temp: Array<string> = [];

        if (typeof field.elements === "object") {
            for (let i = 0, length = value.length; i < length; i++) {
                temp.push(...flatten(field.elements, value[i], `${key}.${i}`));
            }

            return temp;
        }

        for (let i = 0, length = value.length; i < length; i++) {
            const parsed = documentFieldToHASHValue({ type: field.elements }, value[i], `${key}.${i}`);
            temp.push(parsed.length > 1 ? parsed[1] : parsed[0]);
        }

        return keyExists(temp.join(field.separator), key);
    }

    if (field.type === "tuple") {
        if (!("elements" in field)) return keyExists(value.toString(), key);

        const tempField: Record<`${number}`, ParsedFieldType> = { ...field.elements };
        const tempValue = { ...value };

        return flatten(tempField, tempValue, key);
    }

    return keyExists(value.toString(), key);
}

function flatten(field: ParsedSchemaDefinition["data"], value: any, key?: string): Array<string> {
    const temp: Array<string> = [];

    for (let i = 0, entries = Object.entries(field), length = entries.length; i < length; i++) {
        const [k, val] = entries[i];

        temp.push(...documentFieldToHASHValue(val, value[k], key ? `${key}.${k}` : k));
    }

    return temp;
}

function keyExists(value: string, key: string | undefined): Array<string> {
    return key ? [key, value] : [value];
}

export function HASHValueToDocumentField(
    field: ParsedFieldType | { type: ParsedFieldType["type"] },
    value: any,
    existingValue?: any,
    keysList?: Array<string>
): unknown {
    if (field.type === "number") return parseFloat(value);
    if (field.type === "bigint") return BigInt(value);
    if (field.type === "boolean") return stringToBoolean(value);
    if (field.type === "date") return numberToDate(parseFloat(value));
    if (field.type === "point") {
        const [longitude, latitude] = value.split(",");
        return { longitude: +longitude, latitude: +latitude };
    }

    if (field.type === "vector") {
        if (!("vecType" in field) || field.vecType === "FLOAT32") return new Float32Array(Buffer.from(value));
        return new Float64Array(Buffer.from(value));
    }

    if (field.type === "object") {
        if (!("properties" in field) || field.properties === null) return JSON.parse(value);
        if (!existingValue && !keysList) throw new PrettyError("Something went terribly wrong");

        return deepMerge(existingValue ?? {}, arrayOfKeysToObject(keysList, value));
    }

    if (field.type === "array") {
        if (!("elements" in field)) return value;
        if (typeof field.elements === "object") {
            const temp: Array<unknown> = [];
            if (!existingValue || !keysList) throw new PrettyError("Something went terribly wrong");
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const index = keysList.shift()!;

            for (let i = 0, length = temp.length; i < length; i++) {
                temp[i] = HASHValueToDocumentField(field.elements[+index], value, existingValue, keysList);
            }

            return temp;
        } else {
            const splitValue = value.split(field.separator);
            for (let i = 0, length = splitValue.length; i < length; i++) {
                splitValue[i] = HASHValueToDocumentField({ type: field.elements }, splitValue[i]);
            }

            return splitValue;
        }
    }

    if (field.type === "tuple") {
        if (!("elements" in field)) return value;
        if (!existingValue && !keysList) throw new PrettyError("Something went terribly wrong");
        if (typeof existingValue === "undefined") existingValue = new Array(field.elements.length);

        let index = +(keysList?.shift() ?? 0);
        let currentField = field.elements[index];

        if (typeof currentField === "undefined") {
            index = +(keysList?.shift() ?? 0);
            currentField = field.elements[index];
        }

        existingValue[index] = HASHValueToDocumentField(currentField, value, existingValue, keysList);

        return existingValue;
    }

    return value;

}

// This needs to be optimized
function deepMerge(...objects: Array<Record<string, any>>): Record<string, any> {
    let newObject: Record<string, any> = {};

    for (let i = 0, len = objects.length; i < len; i++) {
        const obj = objects[i];

        if (typeof obj === "undefined") continue;

        for (let j = 0, entries = Object.entries(obj), le = entries.length; j < le; j++) {
            const [key, value] = entries[j];
            if (typeof value === "object" && value) {
                const derefObj = { ...value };

                newObject[key] = newObject[key] ? deepMerge(newObject[key], derefObj) : derefObj;
            } else {
                newObject[key] = value;
            }
        }
    }

    return newObject;
}

// This also needs to be optimized
export function arrayOfKeysToObject(arr: Array<string> | undefined, val: unknown): Record<string, unknown> {
    const obj: Record<string, unknown> = {};
    arr?.reduce((object, accessor, i) => {
        object[accessor] = {};

        if (arr.length - 1 === i) {
            object[accessor] = val;
        }

        return <Record<string, unknown>>object[accessor];
    }, obj);

    return obj;
}

function booleanToString(val: boolean): string {
    return (+val).toString();
}

function stringToBoolean(val: string): boolean {
    return !!+val;
}