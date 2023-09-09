import type { ExtractParsedSchemaDefinition } from "./extract-generic";
import type { Schema } from "../schema";

import type {
    SchemaDefinition,
    ReferenceField,
    ObjectField,
    StringField,
    NumberField,
    VectorField,
    ArrayField,
    TupleField,
    FlatVector,
    HNSWVector,
    BaseField,
    FieldType,
    BigIntField
} from "./schema-definition";

export type ParseSchema<T extends SchemaDefinition> = {
    data: {
        [K in keyof T as T[K] extends ReferenceField ? never : K]: T[K] extends ObjectField
        ? {
            [P in keyof Required<ObjectField>]: P extends "properties"
            ? T[K][P] extends {}
            ? T[K][P] extends Schema<any, any, infer U>
            ? U
            : T[K][P] extends SchemaDefinition
            ? ParseSchema<T[K][P]>["data"]
            : never
            : undefined
            : T[K][P] extends {} ? T[K][P] : Fill<P>
        }
        : T[K] extends ArrayField
        ? {
            [P in keyof Required<ArrayField>]: P extends "elements"
            ? T[K][P] extends SchemaDefinition ? ParseSchema<T[K][P]>["data"]
            : T[K][P] extends {} ? T[K][P] : "string"
            : Fill<P>
        }
        : T[K] extends TupleField
        ? {
            [P in keyof Required<TupleField>]: P extends "elements"
            ? T extends Record<K, Record<P, infer V>>
            ? {
                [U in keyof V]: V[U] extends string
                ? CreateDefinitionFromString<V[U]>
                : V[U] extends FieldType
                ? GetTupleObject<V[U]>
                : never
            }
            : never
            : T[K][P] extends {} ? T[K][P] : Fill<P>
        }
        : T[K] extends VectorField
        ? T[K] extends FlatVector
        ? {
            [P in keyof Required<FlatVector>]: T[K][P] extends {} ? T[K][P] : Fill<P>
        }
        : T[K] extends HNSWVector
        ? {
            [P in keyof Required<HNSWVector>]: T[K][P] extends {} ? T[K][P] : Fill<P>
        }
        : never
        : T[K] extends StringField
        ? {
            [P in keyof Required<StringField>]: T[K][P] extends {} ? T[K][P] : Fill<P>
        }
        : T[K] extends NumberField
        ? {
            [P in keyof Required<NumberField>]: T[K][P] extends {} ? T[K][P] : Fill<P>
        }
        : T[K] extends BigIntField
        ? {
            [P in keyof Required<BigIntField>]: T[K][P] extends {} ? T[K][P] : Fill<P>
        }
        : T[K] extends BaseField
        ? {
            [P in keyof Required<BaseField>]: T[K][P] extends {} ? T[K][P] : Fill<P>
        }
        : CreateDefinitionFromString<T[K] & string>
    },
    references: {
        [K in keyof T as T[K] extends ReferenceField ? K : never]: T[K] extends ReferenceField
        ? {
            [P in keyof ReferenceField]: P extends "schema"
            ? T[K][P] extends "self"
            ? ParseSchema<T>
            : ExtractParsedSchemaDefinition<T[K][P]>
            : T[K][P]
        }
        : never
    }
};

export type CreateDefinitionFromString<T extends string> = T extends "vector"
    ? {
        [K in keyof Required<FlatVector>]: K extends "type"
        ? T
        : K extends "algorithm"
        ? "FLAT"
        : K extends "vecType"
        ? "FLOAT32"
        : K extends "dim"
        ? 128
        : K extends "distance"
        ? "L2"
        : Fill<K>
    }
    : T extends "string"
    ? {
        [K in keyof Required<StringField>]: K extends "type"
        ? T
        : Fill<K>
    }
    : T extends "number"
    ? {
        [K in keyof Required<NumberField>]: K extends "type"
        ? T
        : Fill<K>
    }
    : T extends "bigint"
    ? {
        [K in keyof Required<BigIntField>]: K extends "type"
        ? T
        : Fill<K>
    }
    : {
        [K in keyof Required<BaseField>]: K extends "type"
        ? T
        : Fill<K>
    };

/**
 * `T` is the same as `keyof FieldTypes` but i can't use `extends` here
 */
export type Fill<T> = T extends "optional"
    ? false
    : T extends "sortable"
    ? false
    : T extends "index"
    ? false
    : undefined;

type GetTupleObject<T extends FieldType, P = ParseSchema<{ $: T }>["data"]> = P extends { $: unknown } ? P["$"] : never;