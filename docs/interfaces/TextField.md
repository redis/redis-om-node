[redis-om](../README.md) / TextField

# Interface: TextField

A field representing searchable text.

## Hierarchy

- [`Field`](Field.md)

  ↳ **`TextField`**

## Table of contents

### Properties

- [alias](TextField.md#alias)
- [type](TextField.md#type)

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

### type

• **type**: ``"text"``

Yep. It's searchable text.

#### Defined in

[lib/schema/schema-definitions.ts:41](https://github.com/redis/redis-om-node/blob/39d7998/lib/schema/schema-definitions.ts#L41)
