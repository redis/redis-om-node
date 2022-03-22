[redis-om](../README.md) / DateField

# Interface: DateField

A field representing a date/time.

## Hierarchy

- [`Field`](Field.md)

  ↳ **`DateField`**

## Table of contents

### Properties

- [alias](DateField.md#alias)
- [type](DateField.md#type)

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

• **type**: ``"date"``

Yep. It's a date.

#### Defined in

[lib/schema/schema-definitions.ts:59](https://github.com/redis/redis-om-node/blob/39d7998/lib/schema/schema-definitions.ts#L59)
