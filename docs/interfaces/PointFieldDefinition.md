[redis-om](../README.md) / PointFieldDefinition

# Interface: PointFieldDefinition

A field representing a point on the globe.

## Hierarchy

- [`BaseFieldDefinition`](BaseFieldDefinition.md)

  ↳ **`PointFieldDefinition`**

## Table of contents

### Properties

- [alias](PointFieldDefinition.md#alias)
- [type](PointFieldDefinition.md#type)

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

### type

• **type**: ``"point"``

Yep. It's a point.

#### Overrides

[BaseFieldDefinition](BaseFieldDefinition.md).[type](BaseFieldDefinition.md#type)

#### Defined in

[lib/schema/definition/point-field-definition.ts:6](https://github.com/redis/redis-om-node/blob/20561ae/lib/schema/definition/point-field-definition.ts#L6)
