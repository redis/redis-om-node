[redis-om](../README.md) / BaseFieldDefinition

# Interface: BaseFieldDefinition

Base interface for all fields.

## Hierarchy

- **`BaseFieldDefinition`**

  ↳ [`BooleanFieldDefinition`](BooleanFieldDefinition.md)

  ↳ [`DateFieldDefinition`](DateFieldDefinition.md)

  ↳ [`NumberFieldDefinition`](NumberFieldDefinition.md)

  ↳ [`PointFieldDefinition`](PointFieldDefinition.md)

  ↳ [`StringArrayFieldDefinition`](StringArrayFieldDefinition.md)

  ↳ [`StringFieldDefinition`](StringFieldDefinition.md)

  ↳ [`TextFieldDefinition`](TextFieldDefinition.md)

## Table of contents

### Properties

- [alias](BaseFieldDefinition.md#alias)
- [indexed](BaseFieldDefinition.md#indexed)
- [type](BaseFieldDefinition.md#type)

## Properties

### alias

• `Optional` **alias**: `string`

The default field name in Redis is the key name defined in the
[SchemaDefinition](../README.md#schemadefinition). Overrides the Redis key name if set.

#### Defined in

[lib/schema/definition/base-field-definition.ts:12](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/schema/definition/base-field-definition.ts#L12)

___

### indexed

• `Optional` **indexed**: `boolean`

Is this field indexed and thus searchable with Redis OM. Defaults
to the schema indexedDefault value, currently true.

#### Defined in

[lib/schema/definition/base-field-definition.ts:18](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/schema/definition/base-field-definition.ts#L18)

___

### type

• **type**: [`SchemaFieldType`](../README.md#schemafieldtype)

The type of the field (i.e. string, number, boolean, etc.)

#### Defined in

[lib/schema/definition/base-field-definition.ts:6](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/schema/definition/base-field-definition.ts#L6)
