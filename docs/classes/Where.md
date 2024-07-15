[redis-om](../README.md) / Where

# Class: Where

Abstract base class used extensively with [Search](Search.md).

## Hierarchy

- **`Where`**

  ↳ [`WhereField`](WhereField.md)

## Table of contents

### Constructors

- [constructor](Where.md#constructor)

### Methods

- [toString](Where.md#tostring)

## Constructors

### constructor

• **new Where**()

## Methods

### toString

▸ `Abstract` **toString**(): `string`

Converts this [Where](Where.md) into a portion of a RediSearch query.

#### Returns

`string`

#### Defined in

[lib/search/where.ts:8](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where.ts#L8)
