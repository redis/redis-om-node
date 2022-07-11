[redis-om](../README.md) / CaseSensitiveFieldDefinition

# Interface: CaseSensitiveFieldDefinition

Mixin for adding caseSensitive to a TAG field.

## Hierarchy

- **`CaseSensitiveFieldDefinition`**

  ↳ [`StringArrayFieldDefinition`](StringArrayFieldDefinition.md)

  ↳ [`StringFieldDefinition`](StringFieldDefinition.md)

## Table of contents

### Properties

- [caseSensitive](CaseSensitiveFieldDefinition.md#casesensitive)

## Properties

### caseSensitive

• `Optional` **caseSensitive**: `boolean`

Is the original case of this field indexed with Redis OM. Defaults
to false.

#### Defined in

[lib/schema/definition/casesensitive-field-definition.ts:7](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/schema/definition/casesensitive-field-definition.ts#L7)
