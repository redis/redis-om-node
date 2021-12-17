[redis-om](../README.md) / Search

# Class: Search<TEntity\>

Entry point to fluent search. Requires the RediSearch or RedisJSON is installed.

## Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `TEntity` | extends [`Entity`](Entity.md) | The type of [Entity](Entity.md) being sought. |

## Table of contents

### Methods

- [and](Search.md#and)
- [count](Search.md#count)
- [or](Search.md#or)
- [return](Search.md#return)
- [returnAll](Search.md#returnall)
- [where](Search.md#where)

## Methods

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

[lib/search/search.ts:125](https://github.com/redis/redis-om-node/blob/3233465/lib/search/search.ts#L125)

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

[lib/search/search.ts:132](https://github.com/redis/redis-om-node/blob/3233465/lib/search/search.ts#L132)

___

### count

▸ **count**(): `Promise`<`number`\>

Returns the number of [Entities](Entity.md) that match this query.

#### Returns

`Promise`<`number`\>

#### Defined in

[lib/search/search.ts:52](https://github.com/redis/redis-om-node/blob/3233465/lib/search/search.ts#L52)

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

[lib/search/search.ts:142](https://github.com/redis/redis-om-node/blob/3233465/lib/search/search.ts#L142)

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

[lib/search/search.ts:149](https://github.com/redis/redis-om-node/blob/3233465/lib/search/search.ts#L149)

___

### return

▸ **return**(`offset`, `count`): `Promise`<`TEntity`[]\>

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

[lib/search/search.ts:65](https://github.com/redis/redis-om-node/blob/3233465/lib/search/search.ts#L65)

___

### returnAll

▸ **returnAll**(`options?`): `Promise`<`TEntity`[]\>

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

[lib/search/search.ts:86](https://github.com/redis/redis-om-node/blob/3233465/lib/search/search.ts#L86)

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

[lib/search/search.ts:107](https://github.com/redis/redis-om-node/blob/3233465/lib/search/search.ts#L107)

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

[lib/search/search.ts:115](https://github.com/redis/redis-om-node/blob/3233465/lib/search/search.ts#L115)
