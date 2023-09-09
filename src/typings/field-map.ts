import type { SchemaDefinition } from "./schema-definition";
import type { Point } from "./point";

/**
 * @typeParam T - The array and/or tuple type
 */
export interface FieldMap<T = string> {
    string: string;
    number: number;
    bigint: bigint;
    boolean: boolean;
    text: string;
    date: Date | number;
    point: Point;
    vector: Array<number> | Float32Array | Float64Array;
    array: Array<T>;
    tuple: [T];
    object: Record<string, SchemaDefinition>;
    reference: Array<Record<string, SchemaDefinition>>;
}