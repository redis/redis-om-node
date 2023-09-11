[redis-om](../README.md) / AbstractSearch

# Class: AbstractSearch

Abstract base class for [Search](Search.md) and [RawSearch](RawSearch.md) that
contains methods to return search results.

**`Template`**

The type of [Entity](../README.md#entity) being sought.

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

• `get` **return**(): [`AbstractSearch`](AbstractSearch.md)

Returns the current instance. Syntactic sugar to make your code more fluent.

#### Returns

[`AbstractSearch`](AbstractSearch.md)

this

#### Defined in

[lib/search/search.ts:308](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L308)

## Methods

### all

▸ **all**(`options?`): `Promise`<[`Entity`](../README.md#entity)[]\>

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

`Promise`<[`Entity`](../README.md#entity)[]\>

An array of [Entities](../README.md#entity) matching the query.

#### Defined in

[lib/search/search.ts:264](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L264)

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

[lib/search/search.ts:282](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L282)

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

[lib/search/search.ts:300](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L300)

___

### count

▸ **count**(): `Promise`<`number`\>

Returns the number of [Entities](../README.md#entity) that match this query.

#### Returns

`Promise`<`number`\>

#### Defined in

[lib/search/search.ts:188](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L188)

___

### first

▸ **first**(): `Promise`<``null`` \| [`Entity`](../README.md#entity)\>

Returns the first [Entity](../README.md#entity) that matches this query.

#### Returns

`Promise`<``null`` \| [`Entity`](../README.md#entity)\>

#### Defined in

[lib/search/search.ts:229](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L229)

___

### firstId

▸ **firstId**(): `Promise`<``null`` \| `string`\>

Returns the first entity ID that matches this query.

#### Returns

`Promise`<``null`` \| `string`\>

#### Defined in

[lib/search/search.ts:237](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L237)

___

### firstKey

▸ **firstKey**(): `Promise`<``null`` \| `string`\>

Returns the first key name that matches this query.

#### Returns

`Promise`<``null`` \| `string`\>

#### Defined in

[lib/search/search.ts:245](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L245)

___

### max

▸ **max**(`field`): `Promise`<``null`` \| [`Entity`](../README.md#entity)\>

Finds the [Entity](../README.md#entity) with the maximal value for a field.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `field` | `string` | The field with the maximal value. |

#### Returns

`Promise`<``null`` \| [`Entity`](../README.md#entity)\>

The entity ID [Entity](../README.md#entity) with the maximal value

#### Defined in

[lib/search/search.ts:162](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L162)

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

[lib/search/search.ts:171](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L171)

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

[lib/search/search.ts:180](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L180)

___

### min

▸ **min**(`field`): `Promise`<``null`` \| [`Entity`](../README.md#entity)\>

Finds the [Entity](../README.md#entity) with the minimal value for a field.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `field` | `string` | The field with the minimal value. |

#### Returns

`Promise`<``null`` \| [`Entity`](../README.md#entity)\>

The [Entity](../README.md#entity) with the minimal value

#### Defined in

[lib/search/search.ts:135](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L135)

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

[lib/search/search.ts:144](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L144)

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

[lib/search/search.ts:153](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L153)

___

### page

▸ **page**(`offset`, `count`): `Promise`<[`Entity`](../README.md#entity)[]\>

Returns a page of [Entities](../README.md#entity) that match this query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `offset` | `number` | The offset for where to start returning [Entities](../README.md#entity). |
| `count` | `number` | The number of [Entities](../README.md#entity) to return. |

#### Returns

`Promise`<[`Entity`](../README.md#entity)[]\>

An array of [Entities](../README.md#entity) matching the query.

#### Defined in

[lib/search/search.ts:199](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L199)

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

[lib/search/search.ts:210](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L210)

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

[lib/search/search.ts:221](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L221)

___

### returnAll

▸ **returnAll**(`options?`): `Promise`<[`Entity`](../README.md#entity)[]\>

Alias for [all](Search.md#all).

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `options` | `Object` | `undefined` |
| `options.pageSize` | `number` | `10` |

#### Returns

`Promise`<[`Entity`](../README.md#entity)[]\>

#### Defined in

[lib/search/search.ts:406](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L406)

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

[lib/search/search.ts:413](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L413)

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

[lib/search/search.ts:420](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L420)

___

### returnCount

▸ **returnCount**(): `Promise`<`number`\>

Alias for [count](Search.md#count).

#### Returns

`Promise`<`number`\>

#### Defined in

[lib/search/search.ts:357](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L357)

___

### returnFirst

▸ **returnFirst**(): `Promise`<``null`` \| [`Entity`](../README.md#entity)\>

Alias for [first](Search.md#first).

#### Returns

`Promise`<``null`` \| [`Entity`](../README.md#entity)\>

#### Defined in

[lib/search/search.ts:385](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L385)

___

### returnFirstId

▸ **returnFirstId**(): `Promise`<``null`` \| `string`\>

Alias for [firstId](Search.md#firstid).

#### Returns

`Promise`<``null`` \| `string`\>

#### Defined in

[lib/search/search.ts:392](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L392)

___

### returnFirstKey

▸ **returnFirstKey**(): `Promise`<``null`` \| `string`\>

Alias for [firstKey](Search.md#firstkey).

#### Returns

`Promise`<``null`` \| `string`\>

#### Defined in

[lib/search/search.ts:399](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L399)

___

### returnMax

▸ **returnMax**(`field`): `Promise`<``null`` \| [`Entity`](../README.md#entity)\>

Alias for [max](Search.md#max).

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | `string` |

#### Returns

`Promise`<``null`` \| [`Entity`](../README.md#entity)\>

#### Defined in

[lib/search/search.ts:336](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L336)

___

### returnMaxId

▸ **returnMaxId**(`field`): `Promise`<``null`` \| `string`\>

Alias for [maxId](Search.md#maxid).

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | `string` |

#### Returns

`Promise`<``null`` \| `string`\>

#### Defined in

[lib/search/search.ts:343](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L343)

___

### returnMaxKey

▸ **returnMaxKey**(`field`): `Promise`<``null`` \| `string`\>

Alias for [maxKey](Search.md#maxkey).

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | `string` |

#### Returns

`Promise`<``null`` \| `string`\>

#### Defined in

[lib/search/search.ts:350](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L350)

___

### returnMin

▸ **returnMin**(`field`): `Promise`<``null`` \| [`Entity`](../README.md#entity)\>

Alias for [min](Search.md#min).

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | `string` |

#### Returns

`Promise`<``null`` \| [`Entity`](../README.md#entity)\>

#### Defined in

[lib/search/search.ts:315](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L315)

___

### returnMinId

▸ **returnMinId**(`field`): `Promise`<``null`` \| `string`\>

Alias for [minId](Search.md#minid).

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | `string` |

#### Returns

`Promise`<``null`` \| `string`\>

#### Defined in

[lib/search/search.ts:322](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L322)

___

### returnMinKey

▸ **returnMinKey**(`field`): `Promise`<``null`` \| `string`\>

Alias for [minKey](Search.md#minkey).

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | `string` |

#### Returns

`Promise`<``null`` \| `string`\>

#### Defined in

[lib/search/search.ts:329](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L329)

___

### returnPage

▸ **returnPage**(`offset`, `count`): `Promise`<[`Entity`](../README.md#entity)[]\>

Alias for [page](Search.md#page).

#### Parameters

| Name | Type |
| :------ | :------ |
| `offset` | `number` |
| `count` | `number` |

#### Returns

`Promise`<[`Entity`](../README.md#entity)[]\>

#### Defined in

[lib/search/search.ts:364](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L364)

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

[lib/search/search.ts:371](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L371)

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

[lib/search/search.ts:378](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L378)

___

### sortAsc

▸ **sortAsc**(`field`): [`AbstractSearch`](AbstractSearch.md)

Alias for [sortAscending](Search.md#sortascending).

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | `string` |

#### Returns

[`AbstractSearch`](AbstractSearch.md)

#### Defined in

[lib/search/search.ts:86](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L86)

___

### sortAscending

▸ **sortAscending**(`field`): [`AbstractSearch`](AbstractSearch.md)

Applies an ascending sort to the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `field` | `string` | The field to sort by. |

#### Returns

[`AbstractSearch`](AbstractSearch.md)

this

#### Defined in

[lib/search/search.ts:63](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L63)

___

### sortBy

▸ **sortBy**(`fieldName`, `order?`): [`AbstractSearch`](AbstractSearch.md)

Applies sorting for the query.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `fieldName` | `string` | `undefined` | - |
| `order` | ``"ASC"`` \| ``"DESC"`` | `'ASC'` | The order of returned [Entities](../README.md#entity) Defaults to `ASC` (ascending) if not specified |

#### Returns

[`AbstractSearch`](AbstractSearch.md)

this

#### Defined in

[lib/search/search.ts:96](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L96)

___

### sortDesc

▸ **sortDesc**(`field`): [`AbstractSearch`](AbstractSearch.md)

Alias for [sortDescending](Search.md#sortdescending).

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | `string` |

#### Returns

[`AbstractSearch`](AbstractSearch.md)

#### Defined in

[lib/search/search.ts:70](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L70)

___

### sortDescending

▸ **sortDescending**(`field`): [`AbstractSearch`](AbstractSearch.md)

Applies a descending sort to the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `field` | `string` | The field to sort by. |

#### Returns

[`AbstractSearch`](AbstractSearch.md)

this

#### Defined in

[lib/search/search.ts:79](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L79)
