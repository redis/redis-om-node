[redis-om](../README.md) / TextFieldDefinition

# Interface: TextFieldDefinition

A field representing searchable text.

## Hierarchy

- [`BaseFieldDefinition`](BaseFieldDefinition.md)

- [`SortableFieldDefinition`](SortableFieldDefinition.md)

- [`StemmingFieldDefinition`](StemmingFieldDefinition.md)

- [`PhoneticFieldDefinition`](PhoneticFieldDefinition.md)

- [`NormalizedFieldDefinition`](NormalizedFieldDefinition.md)

- [`WeightFieldDefinition`](WeightFieldDefinition.md)

  ↳ **`TextFieldDefinition`**

## Table of contents

### Properties

- [alias](TextFieldDefinition.md#alias)
- [indexed](TextFieldDefinition.md#indexed)
- [matcher](TextFieldDefinition.md#matcher)
- [normalized](TextFieldDefinition.md#normalized)
- [sortable](TextFieldDefinition.md#sortable)
- [stemming](TextFieldDefinition.md#stemming)
- [type](TextFieldDefinition.md#type)
- [weight](TextFieldDefinition.md#weight)

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

### matcher

• `Optional` **matcher**: ``"dm:en"`` \| ``"dm:fr"`` \| ``"dm:pt"`` \| ``"dm:es"``

Enables setting the phonetic matcher to use, supported matchers are:
dm:en - Double Metaphone for English
dm:fr - Double Metaphone for French
dm:pt - Double Metaphone for Portuguese
dm:es - Double Metaphone for Spanish

#### Inherited from

[PhoneticFieldDefinition](PhoneticFieldDefinition.md).[matcher](PhoneticFieldDefinition.md#matcher)

#### Defined in

[lib/schema/definition/phonetic-field-definition.ts:10](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/schema/definition/phonetic-field-definition.ts#L10)

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

### sortable

• `Optional` **sortable**: `boolean`

Enables sorting by this field.

#### Inherited from

[SortableFieldDefinition](SortableFieldDefinition.md).[sortable](SortableFieldDefinition.md#sortable)

#### Defined in

[lib/schema/definition/sortable-field-definition.ts:4](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/schema/definition/sortable-field-definition.ts#L4)

___

### stemming

• `Optional` **stemming**: `boolean`

Is word stemming applied to this field with Redis OM. Defaults
to true.

#### Inherited from

[StemmingFieldDefinition](StemmingFieldDefinition.md).[stemming](StemmingFieldDefinition.md#stemming)

#### Defined in

[lib/schema/definition/stemming-field-definition.ts:7](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/schema/definition/stemming-field-definition.ts#L7)

___

### type

• **type**: ``"text"``

Yep. It's searchable text.

#### Overrides

[BaseFieldDefinition](BaseFieldDefinition.md).[type](BaseFieldDefinition.md#type)

#### Defined in

[lib/schema/definition/text-field-definition.ts:11](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/schema/definition/text-field-definition.ts#L11)

___

### weight

• `Optional` **weight**: `number`

Enables setting the weight to apply to a text field

#### Inherited from

[WeightFieldDefinition](WeightFieldDefinition.md).[weight](WeightFieldDefinition.md#weight)

#### Defined in

[lib/schema/definition/weight-field-definition.ts:4](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/schema/definition/weight-field-definition.ts#L4)
