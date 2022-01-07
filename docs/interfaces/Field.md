[redis-om](../README.md) / Field

# Interface: Field

Base interface for all fields.

## Hierarchy

- **`Field`**

  ↳ [`NumericField`](NumericField.md)

  ↳ [`StringField`](StringField.md)

  ↳ [`BooleanField`](BooleanField.md)

  ↳ [`ArrayField`](ArrayField.md)

## Table of contents

### Properties

- [alias](Field.md#alias)

## Properties

### alias

• `Optional` **alias**: `string`

The default field name in Redis is the key name defined in the
[SchemaDefinition](../README.md#schemadefinition). Overrides the Redis key name if set.

#### Defined in

[lib/schema/schema-definitions.ts:7](https://github.com/redis/redis-om-node/blob/ee688a6/lib/schema/schema-definitions.ts#L7)
