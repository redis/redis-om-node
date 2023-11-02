import type { FloatArray, InnerSchemaDefinition } from "./schema-and-fields-definition";
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
    vector: Array<number> | FloatArray;
    array: Array<T>;
    tuple: [T];
    object: Record<string, InnerSchemaDefinition>;
    reference: Array<Record<string, InnerSchemaDefinition>>;
    relation: Array<Record<string, InnerSchemaDefinition>>;
}