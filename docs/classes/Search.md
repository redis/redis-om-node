[redis-om](../README.md) / Search

# Class: Search<TEntity\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `TEntity` | extends [`Entity`](Entity.md) |

## Table of contents

### Constructors

- [constructor](Search.md#constructor)

### Accessors

- [query](Search.md#query)

### Methods

- [and](Search.md#and)
- [count](Search.md#count)
- [or](Search.md#or)
- [return](Search.md#return)
- [returnAll](Search.md#returnall)
- [where](Search.md#where)

## Constructors

### constructor

• **new Search**<`TEntity`\>(`schema`, `client`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TEntity` | extends [`Entity`](Entity.md)<`TEntity`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | [`Schema`](Schema.md)<`TEntity`\> |
| `client` | [`Client`](Client.md) |

#### Defined in

[lib/search/search.ts:26](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/search.ts#L26)

## Accessors

### query

• `get` **query**(): `string`

#### Returns

`string`

#### Defined in

[lib/search/search.ts:31](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/search.ts#L31)

## Methods

### and

▸ **and**(`field`): [`WhereField`](WhereField.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | `string` |

#### Returns

[`WhereField`](WhereField.md)<`TEntity`\>

#### Defined in

[lib/search/search.ts:71](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/search.ts#L71)

▸ **and**(`subSearchFn`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `subSearchFn` | `SubSearchFunction`<`TEntity`\> |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Defined in

[lib/search/search.ts:72](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/search.ts#L72)

___

### count

▸ **count**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Defined in

[lib/search/search.ts:36](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/search.ts#L36)

___

### or

▸ **or**(`field`): [`WhereField`](WhereField.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | `string` |

#### Returns

[`WhereField`](WhereField.md)<`TEntity`\>

#### Defined in

[lib/search/search.ts:77](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/search.ts#L77)

▸ **or**(`subSearchFn`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `subSearchFn` | `SubSearchFunction`<`TEntity`\> |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Defined in

[lib/search/search.ts:78](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/search.ts#L78)

___

### return

▸ **return**(`offset`, `pageSize`): `Promise`<`TEntity`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `offset` | `number` |
| `pageSize` | `number` |

#### Returns

`Promise`<`TEntity`[]\>

#### Defined in

[lib/search/search.ts:43](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/search.ts#L43)

___

### returnAll

▸ **returnAll**(`options?`): `Promise`<`TEntity`[]\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `options` | `Object` | `undefined` |
| `options.pageSize` | `number` | `10` |

#### Returns

`Promise`<`TEntity`[]\>

#### Defined in

[lib/search/search.ts:50](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/search.ts#L50)

___

### where

▸ **where**(`field`): [`WhereField`](WhereField.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | `string` |

#### Returns

[`WhereField`](WhereField.md)<`TEntity`\>

#### Defined in

[lib/search/search.ts:65](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/search.ts#L65)

▸ **where**(`subSearchFn`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `subSearchFn` | `SubSearchFunction`<`TEntity`\> |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Defined in

[lib/search/search.ts:66](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/search.ts#L66)
