import type { HASHDocument, JSONDocument } from "../document";
import type { MapSchema } from "./map-schema-to-object";
import type { ParseSchema } from "./parse-schema";
import type { Schema } from "../schema";

export type Document = JSONDocument | HASHDocument;

export type ReturnDocument<
    T extends Schema<any, any> | ParseSchema<any>,
    FREF extends boolean = false,
    FREL extends boolean = false,
    MOR extends boolean = false,
    CAS extends boolean = false
> = T extends Schema<any, any, infer U>
    ? Document & MapSchema<U, FREF, FREL, MOR, CAS>
    : T extends ParseSchema<any> ? Document & MapSchema<T, FREF, FREL, MOR, CAS> : never;