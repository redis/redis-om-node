[redis-om](../README.md) / NumberField

# Interface: NumberField

A field representing a number.

## Hierarchy

- [`Field`](Field.md)

  ↳ **`NumberField`**

## Table of contents

### Properties

- [alias](NumberField.md#alias)
- [type](NumberField.md#type)

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

• **type**: ``"number"``

Yep. It's a number.

#### Defined in

[lib/schema/schema-definitions.ts:21](https://github.com/redis/redis-om-node/blob/39d7998/lib/schema/schema-definitions.ts#L21)
