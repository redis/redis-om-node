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

[lib/schema/schema-definitions.ts:15](https://github.com/redis/redis-om-node/blob/39d7998/lib/schema/schema-definitions.ts#L15)

___

### type

• **type**: ``"point"``

Yep. It's a point.

#### Defined in

[lib/schema/schema-definitions.ts:53](https://github.com/redis/redis-om-node/blob/39d7998/lib/schema/schema-definitions.ts#L53)
