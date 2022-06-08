[redis-om](../README.md) / NormalizedFieldDefinition

# Interface: NormalizedFieldDefinition

Mixin for adding unf to a field.

## Hierarchy

- **`NormalizedFieldDefinition`**

  ↳ [`StringFieldDefinition`](StringFieldDefinition.md)

  ↳ [`StringArrayFieldDefinition`](StringArrayFieldDefinition.md)

  ↳ [`TextFieldDefinition`](TextFieldDefinition.md)

## Table of contents

### Properties

- [normalized](NormalizedFieldDefinition.md#normalized)

## Properties

### normalized

• `Optional` **normalized**: `boolean`

Is this (sortable) field normalized when indexed. Defaults
to true.

#### Defined in

[lib/schema/definition/normalized-field-definition.ts:7](https://github.com/redis/redis-om-node/blob/48d362b/lib/schema/definition/normalized-field-definition.ts#L7)
