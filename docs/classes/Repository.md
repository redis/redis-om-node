[redis-om](../README.md) / Repository

# Class: Repository<T\>

A repository is the main interaction point for reading, writing, and
removing [Entities](../README.md#entity) from Redis. Create one by calling
[fetchRepository](Client.md#fetchrepository) and passing in a [Schema](Schema.md). Then
use the [fetch](Repository.md#fetch), [save](Repository.md#save), and
[remove](Repository.md#remove) methods to manage your data:

```typescript
const repository = client.fetchRepository(schema)

const foo = await repository.fetch('01FK6TCJBDK41RJ766A4SBWDJ9')
foo.aString = 'bar'
foo.aBoolean = false
await repository.save(foo)
```

Use the repository to create a new instance of an [Entity](../README.md#entity)
before you save it:

```typescript
const foo = await repository.createEntity()
foo.aString = 'bar'
foo.aBoolean = false
await repository.save(foo)
```

If you want to use the [search](Repository.md#search) method, you need to create an index
first, and you need RediSearch or RedisJSON installed on your instance of Redis:

```typescript
await repository.createIndex()
const entities = await repository.search()
  .where('aString').eq('bar')
  .and('aBoolean').is.false().returnAll()
```

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Entity`](../README.md#entity) = `Record`<`string`, `any`\> |

## Table of contents

### Constructors

- [constructor](Repository.md#constructor)

### Methods

- [createIndex](Repository.md#createindex)
- [dropIndex](Repository.md#dropindex)
- [expire](Repository.md#expire)
- [expireAt](Repository.md#expireat)
- [fetch](Repository.md#fetch)
- [remove](Repository.md#remove)
- [save](Repository.md#save)
- [search](Repository.md#search)
- [searchRaw](Repository.md#searchraw)

## Constructors

### constructor

• **new Repository**<`T`\>(`schema`, `clientOrConnection`)

Creates a new [Repository](Repository.md).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Entity`](../README.md#entity) = `Record`<`string`, `any`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `schema` | [`Schema`](Schema.md)<`T`\> | The schema defining that data in the repository. |
| `clientOrConnection` | [`Client`](Client.md) \| [`RedisConnection`](../README.md#redisconnection) | A client to talk to Redis. |

#### Defined in

[lib/repository/repository.ts:56](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/repository/repository.ts#L56)

## Methods

### createIndex

▸ **createIndex**(): `Promise`<`void`\>

Creates an index in Redis for use by the [search](Repository.md#search) method.
Does not create a new index if the index hasn't changed. Requires that
RediSearch and RedisJSON are installed on your instance of Redis.

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/repository/repository.ts:71](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/repository/repository.ts#L71)

___

### dropIndex

▸ **dropIndex**(): `Promise`<`void`\>

Removes an existing index from Redis. Use this method if you want to swap out your index
because your [Entity](../README.md#entity) has changed. Requires that RediSearch and RedisJSON are installed
on your instance of Redis.

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/repository/repository.ts:109](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/repository/repository.ts#L109)

___

### expire

▸ **expire**(`id`, `ttlInSeconds`): `Promise`<`void`\>

Set the time to live of the [Entity](../README.md#entity). If the [Entity](../README.md#entity) is not
found, does nothing.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | The ID of the [Entity](../README.md#entity) to set and expiration for. |
| `ttlInSeconds` | `number` | The time to live in seconds. |

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/repository/repository.ts:242](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/repository/repository.ts#L242)

▸ **expire**(`ids`, `ttlInSeconds`): `Promise`<`void`\>

Set the time to live of the [Entities](../README.md#entity) in Redis with the given
ids. If a particular [Entity](../README.md#entity) is not found, does nothing.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ids` | `string`[] | The IDs of the [Entities](../README.md#entity) you wish to delete. |
| `ttlInSeconds` | `number` | The time to live in seconds. |

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/repository/repository.ts:251](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/repository/repository.ts#L251)

___

### expireAt

▸ **expireAt**(`id`, `expirationDate`): `Promise`<`void`\>

Use Date object to set the [Entity](../README.md#entity)'s time to live. If the [Entity](../README.md#entity)
is not found, does nothing.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | The ID of the [Entity](../README.md#entity) to set an expiration date for. |
| `expirationDate` | `Date` | The time the data should expire. |

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/repository/repository.ts:270](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/repository/repository.ts#L270)

▸ **expireAt**(`ids`, `expirationDate`): `Promise`<`void`\>

Use Date object to set the [Entities](../README.md#entity) in Redis with the given
ids. If a particular [Entity](../README.md#entity) is not found, does nothing.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ids` | `string`[] | The IDs of the [Entities](../README.md#entity) to set an expiration date for. |
| `expirationDate` | `Date` | The time the data should expire. |

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/repository/repository.ts:279](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/repository/repository.ts#L279)

___

### fetch

▸ **fetch**(`id`): `Promise`<`T`\>

Read and return an [Entity](../README.md#entity) from Redis for the given id. If
the [Entity](../README.md#entity) is not found, returns an empty [Entity](../README.md#entity).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | The ID of the [Entity](../README.md#entity) you seek. |

#### Returns

`Promise`<`T`\>

The matching Entity.

#### Defined in

[lib/repository/repository.ts:171](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/repository/repository.ts#L171)

▸ **fetch**(`...ids`): `Promise`<`T`[]\>

Read and return the [Entities](../README.md#entity) from Redis with the given IDs. If
a particular [Entity](../README.md#entity) is not found, returns that [Entity](../README.md#entity) as empty.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...ids` | `string`[] | The IDs of the [Entities](../README.md#entity) you seek. |

#### Returns

`Promise`<`T`[]\>

The matching Entities.

#### Defined in

[lib/repository/repository.ts:180](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/repository/repository.ts#L180)

▸ **fetch**(`ids`): `Promise`<`T`[]\>

Read and return the [Entities](../README.md#entity) from Redis with the given IDs. If
a particular [Entity](../README.md#entity) is not found, returns that [Entity](../README.md#entity) as empty.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ids` | `string`[] | The IDs of the [Entities](../README.md#entity) you seek. |

#### Returns

`Promise`<`T`[]\>

The matching Entities.

#### Defined in

[lib/repository/repository.ts:189](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/repository/repository.ts#L189)

___

### remove

▸ **remove**(`id`): `Promise`<`void`\>

Remove an [Entity](../README.md#entity) from Redis for the given id. If the [Entity](../README.md#entity) is
not found, does nothing.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | The ID of the [Entity](../README.md#entity) you wish to delete. |

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/repository/repository.ts:205](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/repository/repository.ts#L205)

▸ **remove**(`...ids`): `Promise`<`void`\>

Remove the [Entities](../README.md#entity) from Redis for the given ids. If a
particular [Entity](../README.md#entity) is not found, does nothing.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...ids` | `string`[] | The IDs of the [Entities](../README.md#entity) you wish to delete. |

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/repository/repository.ts:213](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/repository/repository.ts#L213)

▸ **remove**(`ids`): `Promise`<`void`\>

Remove the [Entities](../README.md#entity) from Redis for the given ids. If a
particular [Entity](../README.md#entity) is not found, does nothing.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ids` | `string`[] | The IDs of the [Entities](../README.md#entity) you wish to delete. |

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/repository/repository.ts:221](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/repository/repository.ts#L221)

___

### save

▸ **save**(`entity`): `Promise`<`T`\>

Insert or update an [Entity](../README.md#entity) to Redis using its entityId property
if present. If it's not, one is generated.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `entity` | `T` | The Entity to save. |

#### Returns

`Promise`<`T`\>

A copy of the provided Entity with EntityId and EntityKeyName properties added.

#### Defined in

[lib/repository/repository.ts:134](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/repository/repository.ts#L134)

▸ **save**(`id`, `entity`): `Promise`<`T`\>

Insert or update the [Entity](../README.md#entity) to Redis using the provided entityId.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | The id to save the Entity under. |
| `entity` | `T` | The Entity to save. |

#### Returns

`Promise`<`T`\>

A copy of the provided Entity with EntityId and EntityKeyName properties added.

#### Defined in

[lib/repository/repository.ts:143](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/repository/repository.ts#L143)

___

### search

▸ **search**(): [`Search`](Search.md)<`T`\>

Kicks off the process of building a query. Requires that RediSearch (and optionally
RedisJSON) be installed on your instance of Redis.

#### Returns

[`Search`](Search.md)<`T`\>

A [Search](Search.md) object.

#### Defined in

[lib/repository/repository.ts:302](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/repository/repository.ts#L302)

___

### searchRaw

▸ **searchRaw**(`query`): [`RawSearch`](RawSearch.md)<`T`\>

Creates a search that bypasses Redis OM and instead allows you to execute a raw
RediSearch query. Requires that RediSearch (and optionally RedisJSON) be installed
on your instance of Redis.

Refer to https://redis.io/docs/stack/search/reference/query_syntax/ for details on
RediSearch query syntax.

**`Query`**

The raw RediSearch query you want to rune.

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `string` |

#### Returns

[`RawSearch`](RawSearch.md)<`T`\>

A [RawSearch](RawSearch.md) object.

#### Defined in

[lib/repository/repository.ts:317](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/repository/repository.ts#L317)
