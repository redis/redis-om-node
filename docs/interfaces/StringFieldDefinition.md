[redis-om](../README.md) / StringFieldDefinition

# Interface: StringFieldDefinition

A field representing a whole string.

## Hierarchy

- [`BaseFieldDefinition`](BaseFieldDefinition.md)

- [`SortableFieldDefinition`](SortableFieldDefinition.md)

- [`SeparableFieldDefinition`](SeparableFieldDefinition.md)

  ↳ **`StringFieldDefinition`**

## Table of contents

### Properties

- [alias](StringFieldDefinition.md#alias)
- [separator](StringFieldDefinition.md#separator)
- [sortable](StringFieldDefinition.md#sortable)
- [type](StringFieldDefinition.md#type)

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

### separator

• `Optional` **separator**: `string`

Due to how RediSearch works, strings and arrays are sometimes stored the same in Redis, as a
simple string. This is the separator used to split those strings when it is an array. If your
StringField contains this separator, this can cause problems. You can change it here to avoid
those problems. Defaults to `|`.

#### Inherited from

[SeparableFieldDefinition](SeparableFieldDefinition.md).[separator](SeparableFieldDefinition.md#separator)

#### Defined in

[lib/schema/definition/separable-field-definition.ts:9](https://github.com/redis/redis-om-node/blob/20561ae/lib/schema/definition/separable-field-definition.ts#L9)

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

• **type**: ``"string"``

Yep. It's a string.

#### Overrides

[BaseFieldDefinition](BaseFieldDefinition.md).[type](BaseFieldDefinition.md#type)

#### Defined in

[lib/schema/definition/string-field-definition.ts:8](https://github.com/redis/redis-om-node/blob/20561ae/lib/schema/definition/string-field-definition.ts#L8)
