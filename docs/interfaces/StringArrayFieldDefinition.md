[redis-om](../README.md) / StringArrayFieldDefinition

# Interface: StringArrayFieldDefinition

A field representing an array of strings.

## Hierarchy

- [`BaseFieldDefinition`](BaseFieldDefinition.md)

- [`SeparableFieldDefinition`](SeparableFieldDefinition.md)

  ↳ **`StringArrayFieldDefinition`**

## Table of contents

### Properties

- [alias](StringArrayFieldDefinition.md#alias)
- [separator](StringArrayFieldDefinition.md#separator)
- [type](StringArrayFieldDefinition.md#type)

## Properties

### alias

• `Optional` **alias**: `string`

The default field name in Redis is the key name defined in the
[SchemaDefinition](../README.md#schemadefinition). Overrides the Redis key name if set.

#### Inherited from

[BaseFieldDefinition](BaseFieldDefinition.md).[alias](BaseFieldDefinition.md#alias)

#### Defined in

[lib/schema/definition/base-field-definition.ts:12](https://github.com/redis/redis-om-node/blob/20561ae/lib/schema/definition/base-field-definition.ts#L12)

___

### separator

• `Optional` **separator**: `string`

Due to how RediSearch works, strings and arrays are sometimes stored the same in Redis, as a
simple string. This is the separator used to split those strings when it is an array. If your
StringField contains this separator, this can cause problems. You can change it here to avoid
those problems. Defaults to `|`.

#### Inherited from

[SeparableFieldDefinition](SeparableFieldDefinition.md).[separator](SeparableFieldDefinition.md#separator)

#### Defined in

[lib/schema/definition/separable-field-definition.ts:9](https://github.com/redis/redis-om-node/blob/20561ae/lib/schema/definition/separable-field-definition.ts#L9)

___

### type

• **type**: ``"string[]"``

Yep. It's a string array.

#### Overrides

[BaseFieldDefinition](BaseFieldDefinition.md).[type](BaseFieldDefinition.md#type)

#### Defined in

[lib/schema/definition/string-array-field-definition.ts:7](https://github.com/redis/redis-om-node/blob/20561ae/lib/schema/definition/string-array-field-definition.ts#L7)
