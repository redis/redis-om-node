[redis-om](../README.md) / PointFieldDefinition

# Interface: PointFieldDefinition

A field representing a point on the globe.

## Hierarchy

- [`BaseFieldDefinition`](BaseFieldDefinition.md)

  ↳ **`PointFieldDefinition`**

## Table of contents

### Properties

- [alias](PointFieldDefinition.md#alias)
- [indexed](PointFieldDefinition.md#indexed)
- [type](PointFieldDefinition.md#type)

## Properties

### alias

• `Optional` **alias**: `string`

The default field name in Redis is the key name defined in the
[SchemaDefinition](../README.md#schemadefinition). Overrides the Redis key name if set.

#### Inherited from

[BaseFieldDefinition](BaseFieldDefinition.md).[alias](BaseFieldDefinition.md#alias)

#### Defined in

[lib/schema/definition/base-field-definition.ts:12](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/schema/definition/base-field-definition.ts#L12)

___

### indexed

• `Optional` **indexed**: `boolean`

Is this field indexed and thus searchable with Redis OM. Defaults
to the schema indexedDefault value, currently true.

#### Inherited from

[BaseFieldDefinition](BaseFieldDefinition.md).[indexed](BaseFieldDefinition.md#indexed)

#### Defined in

[lib/schema/definition/base-field-definition.ts:18](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/schema/definition/base-field-definition.ts#L18)

___

### type

• **type**: ``"point"``

Yep. It's a point.

#### Overrides

[BaseFieldDefinition](BaseFieldDefinition.md).[type](BaseFieldDefinition.md#type)

#### Defined in

[lib/schema/definition/point-field-definition.ts:6](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/schema/definition/point-field-definition.ts#L6)
