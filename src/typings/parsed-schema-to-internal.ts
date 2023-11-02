import type { FieldStringType } from "./schema-and-fields-definition";

export interface ParsedSchemaToSearch {
    map: ParsedMap;
    index: Array<string>;
}

export type ParsedMap = Map<string, {
    type: Exclude<FieldStringType, "array">,
    searchPath: string
}>;

export type ParsedRelationsToSearch = Record<string, { key: string, hash: string, data: ParsedSchemaToSearch }>;