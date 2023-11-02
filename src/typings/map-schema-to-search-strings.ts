import type { ParseSchema } from "./parse-schema";
import type {
    BooleanField,
    StringField,
    NumberField,
    BigIntField,
    VectorField,
    PointField,
    TextField,
    DateField
} from "../search/search-builders";

export type MapSearchField<K extends keyof T, S extends ParseSchema<any>, T extends ParseSearchSchema<S["data"]>> = T[K][0] extends "string"
    ? StringField<S, T[K][1] extends undefined ? string : (T[K][1] & string)>
    : T[K][0] extends "number"
    ? NumberField<S, T[K][1] extends undefined ? number : (T[K][1] & number)>
    : T[K][0] extends "bigint"
    ? BigIntField<S, T[K][1] extends undefined ? bigint : (T[K][1] & bigint)>
    : T[K][0] extends "boolean"
    ? BooleanField<S>
    : T[K][0] extends "text"
    ? TextField<S>
    : T[K][0] extends "date"
    ? DateField<S>
    : T[K][0] extends "point"
    ? PointField<S>
    : T[K][0] extends "vector"
    ? VectorField<S>
    : never;

export type ParseSearchSchema<T extends ParseSchema<any>["data"]> = {
    [K in SchemaToStrings<T>]: GetFinalProperty<K, T>
};

type SchemaToStrings<T extends ParseSchema<any>["data"], K extends keyof T = keyof T> = K extends string
    ? T[K] extends { schema: unknown }
    ? never
    : T[K] extends { index: false }
    ? never
    : T[K] extends { properties: any }
    ? `${K}.${SchemaToStrings<T[K]["properties"]>}`
    : T[K] extends { elements: unknown }
    ? T[K]["elements"] extends [unknown, ...Array<unknown>]
    ? `${K}.${SchemaToStrings<{
        [U in keyof T[K]["elements"]as U extends `${number}` ? U : never]: T[K]["elements"][U]
    }>}`
    : T[K]["elements"] extends object
    ? `${K}.${SchemaToStrings<T[K]["elements"]>}`
    : K
    : K
    : never;

type GetFinalProperty<T extends string, S extends ParseSchema<any>["data"]> = T extends `${infer Head}.${infer Tail}`
    ? S[Head] extends { properties: any }
    ? GetFinalProperty<Tail, S[Head]["properties"]>
    : S[Head] extends { elements: unknown }
    ? GetFinalProperty<Tail, S[Head]["elements"]>
    : never
    : [S[T] extends { elements: unknown }
        ? S[T]["elements"] extends {}
        ? S[T]["elements"]
        : "string"
        : S[T]["type"],
        S[T] extends { literal: unknown }
        ? S[T]["literal"] extends Array<unknown>
        ? S[T]["literal"][number]
        : S[T]["literal"]
        : never
    ];