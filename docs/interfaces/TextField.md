[redis-om](../README.md) / TextField

# Interface: TextField

A field representing searchable text.

## Hierarchy

- [`Field`](Field.md)

- [`Sortable`](Sortable.md)

  ↳ **`TextField`**

## Table of contents

### Properties

- [alias](TextField.md#alias)
- [sortable](TextField.md#sortable)
- [type](TextField.md#type)

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

### sortable

• `Optional` **sortable**: `boolean`

Enables sorting by this field.

#### Inherited from

[Sortable](Sortable.md).[sortable](Sortable.md#sortable)

#### Defined in

[lib/schema/schema-definitions.ts:24](https://github.com/redis/redis-om-node/blob/0843d26/lib/schema/schema-definitions.ts#L24)

___

### type

• **type**: ``"text"``

Yep. It's searchable text.

#### Overrides

[Field](Field.md).[type](Field.md#type)

#### Defined in

[lib/schema/schema-definitions.ts:53](https://github.com/redis/redis-om-node/blob/0843d26/lib/schema/schema-definitions.ts#L53)
