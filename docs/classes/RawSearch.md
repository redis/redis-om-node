[redis-om](../README.md) / RawSearch

# Class: RawSearch<T\>

Entry point to raw search which allows using raw RediSearch queries
against Redis OM. Requires that RediSearch (and optionally RedisJSON) be
installed.

**`Template`**

The type of [Entity](../README.md#entity) being sought.

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Entity`](../README.md#entity) = `Record`<`string`, `any`\> |

## Hierarchy

- [`AbstractSearch`](AbstractSearch.md)<`T`\>

  ↳ **`RawSearch`**

## Table of contents

### Accessors

- [return](RawSearch.md#return)

### Methods

- [all](RawSearch.md#all)
- [allIds](RawSearch.md#allids)
- [allKeys](RawSearch.md#allkeys)
- [count](RawSearch.md#count)
- [first](RawSearch.md#first)
- [firstId](RawSearch.md#firstid)
- [firstKey](RawSearch.md#firstkey)
- [iterator](RawSearch.md#iterator)
- [iteratorOfIds](RawSearch.md#iteratorofids)
- [iteratorOfKeys](RawSearch.md#iteratorofkeys)
- [max](RawSearch.md#max)
- [maxId](RawSearch.md#maxid)
- [maxKey](RawSearch.md#maxkey)
- [min](RawSearch.md#min)
- [minId](RawSearch.md#minid)
- [minKey](RawSearch.md#minkey)
- [page](RawSearch.md#page)
- [pageOfIds](RawSearch.md#pageofids)
- [pageOfKeys](RawSearch.md#pageofkeys)
- [returnAll](RawSearch.md#returnall)
- [returnAllIds](RawSearch.md#returnallids)
- [returnAllKeys](RawSearch.md#returnallkeys)
- [returnCount](RawSearch.md#returncount)
- [returnFirst](RawSearch.md#returnfirst)
- [returnFirstId](RawSearch.md#returnfirstid)
- [returnFirstKey](RawSearch.md#returnfirstkey)
- [returnIterator](RawSearch.md#returniterator)
- [returnIteratorOfIds](RawSearch.md#returniteratorofids)
- [returnIteratorOfKeys](RawSearch.md#returniteratorofkeys)
- [returnMax](RawSearch.md#returnmax)
- [returnMaxId](RawSearch.md#returnmaxid)
- [returnMaxKey](RawSearch.md#returnmaxkey)
- [returnMin](RawSearch.md#returnmin)
- [returnMinId](RawSearch.md#returnminid)
- [returnMinKey](RawSearch.md#returnminkey)
- [returnPage](RawSearch.md#returnpage)
- [returnPageOfIds](RawSearch.md#returnpageofids)
- [returnPageOfKeys](RawSearch.md#returnpageofkeys)
- [sortAsc](RawSearch.md#sortasc)
- [sortAscending](RawSearch.md#sortascending)
- [sortBy](RawSearch.md#sortby)
- [sortDesc](RawSearch.md#sortdesc)
- [sortDescending](RawSearch.md#sortdescending)

## Accessors

### return

• `get` **return**(): [`AbstractSearch`](AbstractSearch.md)<`T`\>

Returns the current instance. Syntactic sugar to make your code more fluent.

#### Returns

[`AbstractSearch`](AbstractSearch.md)<`T`\>

this

#### Inherited from

AbstractSearch.return

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[all](AbstractSearch.md#all)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[allIds](AbstractSearch.md#allids)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[allKeys](AbstractSearch.md#allkeys)

#### Defined in

[lib/search/search.ts:308](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L308)

___

### count

▸ **count**(): `Promise`<`number`\>

Returns the number of [Entities](../README.md#entity) that match this query.

#### Returns

`Promise`<`number`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[count](AbstractSearch.md#count)

#### Defined in

[lib/search/search.ts:196](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L196)

___

### first

▸ **first**(): `Promise`<``null`` \| `T`\>

Returns the first [Entity](../README.md#entity) that matches this query.

#### Returns

`Promise`<``null`` \| `T`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[first](AbstractSearch.md#first)

#### Defined in

[lib/search/search.ts:237](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L237)

___

### firstId

▸ **firstId**(): `Promise`<``null`` \| `string`\>

Returns the first entity ID that matches this query.

#### Returns

`Promise`<``null`` \| `string`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[firstId](AbstractSearch.md#firstid)

#### Defined in

[lib/search/search.ts:245](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L245)

___

### firstKey

▸ **firstKey**(): `Promise`<``null`` \| `string`\>

Returns the first key name that matches this query.

#### Returns

`Promise`<``null`` \| `string`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[firstKey](AbstractSearch.md#firstkey)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[iterator](AbstractSearch.md#iterator)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[iteratorOfIds](AbstractSearch.md#iteratorofids)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[iteratorOfKeys](AbstractSearch.md#iteratorofkeys)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[max](AbstractSearch.md#max)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[maxId](AbstractSearch.md#maxid)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[maxKey](AbstractSearch.md#maxkey)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[min](AbstractSearch.md#min)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[minId](AbstractSearch.md#minid)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[minKey](AbstractSearch.md#minkey)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[page](AbstractSearch.md#page)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[pageOfIds](AbstractSearch.md#pageofids)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[pageOfKeys](AbstractSearch.md#pageofkeys)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnAll](AbstractSearch.md#returnall)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnAllIds](AbstractSearch.md#returnallids)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnAllKeys](AbstractSearch.md#returnallkeys)

#### Defined in

[lib/search/search.ts:473](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L473)

___

### returnCount

▸ **returnCount**(): `Promise`<`number`\>

Alias for [count](Search.md#count).

#### Returns

`Promise`<`number`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnCount](AbstractSearch.md#returncount)

#### Defined in

[lib/search/search.ts:410](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L410)

___

### returnFirst

▸ **returnFirst**(): `Promise`<``null`` \| `T`\>

Alias for [first](Search.md#first).

#### Returns

`Promise`<``null`` \| `T`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnFirst](AbstractSearch.md#returnfirst)

#### Defined in

[lib/search/search.ts:438](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L438)

___

### returnFirstId

▸ **returnFirstId**(): `Promise`<``null`` \| `string`\>

Alias for [firstId](Search.md#firstid).

#### Returns

`Promise`<``null`` \| `string`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnFirstId](AbstractSearch.md#returnfirstid)

#### Defined in

[lib/search/search.ts:445](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L445)

___

### returnFirstKey

▸ **returnFirstKey**(): `Promise`<``null`` \| `string`\>

Alias for [firstKey](Search.md#firstkey).

#### Returns

`Promise`<``null`` \| `string`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnFirstKey](AbstractSearch.md#returnfirstkey)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnIterator](AbstractSearch.md#returniterator)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnIteratorOfIds](AbstractSearch.md#returniteratorofids)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnIteratorOfKeys](AbstractSearch.md#returniteratorofkeys)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnMax](AbstractSearch.md#returnmax)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnMaxId](AbstractSearch.md#returnmaxid)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnMaxKey](AbstractSearch.md#returnmaxkey)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnMin](AbstractSearch.md#returnmin)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnMinId](AbstractSearch.md#returnminid)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnMinKey](AbstractSearch.md#returnminkey)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnPage](AbstractSearch.md#returnpage)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnPageOfIds](AbstractSearch.md#returnpageofids)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnPageOfKeys](AbstractSearch.md#returnpageofkeys)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[sortAsc](AbstractSearch.md#sortasc)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[sortAscending](AbstractSearch.md#sortascending)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[sortBy](AbstractSearch.md#sortby)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[sortDesc](AbstractSearch.md#sortdesc)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[sortDescending](AbstractSearch.md#sortdescending)

#### Defined in

[lib/search/search.ts:83](https://github.com/redis/redis-om-node/blob/24eacdb/lib/search/search.ts#L83)
