[redis-om](../README.md) / StringField

# Interface: StringField

A field representing a string.

## Hierarchy

- [`Field`](Field.md)

  ↳ **`StringField`**

## Table of contents

### Properties

- [alias](StringField.md#alias)
- [separator](StringField.md#separator)
- [textSearch](StringField.md#textsearch)
- [type](StringField.md#type)

## Properties

### alias

• `Optional` **alias**: `string`

The default field name in Redis is the key name defined in the
[SchemaDefinition](../README.md#schemadefinition). Overrides the Redis key name if set.

#### Inherited from

[Field](Field.md).[alias](Field.md#alias)

#### Defined in

[lib/schema/schema-definitions.ts:7](https://github.com/redis/redis-om-node/blob/ee688a6/lib/schema/schema-definitions.ts#L7)

___

### separator

• `Optional` **separator**: `string`

Due to how RediSearch works, non-full-text strings and arrays are sometimes stored the same
in Redis, as a simple string. This is the separator used to split those strings when it is an
array. If your StringField contains this separator, this can cause problems. You can change it
here to avoid those problems. Defaults to `|`.

#### Defined in

[lib/schema/schema-definitions.ts:30](https://github.com/redis/redis-om-node/blob/ee688a6/lib/schema/schema-definitions.ts#L30)

___

### textSearch

• `Optional` **textSearch**: `boolean`

Enables full-text search on this field when set to `true`. Defaults to `false`.

#### Defined in

[lib/schema/schema-definitions.ts:22](https://github.com/redis/redis-om-node/blob/ee688a6/lib/schema/schema-definitions.ts#L22)

___

### type

• **type**: ``"string"``

Yep. It's a string.

#### Defined in

[lib/schema/schema-definitions.ts:19](https://github.com/redis/redis-om-node/blob/ee688a6/lib/schema/schema-definitions.ts#L19)
