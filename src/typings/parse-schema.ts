import type { ExtractParsedSchemaDefinition } from "./extract-schema-generics";
import type { Schema } from "../schema";

import type {
    InnerSchemaDefinition,
    SchemaDefinition,
    ReferenceField,
    RelationField,
    ObjectField,
    StringField,
    NumberField,
    VectorField,
    BigIntField,
    ArrayField,
    TupleField,
    FlatVector,
    HNSWVector,
    BaseField,
    FieldType
} from "./schema-and-fields-definition";

export type ParseSchema<T extends SchemaDefinition> = {
    data: ParseSchemaData<T>,
    references: {
        [K in keyof T as T[K] extends ReferenceField ? K : never]: T[K] extends ReferenceField
        ? {
            [P in keyof ReferenceField]: P extends "schema"
            ? T[K][P] extends "self"
            ? ParseSchemaData<T>
            : ExtractParsedSchemaDefinition<T[K][P]>["data"]
            : T[K][P]
        }
        : never
    },
    relations: {
        [K in keyof T as T[K] extends RelationField ? K : never]: T[K] extends RelationField
        ? {
            [P in keyof Required<RelationField>]: P extends "schema"
            ? T[K][P] extends "self"
            ? ParseSchemaData<T, true>
            : ExtractParsedSchemaDefinition<T[K][P]>["data"]
            : P extends "meta"
            ? T[K][P] extends {}
            ? T[K][P] extends Schema<any, any, infer U>
            ? U["data"] & ParseSchemaData<{ in: "string", out: "string" }>
            : T[K][P] extends InnerSchemaDefinition
            ? ParseSchemaData<T[K][P] & { in: "string", out: "string" }, true>
            : never
            : undefined
            : T[K][P]
        }
        : never
    }
};

export type ParseSchemaData<T extends SchemaDefinition, REL extends boolean = false> = {
    [K in keyof T as T[K] extends ReferenceField ? never : T[K] extends RelationField ? never : K]: T[K] extends ObjectField
    ? ParseObjectField<T[K], REL>
    : T[K] extends ArrayField
    ? ParseArrayField<T[K], REL>
    : T[K] extends TupleField
    ? ParseTupleField<T[K], REL>
    : T[K] extends VectorField
    ? T[K] extends FlatVector
    ? {
        [P in keyof Required<FlatVector>]: T[K][P] extends {} ? T[K][P] : Fill<P, REL>
    }
    : T[K] extends HNSWVector
    ? {
        [P in keyof Required<HNSWVector>]: T[K][P] extends {} ? T[K][P] : Fill<P, REL>
    }
    : never
    : T[K] extends StringField
    ? {
        [P in keyof Required<StringField>]: T[K][P] extends {} ? T[K][P] : Fill<P, REL>
    }
    : T[K] extends NumberField
    ? {
        [P in keyof Required<NumberField>]: T[K][P] extends {} ? T[K][P] : Fill<P, REL>
    }
    : T[K] extends BigIntField
    ? {
        [P in keyof Required<BigIntField>]: T[K][P] extends {} ? T[K][P] : Fill<P, REL>
    }
    : T[K] extends BaseField
    ? {
        [P in keyof Required<BaseField>]: T[K][P] extends {} ? T[K][P] : Fill<P, REL>
    }
    : CreateDefinitionFromString<T[K] & string, REL>
};

type ParseObjectField<T extends ObjectField, REL extends boolean> = {
    [P in keyof Required<ObjectField>]: P extends "properties"
    ? T[P] extends {}
    ? T[P] extends Schema<any, any, infer U>
    ? U["data"]
    : T[P] extends InnerSchemaDefinition
    ? ParseSchemaData<T[P], REL extends true ? true : T["index"] extends true ? true : false>
    : never
    : undefined
    : T[P] extends {} ? T[P] : Fill<P, REL>
};

type ParseArrayField<T extends ArrayField, REL extends boolean> = {
    [P in keyof Required<ArrayField>]: P extends "elements"
    ? T[P] extends InnerSchemaDefinition ? ParseSchemaData<T[P], REL extends true ? true : T["index"] extends true ? true : false>
    : T[P] extends {} ? T[P] : "string"
    : T[P] extends {} ? T[P] : Fill<P, REL>
};

type ParseTupleField<T extends TupleField, REL extends boolean> = {
    [P in keyof Required<TupleField>]: P extends "elements"
    ? T extends Record<P, infer V>
    ? {
        [U in keyof V]: V[U] extends string
        ? CreateDefinitionFromString<V[U], REL extends true ? true : T["index"] extends true ? true : false>
        : V[U] extends FieldType
        ? GetTupleObject<V[U], REL extends true ? true : T["index"] extends true ? true : false>
        : never
    }
    : never
    : T[P] extends {} ? T[P] : Fill<P, REL>
};

type CreateDefinitionFromString<T extends string, REL extends boolean> = T extends "vector"
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
        : Fill<K, REL>
    }
    : T extends "string"
    ? {
        [K in keyof Required<StringField>]: K extends "type"
        ? T
        : Fill<K, REL>
    }
    : T extends "number"
    ? {
        [K in keyof Required<NumberField>]: K extends "type"
        ? T
        : Fill<K, REL>
    }
    : T extends "bigint"
    ? {
        [K in keyof Required<BigIntField>]: K extends "type"
        ? T
        : Fill<K, REL>
    }
    : {
        [K in keyof Required<BaseField>]: K extends "type"
        ? T
        : Fill<K, REL>
    };

/**
 * `T` is the same as `keyof FieldTypes` but i can't use `extends` here
 */
type Fill<T, REL extends boolean> = T extends "optional"
    ? false
    : T extends "sortable"
    ? false
    : T extends "index"
    ? REL extends true ? true : false
    : undefined;

type GetTupleObject<T extends FieldType, REL extends boolean, P = ParseSchemaData<{ $: T }, REL>> = P extends { $: unknown } ? P["$"] : never;