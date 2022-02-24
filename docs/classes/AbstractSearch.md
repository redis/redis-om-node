[redis-om](../README.md) / AbstractSearch

# Class: AbstractSearch<TEntity\>

Abstract base class for [Search](Search.md) and [RawSearch](RawSearch.md) that
contains methods to return search results.

## Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `TEntity` | extends [`Entity`](Entity.md) | The type of [Entity](Entity.md) being sought. |

## Hierarchy

- **`AbstractSearch`**

  ↳ [`Search`](Search.md)

  ↳ [`RawSearch`](RawSearch.md)

## Table of contents

### Accessors

- [return](AbstractSearch.md#return)

### Methods

- [all](AbstractSearch.md#all)
- [count](AbstractSearch.md#count)
- [first](AbstractSearch.md#first)
- [page](AbstractSearch.md#page)
- [returnAll](AbstractSearch.md#returnall)
- [returnCount](AbstractSearch.md#returncount)
- [returnFirst](AbstractSearch.md#returnfirst)
- [returnPage](AbstractSearch.md#returnpage)

## Accessors

### return

• `get` **return**(): [`AbstractSearch`](AbstractSearch.md)<`TEntity`\>

Returns the current instance. Syntactic sugar to make your code more fluent.

#### Returns

[`AbstractSearch`](AbstractSearch.md)<`TEntity`\>

this

#### Defined in

[lib/search/search.ts:115](https://github.com/redis/redis-om-node/blob/39d7998/lib/search/search.ts#L115)

## Methods

### all

▸ **all**(`options?`): `Promise`<`TEntity`[]\>

Returns all the [Entities](Entity.md) that match this query. This method
makes multiple calls to Redis until all the [Entities](Entity.md) are returned.
You can specify the batch size by setting the `pageSize` property on the
options:

```typescript
let entities = await repository.search().returnAll({ pageSize: 100 });
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `options` | `Object` | `undefined` | Options for the call. |
| `options.pageSize` | `number` | `10` | Number of [Entities](Entity.md) returned per batch. |

#### Returns

`Promise`<`TEntity`[]\>

An array of [Entities](Entity.md) matching the query.

#### Defined in

[lib/search/search.ts:96](https://github.com/redis/redis-om-node/blob/39d7998/lib/search/search.ts#L96)

___

### count

▸ **count**(): `Promise`<`number`\>

Returns the number of [Entities](Entity.md) that match this query.

#### Returns

`Promise`<`number`\>

#### Defined in

[lib/search/search.ts:54](https://github.com/redis/redis-om-node/blob/39d7998/lib/search/search.ts#L54)

___

### first

▸ **first**(): `Promise`<`TEntity`\>

Returns only the first [Entity](Entity.md) that matches this query.

#### Returns

`Promise`<`TEntity`\>

#### Defined in

[lib/search/search.ts:77](https://github.com/redis/redis-om-node/blob/39d7998/lib/search/search.ts#L77)

___

### page

▸ **page**(`offset`, `count`): `Promise`<`TEntity`[]\>

Returns a page of [Entities](Entity.md) that match this query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `offset` | `number` | The offset for where to start returning [Entities](Entity.md). |
| `count` | `number` | - |

#### Returns

`Promise`<`TEntity`[]\>

An array of [Entities](Entity.md) matching the query.

#### Defined in

[lib/search/search.ts:67](https://github.com/redis/redis-om-node/blob/39d7998/lib/search/search.ts#L67)

___

### returnAll

▸ **returnAll**(`options?`): `Promise`<`TEntity`[]\>

Alias for [Search.all](Search.md#all).

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `options` | `Object` | `undefined` |
| `options.pageSize` | `number` | `10` |

#### Returns

`Promise`<`TEntity`[]\>

#### Defined in

[lib/search/search.ts:136](https://github.com/redis/redis-om-node/blob/39d7998/lib/search/search.ts#L136)

___

### returnCount

▸ **returnCount**(): `Promise`<`number`\>

Alias for [Search.count](Search.md#count).

#### Returns

`Promise`<`number`\>

#### Defined in

[lib/search/search.ts:122](https://github.com/redis/redis-om-node/blob/39d7998/lib/search/search.ts#L122)

___

### returnFirst

▸ **returnFirst**(): `Promise`<`TEntity`\>

Alias for [Search.first](Search.md#first).

#### Returns

`Promise`<`TEntity`\>

#### Defined in

[lib/search/search.ts:144](https://github.com/redis/redis-om-node/blob/39d7998/lib/search/search.ts#L144)

___

### returnPage

▸ **returnPage**(`offset`, `count`): `Promise`<`TEntity`[]\>

Alias for [Search.page](Search.md#page).

#### Parameters

| Name | Type |
| :------ | :------ |
| `offset` | `number` |
| `count` | `number` |

#### Returns

`Promise`<`TEntity`[]\>

#### Defined in

[lib/search/search.ts:129](https://github.com/redis/redis-om-node/blob/39d7998/lib/search/search.ts#L129)
