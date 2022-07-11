[redis-om](../README.md) / Search

# Class: Search<TEntity\>

Entry point to fluent search. This is the default Redis OM experience.
Requires that RediSearch (and optionally RedisJSON) be installed.

## Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `TEntity` | extends [`Entity`](Entity.md) | The type of [Entity](Entity.md) being sought. |

## Hierarchy

- [`AbstractSearch`](AbstractSearch.md)<`TEntity`\>

  ↳ **`Search`**

## Table of contents

### Accessors

- [return](Search.md#return)

### Methods

- [all](Search.md#all)
- [allIds](Search.md#allids)
- [allKeys](Search.md#allkeys)
- [and](Search.md#and)
- [count](Search.md#count)
- [first](Search.md#first)
- [firstId](Search.md#firstid)
- [firstKey](Search.md#firstkey)
- [max](Search.md#max)
- [maxId](Search.md#maxid)
- [maxKey](Search.md#maxkey)
- [min](Search.md#min)
- [minId](Search.md#minid)
- [minKey](Search.md#minkey)
- [or](Search.md#or)
- [page](Search.md#page)
- [pageOfIds](Search.md#pageofids)
- [pageOfKeys](Search.md#pageofkeys)
- [returnAll](Search.md#returnall)
- [returnAllIds](Search.md#returnallids)
- [returnAllKeys](Search.md#returnallkeys)
- [returnCount](Search.md#returncount)
- [returnFirst](Search.md#returnfirst)
- [returnFirstId](Search.md#returnfirstid)
- [returnFirstKey](Search.md#returnfirstkey)
- [returnMax](Search.md#returnmax)
- [returnMaxId](Search.md#returnmaxid)
- [returnMaxKey](Search.md#returnmaxkey)
- [returnMin](Search.md#returnmin)
- [returnMinId](Search.md#returnminid)
- [returnMinKey](Search.md#returnminkey)
- [returnPage](Search.md#returnpage)
- [returnPageOfIds](Search.md#returnpageofids)
- [returnPageOfKeys](Search.md#returnpageofkeys)
- [sortAsc](Search.md#sortasc)
- [sortAscending](Search.md#sortascending)
- [sortBy](Search.md#sortby)
- [sortDesc](Search.md#sortdesc)
- [sortDescending](Search.md#sortdescending)
- [where](Search.md#where)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[all](AbstractSearch.md#all)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[allIds](AbstractSearch.md#allids)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[allKeys](AbstractSearch.md#allkeys)

#### Defined in

[lib/search/search.ts:314](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L314)

___

### and

▸ **and**(`field`): [`WhereField`](WhereField.md)<`TEntity`\>

Sets up a query matching a particular field as a logical AND.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `field` | `string` | The field to filter on. |

#### Returns

[`WhereField`](WhereField.md)<`TEntity`\>

A subclass of [WhereField](WhereField.md) matching the type of the field.

#### Defined in

[lib/search/search.ts:542](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L542)

▸ **and**(`subSearchFn`): [`Search`](Search.md)<`TEntity`\>

Sets up a nested search as a logical AND.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `subSearchFn` | [`SubSearchFunction`](../README.md#subsearchfunction)<`TEntity`\> | A function that takes a [Search](Search.md) and returns another [Search](Search.md). |

#### Returns

[`Search`](Search.md)<`TEntity`\>

`this`.

#### Defined in

[lib/search/search.ts:549](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L549)

___

### count

▸ **count**(): `Promise`<`number`\>

Returns the number of [Entities](Entity.md) that match this query.

#### Returns

`Promise`<`number`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[count](AbstractSearch.md#count)

#### Defined in

[lib/search/search.ts:186](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L186)

___

### first

▸ **first**(): `Promise`<``null`` \| `TEntity`\>

Returns the first [Entity](Entity.md) that matches this query.

#### Returns

`Promise`<``null`` \| `TEntity`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[first](AbstractSearch.md#first)

#### Defined in

[lib/search/search.ts:231](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L231)

___

### firstId

▸ **firstId**(): `Promise`<``null`` \| `string`\>

Returns the first entity ID that matches this query.

#### Returns

`Promise`<``null`` \| `string`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[firstId](AbstractSearch.md#firstid)

#### Defined in

[lib/search/search.ts:239](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L239)

___

### firstKey

▸ **firstKey**(): `Promise`<``null`` \| `string`\>

Returns the first key name that matches this query.

#### Returns

`Promise`<``null`` \| `string`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[firstKey](AbstractSearch.md#firstkey)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[max](AbstractSearch.md#max)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[maxId](AbstractSearch.md#maxid)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[maxKey](AbstractSearch.md#maxkey)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[min](AbstractSearch.md#min)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[minId](AbstractSearch.md#minid)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[minKey](AbstractSearch.md#minkey)

#### Defined in

[lib/search/search.ts:150](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L150)

___

### or

▸ **or**(`field`): [`WhereField`](WhereField.md)<`TEntity`\>

Sets up a query matching a particular field as a logical OR.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `field` | `string` | The field to filter on. |

#### Returns

[`WhereField`](WhereField.md)<`TEntity`\>

A subclass of [WhereField](WhereField.md) matching the type of the field.

#### Defined in

[lib/search/search.ts:559](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L559)

▸ **or**(`subSearchFn`): [`Search`](Search.md)<`TEntity`\>

Sets up a nested search as a logical OR.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `subSearchFn` | [`SubSearchFunction`](../README.md#subsearchfunction)<`TEntity`\> | A function that takes a [Search](Search.md) and returns another [Search](Search.md). |

#### Returns

[`Search`](Search.md)<`TEntity`\>

`this`.

#### Defined in

[lib/search/search.ts:566](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L566)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[pageOfIds](AbstractSearch.md#pageofids)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[pageOfKeys](AbstractSearch.md#pageofkeys)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnAll](AbstractSearch.md#returnall)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnAllIds](AbstractSearch.md#returnallids)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnAllKeys](AbstractSearch.md#returnallkeys)

#### Defined in

[lib/search/search.ts:445](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L445)

___

### returnCount

▸ **returnCount**(): `Promise`<`number`\>

Alias for [Search.count](Search.md#count).

#### Returns

`Promise`<`number`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnCount](AbstractSearch.md#returncount)

#### Defined in

[lib/search/search.ts:382](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L382)

___

### returnFirst

▸ **returnFirst**(): `Promise`<``null`` \| `TEntity`\>

Alias for [Search.first](Search.md#first).

#### Returns

`Promise`<``null`` \| `TEntity`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnFirst](AbstractSearch.md#returnfirst)

#### Defined in

[lib/search/search.ts:410](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L410)

___

### returnFirstId

▸ **returnFirstId**(): `Promise`<``null`` \| `string`\>

Alias for [Search.firstId](Search.md#firstid).

#### Returns

`Promise`<``null`` \| `string`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnFirstId](AbstractSearch.md#returnfirstid)

#### Defined in

[lib/search/search.ts:417](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L417)

___

### returnFirstKey

▸ **returnFirstKey**(): `Promise`<``null`` \| `string`\>

Alias for [Search.firstKey](Search.md#firstkey).

#### Returns

`Promise`<``null`` \| `string`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnFirstKey](AbstractSearch.md#returnfirstkey)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnMax](AbstractSearch.md#returnmax)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnMaxId](AbstractSearch.md#returnmaxid)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnMaxKey](AbstractSearch.md#returnmaxkey)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnMin](AbstractSearch.md#returnmin)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnMinId](AbstractSearch.md#returnminid)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnMinKey](AbstractSearch.md#returnminkey)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnPage](AbstractSearch.md#returnpage)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnPageOfIds](AbstractSearch.md#returnpageofids)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnPageOfKeys](AbstractSearch.md#returnpageofkeys)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[sortAsc](AbstractSearch.md#sortasc)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[sortAscending](AbstractSearch.md#sortascending)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[sortBy](AbstractSearch.md#sortby)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[sortDesc](AbstractSearch.md#sortdesc)

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

#### Inherited from

[AbstractSearch](AbstractSearch.md).[sortDescending](AbstractSearch.md#sortdescending)

#### Defined in

[lib/search/search.ts:76](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L76)

___

### where

▸ **where**(`field`): [`WhereField`](WhereField.md)<`TEntity`\>

Sets up a query matching a particular field. If there are multiple calls
to [Search.where](Search.md#where), they are treated logically as AND.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `field` | `string` | The field to filter on. |

#### Returns

[`WhereField`](WhereField.md)<`TEntity`\>

A subclass of [WhereField](WhereField.md) matching the type of the field.

#### Defined in

[lib/search/search.ts:524](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L524)

▸ **where**(`subSearchFn`): [`Search`](Search.md)<`TEntity`\>

Sets up a nested search. If there are multiple calls to [Search.where](Search.md#where),
they are treated logically as AND.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `subSearchFn` | [`SubSearchFunction`](../README.md#subsearchfunction)<`TEntity`\> | A function that takes a [Search](Search.md) and returns another [Search](Search.md). |

#### Returns

[`Search`](Search.md)<`TEntity`\>

`this`.

#### Defined in

[lib/search/search.ts:532](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L532)
