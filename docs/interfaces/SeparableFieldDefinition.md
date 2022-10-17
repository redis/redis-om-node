[redis-om](../README.md) / SeparableFieldDefinition

# Interface: SeparableFieldDefinition

Mixin for adding parsing for TAG fields in RediSearch.

## Hierarchy

- **`SeparableFieldDefinition`**

  ↳ [`StringArrayFieldDefinition`](StringArrayFieldDefinition.md)

  ↳ [`StringFieldDefinition`](StringFieldDefinition.md)

## Table of contents

### Properties

- [separator](SeparableFieldDefinition.md#separator)

## Properties

### separator

• `Optional` **separator**: `string`

Due to how RediSearch works, strings and arrays are sometimes stored the same in Redis, as a
simple string. This is the separator used to split those strings when it is an array. If your
StringField contains this separator, this can cause problems. You can change it here to avoid
those problems. Defaults to `|`.

#### Defined in

[lib/schema/definition/separable-field-definition.ts:9](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/schema/definition/separable-field-definition.ts#L9)
