import type { ParsedMap, ParseSchema } from "../typings";

export function parseSchemaToSearchIndex(schema: ParseSchema<any>["data"], k?: string, p?: string): ParsedMap {
    let objs: ParsedMap = new Map();

    for (let i = 0, entries = Object.entries(schema), len = entries.length; i < len; i++) {
        const [key, value] = entries[i];

        if (value.type === "object") {
            //@ts-expect-error Typescript is getting confused due to the union of array and object
            if (typeof value.properties === "undefined") continue;
            //@ts-expect-error Typescript is getting confused due to the union of array and object
            const parsed = parseSchemaToSearchIndex(value.properties, k ? `${k}.${key}` : key, p ? `${k}_${key}` : key);
            objs = new Map([...objs, ...parsed]);
            continue;
        }

        if (!value.index) continue;

        //@ts-expect-error Typescript is getting confused due to the union of array and object
        if (value.type === "array" && typeof value.elements === "object") continue;
        if (value.type === "tuple") {
            //@ts-expect-error Typescript is getting confused due to the union of array and object
            for (let j = 0, le = value.elements.length; j < le; j++) {
                //@ts-expect-error Typescript is getting confused due to the union of array and object
                const temp = value.elements[j];

                const parsed = parseSchemaToSearchIndex({ [j]: temp }, k ? `${k}.${key}` : key, p ? `${k}_${key}` : key);
                objs = new Map([...objs, ...parsed]);

            }
            continue;
        }
        //@ts-expect-error ParseSchema type is confusing this (not much i can do rly)
        objs.set(k ? `${k}.${key}` : key, { value: value, path: p ? `${p}_${key}` : key });
    }

    return objs;
}