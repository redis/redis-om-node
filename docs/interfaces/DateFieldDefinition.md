[redis-om](../README.md) / DateFieldDefinition

# Interface: DateFieldDefinition

A field representing a date/time.

## Hierarchy

- [`BaseFieldDefinition`](BaseFieldDefinition.md)

- [`SortableFieldDefinition`](SortableFieldDefinition.md)

  ↳ **`DateFieldDefinition`**

## Table of contents

### Properties

- [alias](DateFieldDefinition.md#alias)
- [sortable](DateFieldDefinition.md#sortable)
- [type](DateFieldDefinition.md#type)

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

### sortable

• `Optional` **sortable**: `boolean`

Enables sorting by this field.

#### Inherited from

[SortableFieldDefinition](SortableFieldDefinition.md).[sortable](SortableFieldDefinition.md#sortable)

#### Defined in

[lib/schema/definition/sortable-field-definition.ts:4](https://github.com/redis/redis-om-node/blob/20561ae/lib/schema/definition/sortable-field-definition.ts#L4)

___

### type

• **type**: ``"date"``

Yep. It's a date.

#### Overrides

[BaseFieldDefinition](BaseFieldDefinition.md).[type](BaseFieldDefinition.md#type)

#### Defined in

[lib/schema/definition/date-field-definition.ts:7](https://github.com/redis/redis-om-node/blob/20561ae/lib/schema/definition/date-field-definition.ts#L7)
