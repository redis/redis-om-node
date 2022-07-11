[redis-om](../README.md) / StringFieldDefinition

# Interface: StringFieldDefinition

A field representing a whole string.

## Hierarchy

- [`BaseFieldDefinition`](BaseFieldDefinition.md)

- [`SeparableFieldDefinition`](SeparableFieldDefinition.md)

- [`SortableFieldDefinition`](SortableFieldDefinition.md)

- [`CaseSensitiveFieldDefinition`](CaseSensitiveFieldDefinition.md)

- [`NormalizedFieldDefinition`](NormalizedFieldDefinition.md)

  ↳ **`StringFieldDefinition`**

## Table of contents

### Properties

- [alias](StringFieldDefinition.md#alias)
- [caseSensitive](StringFieldDefinition.md#casesensitive)
- [indexed](StringFieldDefinition.md#indexed)
- [normalized](StringFieldDefinition.md#normalized)
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

[lib/schema/definition/base-field-definition.ts:12](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/schema/definition/base-field-definition.ts#L12)

___

### caseSensitive

• `Optional` **caseSensitive**: `boolean`

Is the original case of this field indexed with Redis OM. Defaults
to false.

#### Inherited from

[CaseSensitiveFieldDefinition](CaseSensitiveFieldDefinition.md).[caseSensitive](CaseSensitiveFieldDefinition.md#casesensitive)

#### Defined in

[lib/schema/definition/casesensitive-field-definition.ts:7](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/schema/definition/casesensitive-field-definition.ts#L7)

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

### normalized

• `Optional` **normalized**: `boolean`

Is this (sortable) field normalized when indexed. Defaults
to true.

#### Inherited from

[NormalizedFieldDefinition](NormalizedFieldDefinition.md).[normalized](NormalizedFieldDefinition.md#normalized)

#### Defined in

[lib/schema/definition/normalized-field-definition.ts:7](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/schema/definition/normalized-field-definition.ts#L7)

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

[lib/schema/definition/separable-field-definition.ts:9](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/schema/definition/separable-field-definition.ts#L9)

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

• **type**: ``"string"``

Yep. It's a string.

#### Overrides

[BaseFieldDefinition](BaseFieldDefinition.md).[type](BaseFieldDefinition.md#type)

#### Defined in

[lib/schema/definition/string-field-definition.ts:10](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/schema/definition/string-field-definition.ts#L10)
