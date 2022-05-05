[redis-om](../README.md) / BaseFieldDefinition

# Interface: BaseFieldDefinition

Base interface for all fields.

## Hierarchy

- **`BaseFieldDefinition`**

  ↳ [`BooleanFieldDefinition`](BooleanFieldDefinition.md)

  ↳ [`DateFieldDefinition`](DateFieldDefinition.md)

  ↳ [`NumberFieldDefinition`](NumberFieldDefinition.md)

  ↳ [`PointFieldDefinition`](PointFieldDefinition.md)

  ↳ [`StringFieldDefinition`](StringFieldDefinition.md)

  ↳ [`StringArrayFieldDefinition`](StringArrayFieldDefinition.md)

  ↳ [`TextFieldDefinition`](TextFieldDefinition.md)

## Table of contents

### Properties

- [alias](BaseFieldDefinition.md#alias)
- [type](BaseFieldDefinition.md#type)

## Properties

### alias

• `Optional` **alias**: `string`

The default field name in Redis is the key name defined in the
[SchemaDefinition](../README.md#schemadefinition). Overrides the Redis key name if set.

#### Defined in

[lib/schema/definition/base-field-definition.ts:12](https://github.com/redis/redis-om-node/blob/20561ae/lib/schema/definition/base-field-definition.ts#L12)

___

### type

• **type**: [`SchemaFieldType`](../README.md#schemafieldtype)

The type of the field (i.e. string, number, boolean, etc.)

#### Defined in

[lib/schema/definition/base-field-definition.ts:6](https://github.com/redis/redis-om-node/blob/20561ae/lib/schema/definition/base-field-definition.ts#L6)
