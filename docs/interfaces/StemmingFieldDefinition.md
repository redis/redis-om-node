[redis-om](../README.md) / StemmingFieldDefinition

# Interface: StemmingFieldDefinition

Mixin for adding stemming to a field.

## Hierarchy

- **`StemmingFieldDefinition`**

  ↳ [`TextFieldDefinition`](TextFieldDefinition.md)

## Table of contents

### Properties

- [stemming](StemmingFieldDefinition.md#stemming)

## Properties

### stemming

• `Optional` **stemming**: `boolean`

Is word stemming applied to this field with Redis OM. Defaults
to true.

#### Defined in

[lib/schema/definition/stemming-field-definition.ts:7](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/schema/definition/stemming-field-definition.ts#L7)
