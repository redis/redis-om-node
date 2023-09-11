[redis-om](../README.md) / RawSearch

# Class: RawSearch

Entry point to raw search which allows using raw RediSearch queries
against Redis OM. Requires that RediSearch (and optionally RedisJSON) be
installed.

**`Template`**

The type of [Entity](../README.md#entity) being sought.

## Hierarchy

- [`AbstractSearch`](AbstractSearch.md)

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

• `get` **return**(): [`AbstractSearch`](AbstractSearch.md)

Returns the current instance. Syntactic sugar to make your code more fluent.

#### Returns

[`AbstractSearch`](AbstractSearch.md)

this

#### Inherited from

AbstractSearch.return

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[all](AbstractSearch.md#all)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[allIds](AbstractSearch.md#allids)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[allKeys](AbstractSearch.md#allkeys)

#### Defined in

[lib/search/search.ts:300](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L300)

___

### count

▸ **count**(): `Promise`<`number`\>

Returns the number of [Entities](../README.md#entity) that match this query.

#### Returns

`Promise`<`number`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[count](AbstractSearch.md#count)

#### Defined in

[lib/search/search.ts:188](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L188)

___

### first

▸ **first**(): `Promise`<``null`` \| [`Entity`](../README.md#entity)\>

Returns the first [Entity](../README.md#entity) that matches this query.

#### Returns

`Promise`<``null`` \| [`Entity`](../README.md#entity)\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[first](AbstractSearch.md#first)

#### Defined in

[lib/search/search.ts:229](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L229)

___

### firstId

▸ **firstId**(): `Promise`<``null`` \| `string`\>

Returns the first entity ID that matches this query.

#### Returns

`Promise`<``null`` \| `string`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[firstId](AbstractSearch.md#firstid)

#### Defined in

[lib/search/search.ts:237](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L237)

___

### firstKey

▸ **firstKey**(): `Promise`<``null`` \| `string`\>

Returns the first key name that matches this query.

#### Returns

`Promise`<``null`` \| `string`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[firstKey](AbstractSearch.md#firstkey)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[max](AbstractSearch.md#max)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[maxId](AbstractSearch.md#maxid)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[maxKey](AbstractSearch.md#maxkey)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[min](AbstractSearch.md#min)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[minId](AbstractSearch.md#minid)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[minKey](AbstractSearch.md#minkey)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[page](AbstractSearch.md#page)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[pageOfIds](AbstractSearch.md#pageofids)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[pageOfKeys](AbstractSearch.md#pageofkeys)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnAll](AbstractSearch.md#returnall)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnAllIds](AbstractSearch.md#returnallids)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnAllKeys](AbstractSearch.md#returnallkeys)

#### Defined in

[lib/search/search.ts:420](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L420)

___

### returnCount

▸ **returnCount**(): `Promise`<`number`\>

Alias for [count](Search.md#count).

#### Returns

`Promise`<`number`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnCount](AbstractSearch.md#returncount)

#### Defined in

[lib/search/search.ts:357](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L357)

___

### returnFirst

▸ **returnFirst**(): `Promise`<``null`` \| [`Entity`](../README.md#entity)\>

Alias for [first](Search.md#first).

#### Returns

`Promise`<``null`` \| [`Entity`](../README.md#entity)\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnFirst](AbstractSearch.md#returnfirst)

#### Defined in

[lib/search/search.ts:385](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L385)

___

### returnFirstId

▸ **returnFirstId**(): `Promise`<``null`` \| `string`\>

Alias for [firstId](Search.md#firstid).

#### Returns

`Promise`<``null`` \| `string`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnFirstId](AbstractSearch.md#returnfirstid)

#### Defined in

[lib/search/search.ts:392](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L392)

___

### returnFirstKey

▸ **returnFirstKey**(): `Promise`<``null`` \| `string`\>

Alias for [firstKey](Search.md#firstkey).

#### Returns

`Promise`<``null`` \| `string`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnFirstKey](AbstractSearch.md#returnfirstkey)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnMax](AbstractSearch.md#returnmax)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnMaxId](AbstractSearch.md#returnmaxid)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnMaxKey](AbstractSearch.md#returnmaxkey)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnMin](AbstractSearch.md#returnmin)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnMinId](AbstractSearch.md#returnminid)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnMinKey](AbstractSearch.md#returnminkey)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnPage](AbstractSearch.md#returnpage)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnPageOfIds](AbstractSearch.md#returnpageofids)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnPageOfKeys](AbstractSearch.md#returnpageofkeys)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[sortAsc](AbstractSearch.md#sortasc)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[sortAscending](AbstractSearch.md#sortascending)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[sortBy](AbstractSearch.md#sortby)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[sortDesc](AbstractSearch.md#sortdesc)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[sortDescending](AbstractSearch.md#sortdescending)

#### Defined in

[lib/search/search.ts:79](https://github.com/redis/redis-om-node/blob/4f5798b/lib/search/search.ts#L79)
