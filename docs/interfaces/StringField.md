[redis-om](../README.md) / StringField

# Interface: StringField

A field representing a whole string.

## Hierarchy

- [`Field`](Field.md)

  ↳ **`StringField`**

## Table of contents

### Properties

- [alias](StringField.md#alias)
- [separator](StringField.md#separator)
- [type](StringField.md#type)

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

Due to how RediSearch works, strings and arrays are sometimes stored the same in Redis, as a
simple string. This is the separator used to split those strings when it is an array. If your
StringField contains this separator, this can cause problems. You can change it here to avoid
those problems. Defaults to `|`.

#### Defined in

[lib/schema/schema-definitions.ts:35](https://github.com/redis/redis-om-node/blob/39d7998/lib/schema/schema-definitions.ts#L35)

___

### type

• **type**: ``"string"``

Yep. It's a string.

#### Defined in

[lib/schema/schema-definitions.ts:27](https://github.com/redis/redis-om-node/blob/39d7998/lib/schema/schema-definitions.ts#L27)
