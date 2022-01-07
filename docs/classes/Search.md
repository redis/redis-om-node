[redis-om](../README.md) / Search

# Class: Search<TEntity\>

Entry point to fluent search. Requires the RediSearch or RedisJSON is installed.

## Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `TEntity` | extends [`Entity`](Entity.md) | The type of [Entity](Entity.md) being sought. |

## Table of contents

### Accessors

- [return](Search.md#return)

### Methods

- [all](Search.md#all)
- [and](Search.md#and)
- [count](Search.md#count)
- [first](Search.md#first)
- [or](Search.md#or)
- [page](Search.md#page)
- [returnAll](Search.md#returnall)
- [returnCount](Search.md#returncount)
- [returnFirst](Search.md#returnfirst)
- [returnPage](Search.md#returnpage)
- [where](Search.md#where)

## Accessors

### return

• `get` **return**(): [`Search`](Search.md)<`TEntity`\>

Returns the current instance. Syntactic sugar to make your code more fluent.

#### Returns

[`Search`](Search.md)<`TEntity`\>

this

#### Defined in

[lib/search/search.ts:52](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/search.ts#L52)

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

#### Defined in

[lib/search/search.ts:94](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/search.ts#L94)

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

[lib/search/search.ts:170](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/search.ts#L170)

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

[lib/search/search.ts:177](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/search.ts#L177)

___

### count

▸ **count**(): `Promise`<`number`\>

Returns the number of [Entities](Entity.md) that match this query.

#### Returns

`Promise`<`number`\>

#### Defined in

[lib/search/search.ts:60](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/search.ts#L60)

___

### first

▸ **first**(): `Promise`<`TEntity`\>

Returns only the first [Entity](Entity.md) that matches this query.

#### Returns

`Promise`<`TEntity`\>

#### Defined in

[lib/search/search.ts:112](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/search.ts#L112)

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

[lib/search/search.ts:187](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/search.ts#L187)

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

[lib/search/search.ts:194](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/search.ts#L194)

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

#### Defined in

[lib/search/search.ts:73](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/search.ts#L73)

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

[lib/search/search.ts:134](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/search.ts#L134)

___

### returnCount

▸ **returnCount**(): `Promise`<`number`\>

Alias for [Search.count](Search.md#count).

#### Returns

`Promise`<`number`\>

#### Defined in

[lib/search/search.ts:120](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/search.ts#L120)

___

### returnFirst

▸ **returnFirst**(): `Promise`<`TEntity`\>

Alias for (@link Search.first).

#### Returns

`Promise`<`TEntity`\>

#### Defined in

[lib/search/search.ts:142](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/search.ts#L142)

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

[lib/search/search.ts:127](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/search.ts#L127)

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

[lib/search/search.ts:152](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/search.ts#L152)

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

[lib/search/search.ts:160](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/search.ts#L160)
