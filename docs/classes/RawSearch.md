[redis-om](../README.md) / RawSearch

# Class: RawSearch<TEntity\>

Entry point to raw search which allows using raw RediSearch queries
against Redis OM. Requires that RediSearch (and optionally RedisJSON) be
installed.

## Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `TEntity` | extends [`Entity`](Entity.md) | The type of [Entity](Entity.md) being sought. |

## Hierarchy

- [`AbstractSearch`](AbstractSearch.md)<`TEntity`\>

  ↳ **`RawSearch`**

## Table of contents

### Accessors

- [return](RawSearch.md#return)

### Methods

- [all](RawSearch.md#all)
- [count](RawSearch.md#count)
- [first](RawSearch.md#first)
- [page](RawSearch.md#page)
- [returnAll](RawSearch.md#returnall)
- [returnCount](RawSearch.md#returncount)
- [returnFirst](RawSearch.md#returnfirst)
- [returnPage](RawSearch.md#returnpage)

## Accessors

### return

• `get` **return**(): [`AbstractSearch`](AbstractSearch.md)<`TEntity`\>

Returns the current instance. Syntactic sugar to make your code more fluent.

#### Returns

[`AbstractSearch`](AbstractSearch.md)<`TEntity`\>

this

#### Inherited from

AbstractSearch.return

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[all](AbstractSearch.md#all)

#### Defined in

[lib/search/search.ts:96](https://github.com/redis/redis-om-node/blob/39d7998/lib/search/search.ts#L96)

___

### count

▸ **count**(): `Promise`<`number`\>

Returns the number of [Entities](Entity.md) that match this query.

#### Returns

`Promise`<`number`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[count](AbstractSearch.md#count)

#### Defined in

[lib/search/search.ts:54](https://github.com/redis/redis-om-node/blob/39d7998/lib/search/search.ts#L54)

___

### first

▸ **first**(): `Promise`<`TEntity`\>

Returns only the first [Entity](Entity.md) that matches this query.

#### Returns

`Promise`<`TEntity`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[first](AbstractSearch.md#first)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[page](AbstractSearch.md#page)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnAll](AbstractSearch.md#returnall)

#### Defined in

[lib/search/search.ts:136](https://github.com/redis/redis-om-node/blob/39d7998/lib/search/search.ts#L136)

___

### returnCount

▸ **returnCount**(): `Promise`<`number`\>

Alias for [Search.count](Search.md#count).

#### Returns

`Promise`<`number`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnCount](AbstractSearch.md#returncount)

#### Defined in

[lib/search/search.ts:122](https://github.com/redis/redis-om-node/blob/39d7998/lib/search/search.ts#L122)

___

### returnFirst

▸ **returnFirst**(): `Promise`<`TEntity`\>

Alias for [Search.first](Search.md#first).

#### Returns

`Promise`<`TEntity`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnFirst](AbstractSearch.md#returnfirst)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnPage](AbstractSearch.md#returnpage)

#### Defined in

[lib/search/search.ts:129](https://github.com/redis/redis-om-node/blob/39d7998/lib/search/search.ts#L129)
