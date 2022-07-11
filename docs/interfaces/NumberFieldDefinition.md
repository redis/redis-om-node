[redis-om](../README.md) / NumberFieldDefinition

# Interface: NumberFieldDefinition

A field representing a number.

## Hierarchy

- [`BaseFieldDefinition`](BaseFieldDefinition.md)

- [`SortableFieldDefinition`](SortableFieldDefinition.md)

  ↳ **`NumberFieldDefinition`**

## Table of contents

### Properties

- [alias](NumberFieldDefinition.md#alias)
- [indexed](NumberFieldDefinition.md#indexed)
- [sortable](NumberFieldDefinition.md#sortable)
- [type](NumberFieldDefinition.md#type)

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

### sortable

• `Optional` **sortable**: `boolean`

Enables sorting by this field.

#### Inherited from

[SortableFieldDefinition](SortableFieldDefinition.md).[sortable](SortableFieldDefinition.md#sortable)

#### Defined in

[lib/schema/definition/sortable-field-definition.ts:4](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/schema/definition/sortable-field-definition.ts#L4)

___

### type

• **type**: ``"number"``

Yep. It's a number.

#### Overrides

[BaseFieldDefinition](BaseFieldDefinition.md).[type](BaseFieldDefinition.md#type)

#### Defined in

[lib/schema/definition/number-field-definition.ts:7](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/schema/definition/number-field-definition.ts#L7)
