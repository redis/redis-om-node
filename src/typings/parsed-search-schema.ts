import type { FieldTypes, ObjectField, ReferenceField, TupleField } from "./schema-definition";

export interface Parsed {
    value: Exclude<FieldTypes, TupleField | ObjectField | ReferenceField>;
    path: string;
}

export type ParsedMap = Map<string, Parsed>;