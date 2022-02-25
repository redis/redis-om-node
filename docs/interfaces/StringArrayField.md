[redis-om](../README.md) / StringArrayField

# Interface: StringArrayField

A field representing an array of strings.

## Hierarchy

- [`Field`](Field.md)

  ↳ **`StringArrayField`**

## Table of contents

### Properties

- [alias](StringArrayField.md#alias)
- [separator](StringArrayField.md#separator)
- [type](StringArrayField.md#type)

## Properties

### alias

• `Optional` **alias**: `string`

The default field name in Redis is the key name defined in the
[SchemaDefinition](../README.md#schemadefinition). Overrides the Redis key name if set.

#### Inherited from

[Field](Field.md).[alias](Field.md#alias)

#### Defined in

[lib/schema/schema-definitions.ts:15](https://github.com/redis/redis-om-node/blob/39d7998/lib/schema/schema-definitions.ts#L15)

___

### separator

• `Optional` **separator**: `string`

Due to how RediSearch works, non-full-text strings and arrays are sometimes stored the same
in Redis, as a simple string. This is the separator used to split those strings when it is an
array. If your StringArrayField contains this separator, this can cause problems. You can change it
here to avoid those problems. Defaults to `|`.

#### Defined in

[lib/schema/schema-definitions.ts:73](https://github.com/redis/redis-om-node/blob/39d7998/lib/schema/schema-definitions.ts#L73)

___

### type

• **type**: ``"string[]"``

Yep. It's a string array.

#### Defined in

[lib/schema/schema-definitions.ts:65](https://github.com/redis/redis-om-node/blob/39d7998/lib/schema/schema-definitions.ts#L65)
