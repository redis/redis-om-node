[redis-om](../README.md) / Search

# Class: Search<T\>

Entry point to fluent search. This is the default Redis OM experience.
Requires that RediSearch (and optionally RedisJSON) be installed.

**`Template`**

The type of [Entity](../README.md#entity) being sought.

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Entity`](../README.md#entity) = `Record`<`string`, `any`\> |

## Hierarchy

- [`AbstractSearch`](AbstractSearch.md)<`T`\>

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

• `get` **return**(): [`AbstractSearch`](AbstractSearch.md)<`T`\>

Returns the current instance. Syntactic sugar to make your code more fluent.

#### Returns

[`AbstractSearch`](AbstractSearch.md)<`T`\>

this

#### Inherited from

AbstractSearch.return

#### Defined in

[lib/search/search.ts:329](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L329)

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

[lib/search/search.ts:285](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L285)

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

[lib/search/search.ts:303](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L303)

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

[lib/search/search.ts:321](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L321)

___

### and

▸ **and**(`field`): [`WhereField`](WhereField.md)<`T`\>

Sets up a query matching a particular field as a logical AND.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `field` | `Exclude`<keyof `T`, keyof [`EntityInternal`](../README.md#entityinternal)\> | The field to filter on. |

#### Returns

[`WhereField`](WhereField.md)<`T`\>

A subclass of [WhereField](WhereField.md) matching the type of the field.

#### Defined in

[lib/search/search.ts:566](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L566)

▸ **and**(`subSearchFn`): [`Search`](Search.md)<`T`\>

Sets up a nested search as a logical AND.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `subSearchFn` | [`SubSearchFunction`](../README.md#subsearchfunction)<`T`\> | A function that takes a [Search](Search.md) and returns another [Search](Search.md). |

#### Returns

[`Search`](Search.md)<`T`\>

`this`.

#### Defined in

[lib/search/search.ts:573](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L573)

___

### count

▸ **count**(): `Promise`<`number`\>

Returns the number of [Entities](../README.md#entity) that match this query.

#### Returns

`Promise`<`number`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[count](AbstractSearch.md#count)

#### Defined in

[lib/search/search.ts:209](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L209)

___

### first

▸ **first**(): `Promise`<``null`` \| `T`\>

Returns the first [Entity](../README.md#entity) that matches this query.

#### Returns

`Promise`<``null`` \| `T`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[first](AbstractSearch.md#first)

#### Defined in

[lib/search/search.ts:250](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L250)

___

### firstId

▸ **firstId**(): `Promise`<``null`` \| `string`\>

Returns the first entity ID that matches this query.

#### Returns

`Promise`<``null`` \| `string`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[firstId](AbstractSearch.md#firstid)

#### Defined in

[lib/search/search.ts:258](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L258)

___

### firstKey

▸ **firstKey**(): `Promise`<``null`` \| `string`\>

Returns the first key name that matches this query.

#### Returns

`Promise`<``null`` \| `string`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[firstKey](AbstractSearch.md#firstkey)

#### Defined in

[lib/search/search.ts:266](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L266)

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

[lib/search/search.ts:183](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L183)

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

[lib/search/search.ts:192](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L192)

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

[lib/search/search.ts:201](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L201)

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

[lib/search/search.ts:156](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L156)

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

[lib/search/search.ts:165](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L165)

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

[lib/search/search.ts:174](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L174)

___

### or

▸ **or**(`field`): [`WhereField`](WhereField.md)<`T`\>

Sets up a query matching a particular field as a logical OR.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `field` | `Exclude`<keyof `T`, keyof [`EntityInternal`](../README.md#entityinternal)\> | The field to filter on. |

#### Returns

[`WhereField`](WhereField.md)<`T`\>

A subclass of [WhereField](WhereField.md) matching the type of the field.

#### Defined in

[lib/search/search.ts:585](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L585)

▸ **or**(`subSearchFn`): [`Search`](Search.md)<`T`\>

Sets up a nested search as a logical OR.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `subSearchFn` | [`SubSearchFunction`](../README.md#subsearchfunction)<`T`\> | A function that takes a [Search](Search.md) and returns another [Search](Search.md). |

#### Returns

[`Search`](Search.md)<`T`\>

`this`.

#### Defined in

[lib/search/search.ts:592](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L592)

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

[lib/search/search.ts:220](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L220)

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

[lib/search/search.ts:231](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L231)

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

[lib/search/search.ts:242](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L242)

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

[lib/search/search.ts:427](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L427)

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

[lib/search/search.ts:434](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L434)

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

[lib/search/search.ts:441](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L441)

___

### returnCount

▸ **returnCount**(): `Promise`<`number`\>

Alias for [count](Search.md#count).

#### Returns

`Promise`<`number`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnCount](AbstractSearch.md#returncount)

#### Defined in

[lib/search/search.ts:378](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L378)

___

### returnFirst

▸ **returnFirst**(): `Promise`<``null`` \| `T`\>

Alias for [first](Search.md#first).

#### Returns

`Promise`<``null`` \| `T`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnFirst](AbstractSearch.md#returnfirst)

#### Defined in

[lib/search/search.ts:406](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L406)

___

### returnFirstId

▸ **returnFirstId**(): `Promise`<``null`` \| `string`\>

Alias for [firstId](Search.md#firstid).

#### Returns

`Promise`<``null`` \| `string`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnFirstId](AbstractSearch.md#returnfirstid)

#### Defined in

[lib/search/search.ts:413](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L413)

___

### returnFirstKey

▸ **returnFirstKey**(): `Promise`<``null`` \| `string`\>

Alias for [firstKey](Search.md#firstkey).

#### Returns

`Promise`<``null`` \| `string`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnFirstKey](AbstractSearch.md#returnfirstkey)

#### Defined in

[lib/search/search.ts:420](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L420)

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

[lib/search/search.ts:357](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L357)

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

[lib/search/search.ts:364](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L364)

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

[lib/search/search.ts:371](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L371)

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

[lib/search/search.ts:336](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L336)

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

[lib/search/search.ts:343](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L343)

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

[lib/search/search.ts:350](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L350)

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

[lib/search/search.ts:385](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L385)

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

[lib/search/search.ts:392](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L392)

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

[lib/search/search.ts:399](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L399)

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

[lib/search/search.ts:92](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L92)

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

[lib/search/search.ts:69](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L69)

___

### sortBy

▸ **sortBy**(`fieldName`, `order?`): [`AbstractSearch`](AbstractSearch.md)<`T`\>

Applies sorting for the query.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `fieldName` | `Exclude`<keyof `T`, keyof [`EntityInternal`](../README.md#entityinternal)\> | `undefined` | The field to sort by. |
| `order` | ``"ASC"`` \| ``"DESC"`` | `"ASC"` | The order of returned [Entities](../README.md#entity) Defaults to `ASC` (ascending) if not specified |

#### Returns

[`AbstractSearch`](AbstractSearch.md)<`T`\>

this

#### Inherited from

[AbstractSearch](AbstractSearch.md).[sortBy](AbstractSearch.md#sortby)

#### Defined in

[lib/search/search.ts:102](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L102)

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

[lib/search/search.ts:76](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L76)

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

[lib/search/search.ts:85](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L85)

___

### where

▸ **where**(`field`): [`WhereField`](WhereField.md)<`T`\>

Sets up a query matching a particular field. If there are multiple calls
to [where](Search.md#where), they are treated logically as AND.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `field` | `Exclude`<keyof `T`, keyof [`EntityInternal`](../README.md#entityinternal)\> | The field to filter on. |

#### Returns

[`WhereField`](WhereField.md)<`T`\>

A subclass of [WhereField](WhereField.md) matching the type of the field.

#### Defined in

[lib/search/search.ts:546](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L546)

▸ **where**(`subSearchFn`): [`Search`](Search.md)<`T`\>

Sets up a nested search. If there are multiple calls to [where](Search.md#where),
they are treated logically as AND.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `subSearchFn` | [`SubSearchFunction`](../README.md#subsearchfunction)<`T`\> | A function that takes a [Search](Search.md) and returns another [Search](Search.md). |

#### Returns

[`Search`](Search.md)<`T`\>

`this`.

#### Defined in

[lib/search/search.ts:554](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L554)
