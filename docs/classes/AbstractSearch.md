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
- [allIds](AbstractSearch.md#allids)
- [allKeys](AbstractSearch.md#allkeys)
- [count](AbstractSearch.md#count)
- [first](AbstractSearch.md#first)
- [firstId](AbstractSearch.md#firstid)
- [firstKey](AbstractSearch.md#firstkey)
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

• `get` **return**(): [`AbstractSearch`](AbstractSearch.md)<`TEntity`\>

Returns the current instance. Syntactic sugar to make your code more fluent.

#### Returns

[`AbstractSearch`](AbstractSearch.md)<`TEntity`\>

this

#### Defined in

[lib/search/search.ts:333](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L333)

## Methods

### all

▸ **all**(`options?`): `Promise`<`TEntity`[]\>

Returns all the [Entities](Entity.md) that match this query. This method
makes multiple calls to Redis until all the [Entities](Entity.md) are returned.
You can specify the batch size by setting the `pageSize` property on the
options:

```typescript
const entities = await repository.search().returnAll({ pageSize: 100 });
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

[lib/search/search.ts:266](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L266)

___

### allIds

▸ **allIds**(`options?`): `Promise`<`string`[]\>

Returns all the entity IDs that match this query. This method
makes multiple calls to Redis until all the entity IDs are returned.
You can specify the batch size by setting the `pageSize` property on the
options:

```typescript
const keys = await repository.search().returnAllIds({ pageSize: 100 });
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

[lib/search/search.ts:295](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L295)

___

### allKeys

▸ **allKeys**(`options?`): `Promise`<`string`[]\>

Returns all the key names in Redis that match this query. This method
makes multiple calls to Redis until all the key names are returned.
You can specify the batch size by setting the `pageSize` property on the
options:

```typescript
const keys = await repository.search().returnAllKeys({ pageSize: 100 });
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

[lib/search/search.ts:314](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L314)

___

### count

▸ **count**(): `Promise`<`number`\>

Returns the number of [Entities](Entity.md) that match this query.

#### Returns

`Promise`<`number`\>

#### Defined in

[lib/search/search.ts:186](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L186)

___

### first

▸ **first**(): `Promise`<``null`` \| `TEntity`\>

Returns the first [Entity](Entity.md) that matches this query.

#### Returns

`Promise`<``null`` \| `TEntity`\>

#### Defined in

[lib/search/search.ts:231](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L231)

___

### firstId

▸ **firstId**(): `Promise`<``null`` \| `string`\>

Returns the first entity ID that matches this query.

#### Returns

`Promise`<``null`` \| `string`\>

#### Defined in

[lib/search/search.ts:239](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L239)

___

### firstKey

▸ **firstKey**(): `Promise`<``null`` \| `string`\>

Returns the first key name that matches this query.

#### Returns

`Promise`<``null`` \| `string`\>

#### Defined in

[lib/search/search.ts:247](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L247)

___

### max

▸ **max**(`field`): `Promise`<``null`` \| `TEntity`\>

Finds the [Entity](Entity.md) with the maximal value for a field.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `field` | `string` | The field with the maximal value. |

#### Returns

`Promise`<``null`` \| `TEntity`\>

The entity ID [Entity](Entity.md) with the maximal value

#### Defined in

[lib/search/search.ts:159](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L159)

___

### maxId

▸ **maxId**(`field`): `Promise`<``null`` \| `string`\>

Finds the entity ID with the maximal value for a field.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `field` | `string` | The field with the maximal value. |

#### Returns

`Promise`<``null`` \| `string`\>

The entity ID with the maximal value

#### Defined in

[lib/search/search.ts:168](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L168)

___

### maxKey

▸ **maxKey**(`field`): `Promise`<``null`` \| `string`\>

Finds the key name in Redis with the maximal value for a field.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `field` | `string` | The field with the maximal value. |

#### Returns

`Promise`<``null`` \| `string`\>

The key name with the maximal value

#### Defined in

[lib/search/search.ts:178](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L178)

___

### min

▸ **min**(`field`): `Promise`<``null`` \| `TEntity`\>

Finds the [Entity](Entity.md) with the minimal value for a field.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `field` | `string` | The field with the minimal value. |

#### Returns

`Promise`<``null`` \| `TEntity`\>

The [Entity](Entity.md) with the minimal value

#### Defined in

[lib/search/search.ts:131](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L131)

___

### minId

▸ **minId**(`field`): `Promise`<``null`` \| `string`\>

Finds the entity ID with the minimal value for a field.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `field` | `string` | The field with the minimal value. |

#### Returns

`Promise`<``null`` \| `string`\>

The entity ID with the minimal value

#### Defined in

[lib/search/search.ts:140](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L140)

___

### minKey

▸ **minKey**(`field`): `Promise`<``null`` \| `string`\>

Finds the key name in Redis with the minimal value for a field.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `field` | `string` | The field with the minimal value. |

#### Returns

`Promise`<``null`` \| `string`\>

The key name with the minimal value

#### Defined in

[lib/search/search.ts:150](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L150)

___

### page

▸ **page**(`offset`, `count`): `Promise`<`TEntity`[]\>

Returns a page of [Entities](Entity.md) that match this query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `offset` | `number` | The offset for where to start returning [Entities](Entity.md). |
| `count` | `number` | The number of [Entities](Entity.md) to return. |

#### Returns

`Promise`<`TEntity`[]\>

An array of [Entities](Entity.md) matching the query.

#### Defined in

[lib/search/search.ts:199](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L199)

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

[lib/search/search.ts:212](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L212)

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

[lib/search/search.ts:223](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L223)

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

[lib/search/search.ts:431](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L431)

___

### returnAllIds

▸ **returnAllIds**(`options?`): `Promise`<`string`[]\>

Alias for [Search.allIds](Search.md#allids).

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `options` | `Object` | `undefined` |
| `options.pageSize` | `number` | `10` |

#### Returns

`Promise`<`string`[]\>

#### Defined in

[lib/search/search.ts:438](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L438)

___

### returnAllKeys

▸ **returnAllKeys**(`options?`): `Promise`<`string`[]\>

Alias for [Search.allKeys](Search.md#allkeys).

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `options` | `Object` | `undefined` |
| `options.pageSize` | `number` | `10` |

#### Returns

`Promise`<`string`[]\>

#### Defined in

[lib/search/search.ts:445](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L445)

___

### returnCount

▸ **returnCount**(): `Promise`<`number`\>

Alias for [Search.count](Search.md#count).

#### Returns

`Promise`<`number`\>

#### Defined in

[lib/search/search.ts:382](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L382)

___

### returnFirst

▸ **returnFirst**(): `Promise`<``null`` \| `TEntity`\>

Alias for [Search.first](Search.md#first).

#### Returns

`Promise`<``null`` \| `TEntity`\>

#### Defined in

[lib/search/search.ts:410](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L410)

___

### returnFirstId

▸ **returnFirstId**(): `Promise`<``null`` \| `string`\>

Alias for [Search.firstId](Search.md#firstid).

#### Returns

`Promise`<``null`` \| `string`\>

#### Defined in

[lib/search/search.ts:417](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L417)

___

### returnFirstKey

▸ **returnFirstKey**(): `Promise`<``null`` \| `string`\>

Alias for [Search.firstKey](Search.md#firstkey).

#### Returns

`Promise`<``null`` \| `string`\>

#### Defined in

[lib/search/search.ts:424](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L424)

___

### returnMax

▸ **returnMax**(`field`): `Promise`<``null`` \| `TEntity`\>

Alias for [Search.max](Search.md#max).

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | `string` |

#### Returns

`Promise`<``null`` \| `TEntity`\>

#### Defined in

[lib/search/search.ts:361](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L361)

___

### returnMaxId

▸ **returnMaxId**(`field`): `Promise`<``null`` \| `string`\>

Alias for [Search.maxId](Search.md#maxid).

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | `string` |

#### Returns

`Promise`<``null`` \| `string`\>

#### Defined in

[lib/search/search.ts:368](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L368)

___

### returnMaxKey

▸ **returnMaxKey**(`field`): `Promise`<``null`` \| `string`\>

Alias for [Search.maxKey](Search.md#maxkey).

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | `string` |

#### Returns

`Promise`<``null`` \| `string`\>

#### Defined in

[lib/search/search.ts:375](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L375)

___

### returnMin

▸ **returnMin**(`field`): `Promise`<``null`` \| `TEntity`\>

Alias for [Search.min](Search.md#min).

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | `string` |

#### Returns

`Promise`<``null`` \| `TEntity`\>

#### Defined in

[lib/search/search.ts:340](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L340)

___

### returnMinId

▸ **returnMinId**(`field`): `Promise`<``null`` \| `string`\>

Alias for [Search.minId](Search.md#minid).

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | `string` |

#### Returns

`Promise`<``null`` \| `string`\>

#### Defined in

[lib/search/search.ts:347](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L347)

___

### returnMinKey

▸ **returnMinKey**(`field`): `Promise`<``null`` \| `string`\>

Alias for [Search.minKey](Search.md#minkey).

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | `string` |

#### Returns

`Promise`<``null`` \| `string`\>

#### Defined in

[lib/search/search.ts:354](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L354)

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

[lib/search/search.ts:389](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L389)

___

### returnPageOfIds

▸ **returnPageOfIds**(`offset`, `count`): `Promise`<`string`[]\>

Alias for [Search.pageOfIds](Search.md#pageofids).

#### Parameters

| Name | Type |
| :------ | :------ |
| `offset` | `number` |
| `count` | `number` |

#### Returns

`Promise`<`string`[]\>

#### Defined in

[lib/search/search.ts:396](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L396)

___

### returnPageOfKeys

▸ **returnPageOfKeys**(`offset`, `count`): `Promise`<`string`[]\>

Alias for {@link Search.pageOrKeys}.

#### Parameters

| Name | Type |
| :------ | :------ |
| `offset` | `number` |
| `count` | `number` |

#### Returns

`Promise`<`string`[]\>

#### Defined in

[lib/search/search.ts:403](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L403)

___

### sortAsc

▸ **sortAsc**(`field`): [`AbstractSearch`](AbstractSearch.md)<`TEntity`\>

Alias for [Search.sortAscending](Search.md#sortascending).

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | `string` |

#### Returns

[`AbstractSearch`](AbstractSearch.md)<`TEntity`\>

#### Defined in

[lib/search/search.ts:83](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L83)

___

### sortAscending

▸ **sortAscending**(`field`): [`AbstractSearch`](AbstractSearch.md)<`TEntity`\>

Applies an ascending sort to the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `field` | `string` | The field to sort by. |

#### Returns

[`AbstractSearch`](AbstractSearch.md)<`TEntity`\>

this

#### Defined in

[lib/search/search.ts:60](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L60)

___

### sortBy

▸ **sortBy**(`field`, `order?`): [`AbstractSearch`](AbstractSearch.md)<`TEntity`\>

Applies sorting for the query.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `field` | `string` | `undefined` | The field to sort by. |
| `order` | ``"ASC"`` \| ``"DESC"`` | `'ASC'` | The order of returned [Entities](Entity.md) Defaults to `ASC` (ascending) if not specified |

#### Returns

[`AbstractSearch`](AbstractSearch.md)<`TEntity`\>

this

#### Defined in

[lib/search/search.ts:93](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L93)

___

### sortDesc

▸ **sortDesc**(`field`): [`AbstractSearch`](AbstractSearch.md)<`TEntity`\>

Alias for [Search.sortDescending](Search.md#sortdescending).

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | `string` |

#### Returns

[`AbstractSearch`](AbstractSearch.md)<`TEntity`\>

#### Defined in

[lib/search/search.ts:67](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L67)

___

### sortDescending

▸ **sortDescending**(`field`): [`AbstractSearch`](AbstractSearch.md)<`TEntity`\>

Applies a descending sort to the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `field` | `string` | The field to sort by. |

#### Returns

[`AbstractSearch`](AbstractSearch.md)<`TEntity`\>

this

#### Defined in

[lib/search/search.ts:76](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L76)
