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

• `get` **return**(): [`AbstractSearch`](AbstractSearch.md)<`TEntity`\>

Returns the current instance. Syntactic sugar to make your code more fluent.

#### Returns

[`AbstractSearch`](AbstractSearch.md)<`TEntity`\>

this

#### Inherited from

AbstractSearch.return

#### Defined in

[lib/search/search.ts:334](https://github.com/redis/redis-om-node/blob/000c57c/lib/search/search.ts#L334)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[all](AbstractSearch.md#all)

#### Defined in

[lib/search/search.ts:267](https://github.com/redis/redis-om-node/blob/000c57c/lib/search/search.ts#L267)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[allIds](AbstractSearch.md#allids)

#### Defined in

[lib/search/search.ts:296](https://github.com/redis/redis-om-node/blob/000c57c/lib/search/search.ts#L296)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[allKeys](AbstractSearch.md#allkeys)

#### Defined in

[lib/search/search.ts:315](https://github.com/redis/redis-om-node/blob/000c57c/lib/search/search.ts#L315)

___

### count

▸ **count**(): `Promise`<`number`\>

Returns the number of [Entities](Entity.md) that match this query.

#### Returns

`Promise`<`number`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[count](AbstractSearch.md#count)

#### Defined in

[lib/search/search.ts:187](https://github.com/redis/redis-om-node/blob/000c57c/lib/search/search.ts#L187)

___

### first

▸ **first**(): `Promise`<``null`` \| `TEntity`\>

Returns the first [Entity](Entity.md) that matches this query.

#### Returns

`Promise`<``null`` \| `TEntity`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[first](AbstractSearch.md#first)

#### Defined in

[lib/search/search.ts:232](https://github.com/redis/redis-om-node/blob/000c57c/lib/search/search.ts#L232)

___

### firstId

▸ **firstId**(): `Promise`<``null`` \| `string`\>

Returns the first entity ID that matches this query.

#### Returns

`Promise`<``null`` \| `string`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[firstId](AbstractSearch.md#firstid)

#### Defined in

[lib/search/search.ts:240](https://github.com/redis/redis-om-node/blob/000c57c/lib/search/search.ts#L240)

___

### firstKey

▸ **firstKey**(): `Promise`<``null`` \| `string`\>

Returns the first key name that matches this query.

#### Returns

`Promise`<``null`` \| `string`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[firstKey](AbstractSearch.md#firstkey)

#### Defined in

[lib/search/search.ts:248](https://github.com/redis/redis-om-node/blob/000c57c/lib/search/search.ts#L248)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[max](AbstractSearch.md#max)

#### Defined in

[lib/search/search.ts:160](https://github.com/redis/redis-om-node/blob/000c57c/lib/search/search.ts#L160)

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

[lib/search/search.ts:169](https://github.com/redis/redis-om-node/blob/000c57c/lib/search/search.ts#L169)

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

[lib/search/search.ts:179](https://github.com/redis/redis-om-node/blob/000c57c/lib/search/search.ts#L179)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[min](AbstractSearch.md#min)

#### Defined in

[lib/search/search.ts:132](https://github.com/redis/redis-om-node/blob/000c57c/lib/search/search.ts#L132)

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

[lib/search/search.ts:141](https://github.com/redis/redis-om-node/blob/000c57c/lib/search/search.ts#L141)

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

[lib/search/search.ts:151](https://github.com/redis/redis-om-node/blob/000c57c/lib/search/search.ts#L151)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[page](AbstractSearch.md#page)

#### Defined in

[lib/search/search.ts:200](https://github.com/redis/redis-om-node/blob/000c57c/lib/search/search.ts#L200)

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

[lib/search/search.ts:213](https://github.com/redis/redis-om-node/blob/000c57c/lib/search/search.ts#L213)

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

[lib/search/search.ts:224](https://github.com/redis/redis-om-node/blob/000c57c/lib/search/search.ts#L224)

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

[lib/search/search.ts:432](https://github.com/redis/redis-om-node/blob/000c57c/lib/search/search.ts#L432)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnAllIds](AbstractSearch.md#returnallids)

#### Defined in

[lib/search/search.ts:439](https://github.com/redis/redis-om-node/blob/000c57c/lib/search/search.ts#L439)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnAllKeys](AbstractSearch.md#returnallkeys)

#### Defined in

[lib/search/search.ts:446](https://github.com/redis/redis-om-node/blob/000c57c/lib/search/search.ts#L446)

___

### returnCount

▸ **returnCount**(): `Promise`<`number`\>

Alias for [Search.count](Search.md#count).

#### Returns

`Promise`<`number`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnCount](AbstractSearch.md#returncount)

#### Defined in

[lib/search/search.ts:383](https://github.com/redis/redis-om-node/blob/000c57c/lib/search/search.ts#L383)

___

### returnFirst

▸ **returnFirst**(): `Promise`<``null`` \| `TEntity`\>

Alias for [Search.first](Search.md#first).

#### Returns

`Promise`<``null`` \| `TEntity`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnFirst](AbstractSearch.md#returnfirst)

#### Defined in

[lib/search/search.ts:411](https://github.com/redis/redis-om-node/blob/000c57c/lib/search/search.ts#L411)

___

### returnFirstId

▸ **returnFirstId**(): `Promise`<``null`` \| `string`\>

Alias for [Search.firstId](Search.md#firstid).

#### Returns

`Promise`<``null`` \| `string`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnFirstId](AbstractSearch.md#returnfirstid)

#### Defined in

[lib/search/search.ts:418](https://github.com/redis/redis-om-node/blob/000c57c/lib/search/search.ts#L418)

___

### returnFirstKey

▸ **returnFirstKey**(): `Promise`<``null`` \| `string`\>

Alias for [Search.firstKey](Search.md#firstkey).

#### Returns

`Promise`<``null`` \| `string`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnFirstKey](AbstractSearch.md#returnfirstkey)

#### Defined in

[lib/search/search.ts:425](https://github.com/redis/redis-om-node/blob/000c57c/lib/search/search.ts#L425)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnMax](AbstractSearch.md#returnmax)

#### Defined in

[lib/search/search.ts:362](https://github.com/redis/redis-om-node/blob/000c57c/lib/search/search.ts#L362)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnMaxId](AbstractSearch.md#returnmaxid)

#### Defined in

[lib/search/search.ts:369](https://github.com/redis/redis-om-node/blob/000c57c/lib/search/search.ts#L369)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnMaxKey](AbstractSearch.md#returnmaxkey)

#### Defined in

[lib/search/search.ts:376](https://github.com/redis/redis-om-node/blob/000c57c/lib/search/search.ts#L376)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnMin](AbstractSearch.md#returnmin)

#### Defined in

[lib/search/search.ts:341](https://github.com/redis/redis-om-node/blob/000c57c/lib/search/search.ts#L341)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnMinId](AbstractSearch.md#returnminid)

#### Defined in

[lib/search/search.ts:348](https://github.com/redis/redis-om-node/blob/000c57c/lib/search/search.ts#L348)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnMinKey](AbstractSearch.md#returnminkey)

#### Defined in

[lib/search/search.ts:355](https://github.com/redis/redis-om-node/blob/000c57c/lib/search/search.ts#L355)

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

[lib/search/search.ts:390](https://github.com/redis/redis-om-node/blob/000c57c/lib/search/search.ts#L390)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnPageOfIds](AbstractSearch.md#returnpageofids)

#### Defined in

[lib/search/search.ts:397](https://github.com/redis/redis-om-node/blob/000c57c/lib/search/search.ts#L397)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnPageOfKeys](AbstractSearch.md#returnpageofkeys)

#### Defined in

[lib/search/search.ts:404](https://github.com/redis/redis-om-node/blob/000c57c/lib/search/search.ts#L404)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[sortAsc](AbstractSearch.md#sortasc)

#### Defined in

[lib/search/search.ts:84](https://github.com/redis/redis-om-node/blob/000c57c/lib/search/search.ts#L84)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[sortAscending](AbstractSearch.md#sortascending)

#### Defined in

[lib/search/search.ts:61](https://github.com/redis/redis-om-node/blob/000c57c/lib/search/search.ts#L61)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[sortBy](AbstractSearch.md#sortby)

#### Defined in

[lib/search/search.ts:94](https://github.com/redis/redis-om-node/blob/000c57c/lib/search/search.ts#L94)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[sortDesc](AbstractSearch.md#sortdesc)

#### Defined in

[lib/search/search.ts:68](https://github.com/redis/redis-om-node/blob/000c57c/lib/search/search.ts#L68)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[sortDescending](AbstractSearch.md#sortdescending)

#### Defined in

[lib/search/search.ts:77](https://github.com/redis/redis-om-node/blob/000c57c/lib/search/search.ts#L77)
