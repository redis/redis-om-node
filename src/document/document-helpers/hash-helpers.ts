import { dateToNumber, numberToDate, stringsToObject } from "./general-helpers";

import type { ArrayField, BaseField, ObjectField, Point } from "../../typings";

export function booleanToString(val: boolean): string {
    return (+val).toString();
}

export function pointToString(val: Point): string {
    const { longitude, latitude } = val;
    return `${longitude},${latitude}`;
}

export function stringToBoolean(val: string): boolean {
    return !!+val;
}

export function stringToPoint(val: string): Point {
    const [longitude, latitude] = val.split(",");
    return { longitude: parseFloat(longitude), latitude: parseFloat(latitude) };
}

export function stringToNumber(val: string): number {
    return parseFloat(val);
}

export function hashFieldToString(schema: BaseField, val: any): string {
    if (schema.type === "boolean") {
        return booleanToString(val);
    } else if (schema.type === "date") {
        return dateToNumber(val).toString();
    } else if (schema.type === "point") {
        return pointToString(val);
    } else if (schema.type === "array") {
        const temp = [];
        for (let i = 0, len = (<Array<unknown>>val).length; i < len; i++) {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            temp.push(hashFieldToString({ type: <never>(<ArrayField>schema).elements ?? "string" }, val[i]));
        }
        return temp.join((<ArrayField>schema).separator);
    } else if (schema.type === "vector") {
        return Buffer.from(val).toString();
    }

    return <string>val.toString();

}

export function objectToHashString(data: Record<string, any>, k: string, schema?: Record<string, any>): Array<string> {
    const init: Array<string> = [];
    for (let i = 0, entries = Object.entries(data), len = entries.length; i < len; i++) {
        const [key, val] = entries[i];

        if (typeof val === "object" && !Array.isArray(val) && !(val instanceof Date)) {
            if (typeof schema?.[key]?.properties !== "undefined") {
                init.push(...objectToHashString(val, `${k}.${key}`, schema[key].properties));
                continue;
            }
            init.push(...objectToHashString(val, `${k}.${key}`));
            continue;
        }

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        init.push(`${k}.${key}`, hashFieldToString(<BaseField>schema?.[key] ?? convertUnknownToSchema(val), val) ?? "");
    }

    return init;
}

export function convertUnknownToSchema(val: any): BaseField {
    if (Array.isArray(val)) return { type: "array" };
    if (val instanceof Date) return { type: "date" };
    if (typeof val === "object" && "latitude" in val && "longitude" in val) return { type: "point" };
    return { type: <"string" | "number" | "boolean" | "object">typeof val };
}

export function stringToHashField(schema: BaseField, val: string): any {
    if (schema.type === "number") {
        return stringToNumber(val);
    } if (schema.type === "boolean") {
        return stringToBoolean(val);
    } else if (schema.type === "date") {
        return numberToDate(stringToNumber(val));
    } else if (schema.type === "point") {
        return stringToPoint(val);
    } else if (schema.type === "array") {
        const temp = val.split((<ArrayField>schema).separator ?? ",");
        for (let i = 0, len = temp.length; i < len; i++) {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            temp[i] = stringToHashField({ type: <never>(<ArrayField>schema).elements ?? "string" }, temp[i]);
        }
        return temp;
    } else if (schema.type === "vector") {
        //@ts-expect-error Type overload
        if (schema.vecType === "FLOAT32") return new Float32Array(val);
        //@ts-expect-error Type overload
        if (schema.vecType === "FLOAT64") return new Float64Array(val);
    }
    return val;
}

export function stringToHashArray(arr: Array<string>, schema: any, val: string): Record<string, any> {
    let temp: any = [];
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const idx = arr.shift()!;
    let props = schema[idx].properties;

    if (arr.length === 1) {
        return { [arr[0]]: val };
    }

    for (let i = 0, len = arr.length; i < len; i++) {
        const value = arr[i];

        if (props[value].type === "object") {
            temp.push(value);
            const x = i + 1;
            props = { [arr[x]]: props[value].properties[arr[x]] };
            continue;
        }

        temp.push(value, stringToHashField(props[value], val));
    }

    const trueVal = temp.pop();
    return stringsToObject(temp, trueVal);
}

export function deepMerge(...objects: Array<Record<string, any>>): Record<string, any> {
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

export function getLastKeyInSchema(data: Required<ObjectField>, key: string): BaseField | undefined {
    if (!data.properties) return { type: "string" };
    for (let i = 0, entries = Object.entries(data.properties), len = entries.length; i < len; i++) {
        const [k, value] = entries[i];

        if (key === k) {
            return <BaseField>value;
        }

        if (typeof value === "undefined") continue;

        //@ts-expect-error I dont have a proper type for this
        if (value.type === "object") {
            //@ts-expect-error I dont have a proper type for this
            return getLastKeyInSchema(value, key);
        }

        continue;
    }

    return void 0;
}