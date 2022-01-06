[redis-om](../README.md) / NumericField

# Interface: NumericField

A field representing a number.

## Hierarchy

- [`Field`](Field.md)

  ↳ **`NumericField`**

## Table of contents

### Properties

- [alias](NumericField.md#alias)
- [type](NumericField.md#type)

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

• **type**: ``"number"``

Yep. It's a number.

#### Defined in

[lib/schema/schema-definitions.ts:13](https://github.com/redis/redis-om-node/blob/ee688a6/lib/schema/schema-definitions.ts#L13)
