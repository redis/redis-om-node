[redis-om](../README.md) / ArrayField

# Interface: ArrayField

A field representing an array of strings.

## Hierarchy

- [`Field`](Field.md)

  ↳ **`ArrayField`**

## Table of contents

### Properties

- [alias](ArrayField.md#alias)
- [separator](ArrayField.md#separator)
- [type](ArrayField.md#type)

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
array. If your ArrayField contains this separator, this can cause problems. You can change it
here to avoid those problems. Defaults to `|`.

#### Defined in

[lib/schema/schema-definitions.ts:50](https://github.com/redis/redis-om-node/blob/ee688a6/lib/schema/schema-definitions.ts#L50)

___

### type

• **type**: ``"array"``

Yep. It's an array.

#### Defined in

[lib/schema/schema-definitions.ts:42](https://github.com/redis/redis-om-node/blob/ee688a6/lib/schema/schema-definitions.ts#L42)
