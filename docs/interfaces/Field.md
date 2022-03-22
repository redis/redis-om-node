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

## Properties

### alias

• `Optional` **alias**: `string`

The default field name in Redis is the key name defined in the
[SchemaDefinition](../README.md#schemadefinition). Overrides the Redis key name if set.

#### Defined in

[lib/schema/schema-definitions.ts:15](https://github.com/redis/redis-om-node/blob/39d7998/lib/schema/schema-definitions.ts#L15)
