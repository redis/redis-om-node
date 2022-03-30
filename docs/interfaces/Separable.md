[redis-om](../README.md) / Separable

# Interface: Separable

Mixin for adding parsing for TAG fields in RediSearch.

## Hierarchy

- **`Separable`**

  ↳ [`StringField`](StringField.md)

  ↳ [`StringArrayField`](StringArrayField.md)

## Table of contents

### Properties

- [separator](Separable.md#separator)

## Properties

### separator

• `Optional` **separator**: `string`

Due to how RediSearch works, strings and arrays are sometimes stored the same in Redis, as a
simple string. This is the separator used to split those strings when it is an array. If your
StringField contains this separator, this can cause problems. You can change it here to avoid
those problems. Defaults to `|`.

#### Defined in

[lib/schema/schema-definitions.ts:35](https://github.com/redis/redis-om-node/blob/0843d26/lib/schema/schema-definitions.ts#L35)
