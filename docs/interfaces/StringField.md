[redis-om](../README.md) / StringField

# Interface: StringField

A field representing a whole string.

## Hierarchy

- [`Field`](Field.md)

- [`Sortable`](Sortable.md)

- [`Separable`](Separable.md)

  ↳ **`StringField`**

## Table of contents

### Properties

- [alias](StringField.md#alias)
- [separator](StringField.md#separator)
- [sortable](StringField.md#sortable)
- [type](StringField.md#type)

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

### separator

• `Optional` **separator**: `string`

Due to how RediSearch works, strings and arrays are sometimes stored the same in Redis, as a
simple string. This is the separator used to split those strings when it is an array. If your
StringField contains this separator, this can cause problems. You can change it here to avoid
those problems. Defaults to `|`.

#### Inherited from

[Separable](Separable.md).[separator](Separable.md#separator)

#### Defined in

[lib/schema/schema-definitions.ts:35](https://github.com/redis/redis-om-node/blob/0843d26/lib/schema/schema-definitions.ts#L35)

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

• **type**: ``"string"``

Yep. It's a string.

#### Overrides

[Field](Field.md).[type](Field.md#type)

#### Defined in

[lib/schema/schema-definitions.ts:47](https://github.com/redis/redis-om-node/blob/0843d26/lib/schema/schema-definitions.ts#L47)
