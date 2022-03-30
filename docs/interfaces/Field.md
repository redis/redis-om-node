[redis-om](../README.md) / Field

# Interface: Field

Base interface for all fields.

## Hierarchy

- **`Field`**

  ↳ [`BooleanField`](BooleanField.md)

  ↳ [`DateField`](DateField.md)

  ↳ [`NumberField`](NumberField.md)

  ↳ [`PointField`](PointField.md)

  ↳ [`StringField`](StringField.md)

  ↳ [`StringArrayField`](StringArrayField.md)

  ↳ [`TextField`](TextField.md)

## Table of contents

### Properties

- [alias](Field.md#alias)
- [type](Field.md#type)

## Properties

### alias

• `Optional` **alias**: `string`

The default field name in Redis is the key name defined in the
[SchemaDefinition](../README.md#schemadefinition). Overrides the Redis key name if set.

#### Defined in

[lib/schema/schema-definitions.ts:18](https://github.com/redis/redis-om-node/blob/0843d26/lib/schema/schema-definitions.ts#L18)

___

### type

• **type**: `string`

The type of the field (i.e. string, number, boolean, etc.)

#### Defined in

[lib/schema/schema-definitions.ts:12](https://github.com/redis/redis-om-node/blob/0843d26/lib/schema/schema-definitions.ts#L12)
