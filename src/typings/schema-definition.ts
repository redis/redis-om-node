import type { FieldMap } from "./field-map";
import type { Schema } from "../schema";
import type { Point } from "./point";

export type SchemaDefinition = Record<string, keyof Omit<FieldMap, "tuple" | "object" | "reference"> | FieldTypes>;

export type FieldTypes = StringField | NumberField | BooleanField | TextField | DateField | PointField | ArrayField | TupleField | ObjectField | ReferenceField | VectorField;

export type TupleElement = Exclude<keyof FieldMap, "tuple" | "reference" | "object"> | SchemaDefinition | undefined;

export interface BaseField {
    type: keyof FieldMap;
    optional?: boolean | undefined;
    default?: FieldMap<unknown>[keyof FieldMap] | undefined;
    sortable?: boolean;
    index?: boolean;
}

// TAG
export interface StringField extends BaseField {
    type: "string";
    default?: string | undefined;
}

// NUMERIC
export interface NumberField extends BaseField {
    type: "number";
    default?: number | undefined;
}

// TAG
export interface BooleanField extends BaseField {
    type: "boolean";
    default?: boolean | undefined;
}

// TEXT
export interface TextField extends BaseField {
    type: "text";
    default?: string | undefined;
}

// NUMERIC
export interface DateField extends BaseField {
    type: "date";
    default?: Date | number | string | undefined;
}

// GEO
export interface PointField extends BaseField {
    type: "point";
    default?: Point | undefined;
}

// VECTOR
export interface BaseVector extends BaseField {
    type: "vector";
    default?: Array<number> | Float32Array | Float64Array | undefined;
    algorithm: "FLAT" | "HNSW";
    vecType: "FLOAT32" | "FLOAT64";
    dim: number;
    distance: "L2" | "IP" | "COSINE";
    cap?: number | undefined;
}

export interface FlatVector extends BaseVector {
    algorithm: "FLAT";
    size?: number | undefined;
}

export interface HNSWVector extends BaseVector {
    algorithm: "HNSW";
    m?: number | undefined;
    construction?: number | undefined;
    runtime?: number | undefined;
    epsilon?: number | undefined;
}

export type VectorField = FlatVector | HNSWVector;

// FALLBACK
export interface ArrayField extends BaseField {
    type: "array";
    elements?: Exclude<keyof FieldMap, "array" | "reference" | "object" | "tuple"> | SchemaDefinition | undefined;
    default?: Array<unknown> | undefined;
    separator?: string;
}

//FALLBACK
export interface TupleField extends Omit<BaseField, "sortable"> {
    type: "tuple";
    elements: [TupleElement, ...Array<TupleElement>];
    default?: Array<unknown> | undefined;
}

// FALLBACK
export interface ObjectField extends Omit<BaseField, "sortable"> {
    type: "object";
    properties?: SchemaDefinition | undefined;
    default?: Record<string, any> | undefined;
}

// NON EXISTENT HANDLE AS ARRAY OF STRINGS WITH AUTOFETCH TRANSFORMING INTO AN OBJECT
export interface ReferenceField extends Pick<BaseField, "type"> {
    type: "reference";
    schema: Schema<any, any> | "self";
}