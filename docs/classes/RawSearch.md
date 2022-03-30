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
- [max](RawSearch.md#max)
- [min](RawSearch.md#min)
- [page](RawSearch.md#page)
- [returnAll](RawSearch.md#returnall)
- [returnCount](RawSearch.md#returncount)
- [returnFirst](RawSearch.md#returnfirst)
- [returnMax](RawSearch.md#returnmax)
- [returnMin](RawSearch.md#returnmin)
- [returnPage](RawSearch.md#returnpage)
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

[lib/search/search.ts:210](https://github.com/redis/redis-om-node/blob/0843d26/lib/search/search.ts#L210)

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

[lib/search/search.ts:191](https://github.com/redis/redis-om-node/blob/0843d26/lib/search/search.ts#L191)

___

### count

▸ **count**(): `Promise`<`number`\>

Returns the number of [Entities](Entity.md) that match this query.

#### Returns

`Promise`<`number`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[count](AbstractSearch.md#count)

#### Defined in

[lib/search/search.ts:149](https://github.com/redis/redis-om-node/blob/0843d26/lib/search/search.ts#L149)

___

### first

▸ **first**(): `Promise`<`TEntity`\>

Returns only the first [Entity](Entity.md) that matches this query.

#### Returns

`Promise`<`TEntity`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[first](AbstractSearch.md#first)

#### Defined in

[lib/search/search.ts:172](https://github.com/redis/redis-om-node/blob/0843d26/lib/search/search.ts#L172)

___

### max

▸ **max**(`field`): `Promise`<`TEntity`\>

Finds the [Entity](Entity.md) with the maximal value for a field.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `field` | `string` | The field with the maximal value. |

#### Returns

`Promise`<`TEntity`\>

The [Entity](Entity.md) with the maximal value

#### Inherited from

[AbstractSearch](AbstractSearch.md).[max](AbstractSearch.md#max)

#### Defined in

[lib/search/search.ts:141](https://github.com/redis/redis-om-node/blob/0843d26/lib/search/search.ts#L141)

___

### min

▸ **min**(`field`): `Promise`<`TEntity`\>

Finds the [Entity](Entity.md) with the minimal value for a field.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `field` | `string` | The field with the minimal value. |

#### Returns

`Promise`<`TEntity`\>

The [Entity](Entity.md) with the minimal value

#### Inherited from

[AbstractSearch](AbstractSearch.md).[min](AbstractSearch.md#min)

#### Defined in

[lib/search/search.ts:132](https://github.com/redis/redis-om-node/blob/0843d26/lib/search/search.ts#L132)

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

[lib/search/search.ts:162](https://github.com/redis/redis-om-node/blob/0843d26/lib/search/search.ts#L162)

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

[lib/search/search.ts:245](https://github.com/redis/redis-om-node/blob/0843d26/lib/search/search.ts#L245)

___

### returnCount

▸ **returnCount**(): `Promise`<`number`\>

Alias for [Search.count](Search.md#count).

#### Returns

`Promise`<`number`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnCount](AbstractSearch.md#returncount)

#### Defined in

[lib/search/search.ts:231](https://github.com/redis/redis-om-node/blob/0843d26/lib/search/search.ts#L231)

___

### returnFirst

▸ **returnFirst**(): `Promise`<`TEntity`\>

Alias for [Search.first](Search.md#first).

#### Returns

`Promise`<`TEntity`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnFirst](AbstractSearch.md#returnfirst)

#### Defined in

[lib/search/search.ts:252](https://github.com/redis/redis-om-node/blob/0843d26/lib/search/search.ts#L252)

___

### returnMax

▸ **returnMax**(`field`): `Promise`<`TEntity`\>

Alias for [Search.max](Search.md#max).

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | `string` |

#### Returns

`Promise`<`TEntity`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnMax](AbstractSearch.md#returnmax)

#### Defined in

[lib/search/search.ts:224](https://github.com/redis/redis-om-node/blob/0843d26/lib/search/search.ts#L224)

___

### returnMin

▸ **returnMin**(`field`): `Promise`<`TEntity`\>

Alias for [Search.min](Search.md#min).

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | `string` |

#### Returns

`Promise`<`TEntity`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnMin](AbstractSearch.md#returnmin)

#### Defined in

[lib/search/search.ts:217](https://github.com/redis/redis-om-node/blob/0843d26/lib/search/search.ts#L217)

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

[lib/search/search.ts:238](https://github.com/redis/redis-om-node/blob/0843d26/lib/search/search.ts#L238)

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

[lib/search/search.ts:84](https://github.com/redis/redis-om-node/blob/0843d26/lib/search/search.ts#L84)

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

[lib/search/search.ts:61](https://github.com/redis/redis-om-node/blob/0843d26/lib/search/search.ts#L61)

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

[lib/search/search.ts:94](https://github.com/redis/redis-om-node/blob/0843d26/lib/search/search.ts#L94)

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

[lib/search/search.ts:68](https://github.com/redis/redis-om-node/blob/0843d26/lib/search/search.ts#L68)

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

[lib/search/search.ts:77](https://github.com/redis/redis-om-node/blob/0843d26/lib/search/search.ts#L77)
