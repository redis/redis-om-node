[redis-om](../README.md) / PointField

# Interface: PointField

A field representing a point on the globe.

## Hierarchy

- [`Field`](Field.md)

  ↳ **`PointField`**

## Table of contents

### Properties

- [alias](PointField.md#alias)
- [type](PointField.md#type)

## Properties

### alias

• `Optional` **alias**: `string`

The default field name in Redis is the key name defined in the
[SchemaDefinition](../README.md#schemadefinition). Overrides the Redis key name if set.

#### Inherited from

[Field](Field.md).[alias](Field.md#alias)

#### Defined in

[lib/schema/schema-definitions.ts:18](https://github.com/redis/redis-om-node/blob/0843d26/lib/schema/schema-definitions.ts#L18)

___

### type

• **type**: ``"point"``

Yep. It's a point.

#### Overrides

[Field](Field.md).[type](Field.md#type)

#### Defined in

[lib/schema/schema-definitions.ts:65](https://github.com/redis/redis-om-node/blob/0843d26/lib/schema/schema-definitions.ts#L65)
