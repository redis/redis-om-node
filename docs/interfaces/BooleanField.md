[redis-om](../README.md) / BooleanField

# Interface: BooleanField

A field representing a boolean.

## Hierarchy

- [`Field`](Field.md)

  ↳ **`BooleanField`**

## Table of contents

### Properties

- [alias](BooleanField.md#alias)
- [type](BooleanField.md#type)

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

### type

• **type**: ``"boolean"``

Yep. It's a boolean.

#### Defined in

[lib/schema/schema-definitions.ts:36](https://github.com/redis/redis-om-node/blob/ee688a6/lib/schema/schema-definitions.ts#L36)
