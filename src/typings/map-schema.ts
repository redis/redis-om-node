import type { ParseSchema } from "./parse-schema";
import type { ReferenceArray } from "../utils";
import type { FieldMap } from "./field-map";

export type MapSchema<
    T extends ParseSchema<any>,
    AF extends boolean = false,
    CAS extends boolean = false
> = MapSchemaData<T["data"], CAS> & MapSchemaReferences<T["references"], AF, CAS>;

type MapSchemaData<T extends ParseSchema<any>["data"], CAS extends boolean = false> = {
    [K in keyof T as T[K]["type"] extends "object" ? K : T[K]["optional"] extends true ? never : T[K]["default"] extends {} ? CAS extends true ? never : K : never]: _MapSchemaData<T[K]>
} & {
        [K in keyof T as T[K]["type"] extends "object" ? never : T[K]["optional"] extends true ? K : T[K]["default"] extends {} ? CAS extends true ? K : never : K]?: _MapSchemaData<T[K]>
    };

// eslint-disable-next-line @typescript-eslint/naming-convention
type _MapSchemaData<T extends ParseSchema<any>["data"][number]> = T extends { properties: unknown }
    ? T["properties"] extends ParseSchema<any>
    ? MapSchema<T["properties"]>
    : T["properties"] extends ParseSchema<any>["data"]
    ? MapSchemaData<T["properties"]>
    : unknown
    : T extends { elements: unknown }
    ? T["elements"] extends [unknown, ...Array<unknown>]
    ? Test<T["elements"]>
    : T["elements"] extends object
    ? Array<MapSchemaData<T["elements"]>>
    : FieldMap<FieldMap[T["elements"]]>["array"]
    : T extends { algorithm: unknown }
    ? T extends { vecType: "FLOAT32" }
    ? Float32Array | Array<number>
    : T extends { vecType: "FLOAT64" }
    ? Float64Array | Array<number>
    : unknown
    : FieldMap[T["type"]]
    ;

type MapSchemaReferences<T extends ParseSchema<any>["references"], AF extends boolean = false, CAS extends boolean = false> = CAS extends true ? {
    [K in keyof T]?: Array<string>
} : {
        [K in keyof T]: _MapSchemaReferences<T[K], AF>
    };

// eslint-disable-next-line @typescript-eslint/naming-convention
type _MapSchemaReferences<T extends ParseSchema<any>["references"][number], AF extends boolean = false> = AF extends true
    ? Array<MapSchema<T["schema"]>>
    : ReferenceArray;

type Test<T> = {
    [K in keyof T]: T[K] extends ParseSchema<any>["data"][number] ? _MapSchemaData<T[K]> : never
};