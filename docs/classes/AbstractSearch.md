[redis-om](../README.md) / AbstractSearch

# Class: AbstractSearch<T\>

Abstract base class for [Search](Search.md) and [RawSearch](RawSearch.md) that
contains methods to return search results.

**`Template`**

The type of [Entity](../README.md#entity) being sought.

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Entity`](../README.md#entity) = `Record`<`string`, `any`\> |

## Hierarchy

- **`AbstractSearch`**

  ↳ [`RawSearch`](RawSearch.md)

  ↳ [`Search`](Search.md)

## Table of contents

### Accessors

- [return](AbstractSearch.md#return)

### Methods

- [all](AbstractSearch.md#all)
- [allIds](AbstractSearch.md#allids)
- [allKeys](AbstractSearch.md#allkeys)
- [count](AbstractSearch.md#count)
- [first](AbstractSearch.md#first)
- [firstId](AbstractSearch.md#firstid)
- [firstKey](AbstractSearch.md#firstkey)
- [iterator](AbstractSearch.md#iterator)
- [iteratorOfIds](AbstractSearch.md#iteratorofids)
- [iteratorOfKeys](AbstractSearch.md#iteratorofkeys)
- [max](AbstractSearch.md#max)
- [maxId](AbstractSearch.md#maxid)
- [maxKey](AbstractSearch.md#maxkey)
- [min](AbstractSearch.md#min)
- [minId](AbstractSearch.md#minid)
- [minKey](AbstractSearch.md#minkey)
- [page](AbstractSearch.md#page)
- [pageOfIds](AbstractSearch.md#pageofids)
- [pageOfKeys](AbstractSearch.md#pageofkeys)
- [returnAll](AbstractSearch.md#returnall)
- [returnAllIds](AbstractSearch.md#returnallids)
- [returnAllKeys](AbstractSearch.md#returnallkeys)
- [returnCount](AbstractSearch.md#returncount)
- [returnFirst](AbstractSearch.md#returnfirst)
- [returnFirstId](AbstractSearch.md#returnfirstid)
- [returnFirstKey](AbstractSearch.md#returnfirstkey)
- [returnIterator](AbstractSearch.md#returniterator)
- [returnIteratorOfIds](AbstractSearch.md#returniteratorofids)
- [returnIteratorOfKeys](AbstractSearch.md#returniteratorofkeys)
- [returnMax](AbstractSearch.md#returnmax)
- [returnMaxId](AbstractSearch.md#returnmaxid)
- [returnMaxKey](AbstractSearch.md#returnmaxkey)
- [returnMin](AbstractSearch.md#returnmin)
- [returnMinId](AbstractSearch.md#returnminid)
- [returnMinKey](AbstractSearch.md#returnminkey)
- [returnPage](AbstractSearch.md#returnpage)
- [returnPageOfIds](AbstractSearch.md#returnpageofids)
- [returnPageOfKeys](AbstractSearch.md#returnpageofkeys)
- [sortAsc](AbstractSearch.md#sortasc)
- [sortAscending](AbstractSearch.md#sortascending)
- [sortBy](AbstractSearch.md#sortby)
- [sortDesc](AbstractSearch.md#sortdesc)
- [sortDescending](AbstractSearch.md#sortdescending)

## Accessors

### return

• `get` **return**(): [`AbstractSearch`](AbstractSearch.md)<`T`\>

Returns the current instance. Syntactic sugar to make your code more fluent.

#### Returns

[`AbstractSearch`](AbstractSearch.md)<`T`\>

this

#### Defined in

[lib/search/search.ts:361](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L361)

## Methods

### all

▸ **all**(`options?`): `Promise`<`T`[]\>

Returns all the [Entities](../README.md#entity) that match this query. This method
makes multiple calls to Redis until all the [Entities](../README.md#entity) are returned.
You can specify the batch size by setting the `pageSize` property on the
options:

```typescript
const entities = await repository.search().returnAll({ pageSize: 100 })
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `options` | `Object` | `undefined` | Options for the call. |
| `options.pageSize` | `number` | `10` | Number of [Entities](../README.md#entity) returned per batch. |

#### Returns

`Promise`<`T`[]\>

An array of [Entities](../README.md#entity) matching the query.

#### Defined in

[lib/search/search.ts:272](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L272)

___

### allIds

▸ **allIds**(`options?`): `Promise`<`string`[]\>

Returns all the entity IDs that match this query. This method
makes multiple calls to Redis until all the entity IDs are returned.
You can specify the batch size by setting the `pageSize` property on the
options:

```typescript
const keys = await repository.search().returnAllIds({ pageSize: 100 })
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `options` | `Object` | `undefined` | Options for the call. |
| `options.pageSize` | `number` | `10` | Number of entity IDs returned per batch. |

#### Returns

`Promise`<`string`[]\>

An array of entity IDs matching the query.

#### Defined in

[lib/search/search.ts:290](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L290)

___

### allKeys

▸ **allKeys**(`options?`): `Promise`<`string`[]\>

Returns all the key names in Redis that match this query. This method
makes multiple calls to Redis until all the key names are returned.
You can specify the batch size by setting the `pageSize` property on the
options:

```typescript
const keys = await repository.search().returnAllKeys({ pageSize: 100 })
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `options` | `Object` | `undefined` | Options for the call. |
| `options.pageSize` | `number` | `10` | Number of key names returned per batch. |

#### Returns

`Promise`<`string`[]\>

An array of key names matching the query.

#### Defined in

[lib/search/search.ts:308](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L308)

___

### count

▸ **count**(): `Promise`<`number`\>

Returns the number of [Entities](../README.md#entity) that match this query.

#### Returns

`Promise`<`number`\>

#### Defined in

[lib/search/search.ts:196](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L196)

___

### first

▸ **first**(): `Promise`<``null`` \| `T`\>

Returns the first [Entity](../README.md#entity) that matches this query.

#### Returns

`Promise`<``null`` \| `T`\>

#### Defined in

[lib/search/search.ts:237](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L237)

___

### firstId

▸ **firstId**(): `Promise`<``null`` \| `string`\>

Returns the first entity ID that matches this query.

#### Returns

`Promise`<``null`` \| `string`\>

#### Defined in

[lib/search/search.ts:245](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L245)

___

### firstKey

▸ **firstKey**(): `Promise`<``null`` \| `string`\>

Returns the first key name that matches this query.

#### Returns

`Promise`<``null`` \| `string`\>

#### Defined in

[lib/search/search.ts:253](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L253)

___

### iterator

▸ **iterator**(`options?`): `AsyncGenerator`<`T`, `any`, `unknown`\>

Returns an async generator that yields [Entities](../README.md#entity) matching
the query. Internally, this method makes multiple calls to Redis as you
consume the iterator until all the [Entities](../README.md#entity) are returned.
You can specify the batch size for these calls by setting the `pageSize`
property on the options:

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `options` | `Object` | `undefined` | Options for the call. |
| `options.pageSize` | `number` | `10` | Number of search results in a batch. |

#### Returns

`AsyncGenerator`<`T`, `any`, `unknown`\>

An async generator that yields [Entities](../README.md#entity) matching the query.

#### Defined in

[lib/search/search.ts:323](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L323)

___

### iteratorOfIds

▸ **iteratorOfIds**(`options?`): `AsyncGenerator`<`string`, `any`, `unknown`\>

Returns an async generator that yields entity IDs matching the query.
Internally, this method makes multiple calls to Redis as you consume the
iterator until all the [Entities](../README.md#entity) are returned. You can
specify the batch size for these calls by setting the `pageSize` property
on the options:

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `options` | `Object` | `undefined` | Options for the call. |
| `options.pageSize` | `number` | `10` | Number of search results in a batch. |

#### Returns

`AsyncGenerator`<`string`, `any`, `unknown`\>

An async generator that yields entity IDs matching the query.

#### Defined in

[lib/search/search.ts:338](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L338)

___

### iteratorOfKeys

▸ **iteratorOfKeys**(`options?`): `AsyncGenerator`<`string`, `any`, `unknown`\>

Returns an async generator that yields key names in Redis matching the
query. Internally, this method makes multiple calls to Redis as you
consume the iterator until all the [Entities](../README.md#entity) are returned.
You can specify the batch size for these calls by setting the `pageSize`
property on the options:

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `options` | `Object` | `undefined` | Options for the call. |
| `options.pageSize` | `number` | `10` | Number of search results in a batch. |

#### Returns

`AsyncGenerator`<`string`, `any`, `unknown`\>

An async generator that yields key names matching the query.

#### Defined in

[lib/search/search.ts:353](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L353)

___

### max

▸ **max**(`field`): `Promise`<``null`` \| `T`\>

Finds the [Entity](../README.md#entity) with the maximal value for a field.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `field` | `Exclude`<keyof `T`, keyof [`EntityInternal`](../README.md#entityinternal)\> | The field with the maximal value. |

#### Returns

`Promise`<``null`` \| `T`\>

The entity ID [Entity](../README.md#entity) with the maximal value

#### Defined in

[lib/search/search.ts:170](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L170)

___

### maxId

▸ **maxId**(`field`): `Promise`<``null`` \| `string`\>

Finds the entity ID with the maximal value for a field.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `field` | `Exclude`<keyof `T`, keyof [`EntityInternal`](../README.md#entityinternal)\> | The field with the maximal value. |

#### Returns

`Promise`<``null`` \| `string`\>

The entity ID with the maximal value

#### Defined in

[lib/search/search.ts:179](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L179)

___

### maxKey

▸ **maxKey**(`field`): `Promise`<``null`` \| `string`\>

Finds the key name in Redis with the maximal value for a field.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `field` | `Exclude`<keyof `T`, keyof [`EntityInternal`](../README.md#entityinternal)\> | The field with the maximal value. |

#### Returns

`Promise`<``null`` \| `string`\>

The key name with the maximal value

#### Defined in

[lib/search/search.ts:188](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L188)

___

### min

▸ **min**(`field`): `Promise`<``null`` \| `T`\>

Finds the [Entity](../README.md#entity) with the minimal value for a field.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `field` | `Exclude`<keyof `T`, keyof [`EntityInternal`](../README.md#entityinternal)\> | The field with the minimal value. |

#### Returns

`Promise`<``null`` \| `T`\>

The [Entity](../README.md#entity) with the minimal value

#### Defined in

[lib/search/search.ts:143](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L143)

___

### minId

▸ **minId**(`field`): `Promise`<``null`` \| `string`\>

Finds the entity ID with the minimal value for a field.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `field` | `Exclude`<keyof `T`, keyof [`EntityInternal`](../README.md#entityinternal)\> | The field with the minimal value. |

#### Returns

`Promise`<``null`` \| `string`\>

The entity ID with the minimal value

#### Defined in

[lib/search/search.ts:152](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L152)

___

### minKey

▸ **minKey**(`field`): `Promise`<``null`` \| `string`\>

Finds the key name in Redis with the minimal value for a field.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `field` | `Exclude`<keyof `T`, keyof [`EntityInternal`](../README.md#entityinternal)\> | The field with the minimal value. |

#### Returns

`Promise`<``null`` \| `string`\>

The key name with the minimal value

#### Defined in

[lib/search/search.ts:161](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L161)

___

### page

▸ **page**(`offset`, `count`): `Promise`<`T`[]\>

Returns a page of [Entities](../README.md#entity) that match this query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `offset` | `number` | The offset for where to start returning [Entities](../README.md#entity). |
| `count` | `number` | The number of [Entities](../README.md#entity) to return. |

#### Returns

`Promise`<`T`[]\>

An array of [Entities](../README.md#entity) matching the query.

#### Defined in

[lib/search/search.ts:207](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L207)

___

### pageOfIds

▸ **pageOfIds**(`offset`, `count`): `Promise`<`string`[]\>

Returns a page of entity IDs that match this query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `offset` | `number` | The offset for where to start returning entity IDs. |
| `count` | `number` | The number of entity IDs to return. |

#### Returns

`Promise`<`string`[]\>

An array of strings matching the query.

#### Defined in

[lib/search/search.ts:218](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L218)

___

### pageOfKeys

▸ **pageOfKeys**(`offset`, `count`): `Promise`<`string`[]\>

Returns a page of key names in Redis that match this query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `offset` | `number` | The offset for where to start returning key names. |
| `count` | `number` | The number of key names to return. |

#### Returns

`Promise`<`string`[]\>

An array of strings matching the query.

#### Defined in

[lib/search/search.ts:229](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L229)

___

### returnAll

▸ **returnAll**(`options?`): `Promise`<`T`[]\>

Alias for [all](Search.md#all).

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `options` | `Object` | `undefined` |
| `options.pageSize` | `number` | `10` |

#### Returns

`Promise`<`T`[]\>

#### Defined in

[lib/search/search.ts:459](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L459)

___

### returnAllIds

▸ **returnAllIds**(`options?`): `Promise`<`string`[]\>

Alias for [allIds](Search.md#allids).

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `options` | `Object` | `undefined` |
| `options.pageSize` | `number` | `10` |

#### Returns

`Promise`<`string`[]\>

#### Defined in

[lib/search/search.ts:466](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L466)

___

### returnAllKeys

▸ **returnAllKeys**(`options?`): `Promise`<`string`[]\>

Alias for [allKeys](Search.md#allkeys).

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `options` | `Object` | `undefined` |
| `options.pageSize` | `number` | `10` |

#### Returns

`Promise`<`string`[]\>

#### Defined in

[lib/search/search.ts:473](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L473)

___

### returnCount

▸ **returnCount**(): `Promise`<`number`\>

Alias for [count](Search.md#count).

#### Returns

`Promise`<`number`\>

#### Defined in

[lib/search/search.ts:410](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L410)

___

### returnFirst

▸ **returnFirst**(): `Promise`<``null`` \| `T`\>

Alias for [first](Search.md#first).

#### Returns

`Promise`<``null`` \| `T`\>

#### Defined in

[lib/search/search.ts:438](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L438)

___

### returnFirstId

▸ **returnFirstId**(): `Promise`<``null`` \| `string`\>

Alias for [firstId](Search.md#firstid).

#### Returns

`Promise`<``null`` \| `string`\>

#### Defined in

[lib/search/search.ts:445](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L445)

___

### returnFirstKey

▸ **returnFirstKey**(): `Promise`<``null`` \| `string`\>

Alias for [firstKey](Search.md#firstkey).

#### Returns

`Promise`<``null`` \| `string`\>

#### Defined in

[lib/search/search.ts:452](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L452)

___

### returnIterator

▸ **returnIterator**(`options?`): `AsyncGenerator`<`T`, `any`, `unknown`\>

Alias for [iterator](Search.md#iterator).

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `options` | `Object` | `undefined` |
| `options.pageSize` | `number` | `10` |

#### Returns

`AsyncGenerator`<`T`, `any`, `unknown`\>

#### Defined in

[lib/search/search.ts:480](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L480)

___

### returnIteratorOfIds

▸ **returnIteratorOfIds**(`options?`): `AsyncGenerator`<`string`, `any`, `unknown`\>

Alias for [iteratorOfIds](Search.md#iteratorofids).

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `options` | `Object` | `undefined` |
| `options.pageSize` | `number` | `10` |

#### Returns

`AsyncGenerator`<`string`, `any`, `unknown`\>

#### Defined in

[lib/search/search.ts:487](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L487)

___

### returnIteratorOfKeys

▸ **returnIteratorOfKeys**(`options?`): `AsyncGenerator`<`string`, `any`, `unknown`\>

Alias for [iteratorOfKeys](Search.md#iteratorofkeys).

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `options` | `Object` | `undefined` |
| `options.pageSize` | `number` | `10` |

#### Returns

`AsyncGenerator`<`string`, `any`, `unknown`\>

#### Defined in

[lib/search/search.ts:494](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L494)

___

### returnMax

▸ **returnMax**(`field`): `Promise`<``null`` \| `T`\>

Alias for [max](Search.md#max).

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | `Exclude`<keyof `T`, keyof [`EntityInternal`](../README.md#entityinternal)\> |

#### Returns

`Promise`<``null`` \| `T`\>

#### Defined in

[lib/search/search.ts:389](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L389)

___

### returnMaxId

▸ **returnMaxId**(`field`): `Promise`<``null`` \| `string`\>

Alias for [maxId](Search.md#maxid).

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | `Exclude`<keyof `T`, keyof [`EntityInternal`](../README.md#entityinternal)\> |

#### Returns

`Promise`<``null`` \| `string`\>

#### Defined in

[lib/search/search.ts:396](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L396)

___

### returnMaxKey

▸ **returnMaxKey**(`field`): `Promise`<``null`` \| `string`\>

Alias for [maxKey](Search.md#maxkey).

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | `Exclude`<keyof `T`, keyof [`EntityInternal`](../README.md#entityinternal)\> |

#### Returns

`Promise`<``null`` \| `string`\>

#### Defined in

[lib/search/search.ts:403](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L403)

___

### returnMin

▸ **returnMin**(`field`): `Promise`<``null`` \| `T`\>

Alias for [min](Search.md#min).

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | `Exclude`<keyof `T`, keyof [`EntityInternal`](../README.md#entityinternal)\> |

#### Returns

`Promise`<``null`` \| `T`\>

#### Defined in

[lib/search/search.ts:368](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L368)

___

### returnMinId

▸ **returnMinId**(`field`): `Promise`<``null`` \| `string`\>

Alias for [minId](Search.md#minid).

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | `Exclude`<keyof `T`, keyof [`EntityInternal`](../README.md#entityinternal)\> |

#### Returns

`Promise`<``null`` \| `string`\>

#### Defined in

[lib/search/search.ts:375](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L375)

___

### returnMinKey

▸ **returnMinKey**(`field`): `Promise`<``null`` \| `string`\>

Alias for [minKey](Search.md#minkey).

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | `Exclude`<keyof `T`, keyof [`EntityInternal`](../README.md#entityinternal)\> |

#### Returns

`Promise`<``null`` \| `string`\>

#### Defined in

[lib/search/search.ts:382](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L382)

___

### returnPage

▸ **returnPage**(`offset`, `count`): `Promise`<`T`[]\>

Alias for [page](Search.md#page).

#### Parameters

| Name | Type |
| :------ | :------ |
| `offset` | `number` |
| `count` | `number` |

#### Returns

`Promise`<`T`[]\>

#### Defined in

[lib/search/search.ts:417](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L417)

___

### returnPageOfIds

▸ **returnPageOfIds**(`offset`, `count`): `Promise`<`string`[]\>

Alias for [pageOfIds](Search.md#pageofids).

#### Parameters

| Name | Type |
| :------ | :------ |
| `offset` | `number` |
| `count` | `number` |

#### Returns

`Promise`<`string`[]\>

#### Defined in

[lib/search/search.ts:424](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L424)

___

### returnPageOfKeys

▸ **returnPageOfKeys**(`offset`, `count`): `Promise`<`string`[]\>

Alias for [pageOfKeys](Search.md#pageofkeys).

#### Parameters

| Name | Type |
| :------ | :------ |
| `offset` | `number` |
| `count` | `number` |

#### Returns

`Promise`<`string`[]\>

#### Defined in

[lib/search/search.ts:431](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L431)

___

### sortAsc

▸ **sortAsc**(`field`): [`AbstractSearch`](AbstractSearch.md)<`T`\>

Alias for [sortAscending](Search.md#sortascending).

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | `Exclude`<keyof `T`, keyof [`EntityInternal`](../README.md#entityinternal)\> |

#### Returns

[`AbstractSearch`](AbstractSearch.md)<`T`\>

#### Defined in

[lib/search/search.ts:90](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L90)

___

### sortAscending

▸ **sortAscending**(`field`): [`AbstractSearch`](AbstractSearch.md)<`T`\>

Applies an ascending sort to the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `field` | `Exclude`<keyof `T`, keyof [`EntityInternal`](../README.md#entityinternal)\> | The field to sort by. |

#### Returns

[`AbstractSearch`](AbstractSearch.md)<`T`\>

this

#### Defined in

[lib/search/search.ts:67](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L67)

___

### sortBy

▸ **sortBy**(`fieldName`, `order?`): [`AbstractSearch`](AbstractSearch.md)<`T`\>

Applies sorting for the query.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `fieldName` | `Exclude`<keyof `T`, keyof [`EntityInternal`](../README.md#entityinternal)\> | `undefined` | The field to sort by. |
| `order` | ``"ASC"`` \| ``"DESC"`` | `'ASC'` | The order of returned [Entities](../README.md#entity) Defaults to `ASC` (ascending) if not specified |

#### Returns

[`AbstractSearch`](AbstractSearch.md)<`T`\>

this

#### Defined in

[lib/search/search.ts:100](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L100)

___

### sortDesc

▸ **sortDesc**(`field`): [`AbstractSearch`](AbstractSearch.md)<`T`\>

Alias for [sortDescending](Search.md#sortdescending).

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | `Exclude`<keyof `T`, keyof [`EntityInternal`](../README.md#entityinternal)\> |

#### Returns

[`AbstractSearch`](AbstractSearch.md)<`T`\>

#### Defined in

[lib/search/search.ts:74](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L74)

___

### sortDescending

▸ **sortDescending**(`field`): [`AbstractSearch`](AbstractSearch.md)<`T`\>

Applies a descending sort to the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `field` | `Exclude`<keyof `T`, keyof [`EntityInternal`](../README.md#entityinternal)\> | The field to sort by. |

#### Returns

[`AbstractSearch`](AbstractSearch.md)<`T`\>

this

#### Defined in

[lib/search/search.ts:83](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L83)
