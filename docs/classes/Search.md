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

• `get` **return**(): [`AbstractSearch`](AbstractSearch.md)<`TEntity`\>

Returns the current instance. Syntactic sugar to make your code more fluent.

#### Returns

[`AbstractSearch`](AbstractSearch.md)<`TEntity`\>

this

#### Inherited from

AbstractSearch.return

#### Defined in

[lib/search/search.ts:115](https://github.com/redis/redis-om-node/blob/39d7998/lib/search/search.ts#L115)

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

[lib/search/search.ts:96](https://github.com/redis/redis-om-node/blob/39d7998/lib/search/search.ts#L96)

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

[lib/search/search.ts:230](https://github.com/redis/redis-om-node/blob/39d7998/lib/search/search.ts#L230)

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

[lib/search/search.ts:237](https://github.com/redis/redis-om-node/blob/39d7998/lib/search/search.ts#L237)

___

### count

▸ **count**(): `Promise`<`number`\>

Returns the number of [Entities](Entity.md) that match this query.

#### Returns

`Promise`<`number`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[count](AbstractSearch.md#count)

#### Defined in

[lib/search/search.ts:54](https://github.com/redis/redis-om-node/blob/39d7998/lib/search/search.ts#L54)

___

### first

▸ **first**(): `Promise`<`TEntity`\>

Returns only the first [Entity](Entity.md) that matches this query.

#### Returns

`Promise`<`TEntity`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[first](AbstractSearch.md#first)

#### Defined in

[lib/search/search.ts:77](https://github.com/redis/redis-om-node/blob/39d7998/lib/search/search.ts#L77)

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

[lib/search/search.ts:247](https://github.com/redis/redis-om-node/blob/39d7998/lib/search/search.ts#L247)

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

[lib/search/search.ts:254](https://github.com/redis/redis-om-node/blob/39d7998/lib/search/search.ts#L254)

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

[lib/search/search.ts:67](https://github.com/redis/redis-om-node/blob/39d7998/lib/search/search.ts#L67)

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

[lib/search/search.ts:136](https://github.com/redis/redis-om-node/blob/39d7998/lib/search/search.ts#L136)

___

### returnCount

▸ **returnCount**(): `Promise`<`number`\>

Alias for [Search.count](Search.md#count).

#### Returns

`Promise`<`number`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnCount](AbstractSearch.md#returncount)

#### Defined in

[lib/search/search.ts:122](https://github.com/redis/redis-om-node/blob/39d7998/lib/search/search.ts#L122)

___

### returnFirst

▸ **returnFirst**(): `Promise`<`TEntity`\>

Alias for [Search.first](Search.md#first).

#### Returns

`Promise`<`TEntity`\>

#### Inherited from

[AbstractSearch](AbstractSearch.md).[returnFirst](AbstractSearch.md#returnfirst)

#### Defined in

[lib/search/search.ts:144](https://github.com/redis/redis-om-node/blob/39d7998/lib/search/search.ts#L144)

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

[lib/search/search.ts:129](https://github.com/redis/redis-om-node/blob/39d7998/lib/search/search.ts#L129)

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

[lib/search/search.ts:212](https://github.com/redis/redis-om-node/blob/39d7998/lib/search/search.ts#L212)

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

[lib/search/search.ts:220](https://github.com/redis/redis-om-node/blob/39d7998/lib/search/search.ts#L220)
