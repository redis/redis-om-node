import type { FieldMap } from "./field-map";

export interface ParsedSchemaToSearch {
    map: ParsedMap;
    index: Array<string>;
}

export type ParsedMap = Map<string, {
    type: Exclude<keyof FieldMap, "array" | "tuple" | "reference" | "object">,
    searchPath: string
}>;