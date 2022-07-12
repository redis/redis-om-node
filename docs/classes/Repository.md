[redis-om](../README.md) / Repository

# Class: Repository<TEntity\>

A repository is the main interaction point for reading, writing, and
removing [Entities](Entity.md) from Redis. Create one by calling
[Client.fetchRepository](Client.md#fetchrepository) and passing in a [Schema](Schema.md). Then
use the [Repository.fetch](Repository.md#fetch), [Repository.save](Repository.md#save), and
[Repository.remove](Repository.md#remove) methods to manage your data:

```typescript
const repository = client.fetchRepository<Foo>(schema);

const foo = await repository.fetch('01FK6TCJBDK41RJ766A4SBWDJ9');
foo.aString = 'bar';
foo.aBoolean = false;
await repository.save(foo);
```

Be sure to use the repository to create a new instance of an
[Entity](Entity.md) you want to create before you save it:

```typescript
const foo = await repository.createEntity();
foo.aString = 'bar';
foo.aBoolean = false;
await repository.save(foo);
```

If you want to the [Repository.search](Repository.md#search) method, you need to create an index
first, and you need RediSearch or RedisJSON installed on your instance of Redis:

```typescript
await repository.createIndex();
const entities = await repository.search()
  .where('aString').eq('bar')
  .and('aBoolean').is.false().returnAll();
```

## Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `TEntity` | extends [`Entity`](Entity.md) | The type of [Entity](Entity.md) that this repository manages. |

## Table of contents

### Properties

- [client](Repository.md#client)
- [schema](Repository.md#schema)

### Methods

- [createAndSave](Repository.md#createandsave)
- [createEntity](Repository.md#createentity)
- [createIndex](Repository.md#createindex)
- [dropIndex](Repository.md#dropindex)
- [expire](Repository.md#expire)
- [fetch](Repository.md#fetch)
- [remove](Repository.md#remove)
- [save](Repository.md#save)
- [search](Repository.md#search)
- [searchRaw](Repository.md#searchraw)

## Properties

### client

• `Protected` **client**: [`Client`](Client.md)

#### Defined in

[lib/repository/index.ts:49](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/repository/index.ts#L49)

___

### schema

• `Protected` **schema**: [`Schema`](Schema.md)<`TEntity`\>

#### Defined in

[lib/repository/index.ts:50](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/repository/index.ts#L50)

## Methods

### createAndSave

▸ **createAndSave**(`data?`): `Promise`<`TEntity`\>

Creates and saves an [Entity](Entity.md). Equivalent of calling
[Repository.createEntity](Repository.md#createentity) followed by [Repository.save](Repository.md#save).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | [`EntityData`](../README.md#entitydata) | Optional values with which to initialize the entity. |

#### Returns

`Promise`<`TEntity`\>

The newly created and saved Entity.

#### Defined in

[lib/repository/index.ts:130](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/repository/index.ts#L130)

___

### createEntity

▸ **createEntity**(`data?`): `TEntity`

Creates an [Entity](Entity.md) with a populated [Entity.entityId](Entity.md#entityid) property.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | [`EntityData`](../README.md#entitydata) | Optional values with which to initialize the entity. |

#### Returns

`TEntity`

A newly created Entity.

#### Defined in

[lib/repository/index.ts:108](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/repository/index.ts#L108)

___

### createIndex

▸ **createIndex**(): `Promise`<`void`\>

Creates an index in Redis for use by the [Repository.search](Repository.md#search) method. Requires
that RediSearch or RedisJSON is installed on your instance of Redis.

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/repository/index.ts:62](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/repository/index.ts#L62)

___

### dropIndex

▸ **dropIndex**(): `Promise`<`void`\>

Removes an existing index from Redis. Use this method if you want to swap out your index
because your [Entity](Entity.md) has changed. Requires that RediSearch or RedisJSON is installed
on your instance of Redis.

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/repository/index.ts:90](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/repository/index.ts#L90)

___

### expire

▸ **expire**(`id`, `ttlInSeconds`): `Promise`<`void`\>

Set the time to live of the [Entity](Entity.md). If the [Entity](Entity.md) is not
found, does nothing.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | The ID of the [Entity](Entity.md) to set and expiration for. |
| `ttlInSeconds` | `number` | The time to live in seconds. |

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/repository/index.ts:214](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/repository/index.ts#L214)

___

### fetch

▸ **fetch**(`id`): `Promise`<`TEntity`\>

Read and return an [Entity](Entity.md) from Redis with the given id. If
the [Entity](Entity.md) is not found, returns an [Entity](Entity.md) with all
properties set to `null`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | The ID of the [Entity](Entity.md) you seek. |

#### Returns

`Promise`<`TEntity`\>

The matching Entity.

#### Defined in

[lib/repository/index.ts:143](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/repository/index.ts#L143)

▸ **fetch**(...`ids`): `Promise`<`TEntity`[]\>

Read and return the [Entities](Entity.md) from Redis with the given IDs. If
a particular [Entity](Entity.md) is not found, returns an [Entity](Entity.md) with all
properties set to `null`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...ids` | `string`[] | The IDs of the [Entities](Entity.md) you seek. |

#### Returns

`Promise`<`TEntity`[]\>

The matching Entities.

#### Defined in

[lib/repository/index.ts:152](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/repository/index.ts#L152)

▸ **fetch**(`ids`): `Promise`<`TEntity`[]\>

Read and return the [Entities](Entity.md) from Redis with the given IDs. If
a particular [Entity](Entity.md) is not found, returns an [Entity](Entity.md) with all
properties set to `null`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ids` | `string`[] | The IDs of the [Entities](Entity.md) you seek. |

#### Returns

`Promise`<`TEntity`[]\>

The matching Entities.

#### Defined in

[lib/repository/index.ts:161](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/repository/index.ts#L161)

___

### remove

▸ **remove**(`id`): `Promise`<`void`\>

Remove an [Entity](Entity.md) from Redis with the given id. If the [Entity](Entity.md) is
not found, does nothing.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | The ID of the [Entity](Entity.md) you wish to delete. |

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/repository/index.ts:181](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/repository/index.ts#L181)

▸ **remove**(...`ids`): `Promise`<`void`\>

Remove the [Entities](Entity.md) from Redis with the given ids. If a
particular [Entity](Entity.md) is not found, does nothing.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...ids` | `string`[] | The IDs of the [Entities](Entity.md) you wish to delete. |

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/repository/index.ts:188](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/repository/index.ts#L188)

▸ **remove**(`ids`): `Promise`<`void`\>

Remove the [Entities](Entity.md) from Redis with the given ids. If a
particular [Entity](Entity.md) is not found, does nothing.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ids` | `string`[] | The IDs of the [Entities](Entity.md) you wish to delete. |

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/repository/index.ts:195](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/repository/index.ts#L195)

___

### save

▸ **save**(`entity`): `Promise`<`string`\>

Save the [Entity](Entity.md) to Redis. If it already exists, it will be updated. If it doesn't
exist, it will be created.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `entity` | `TEntity` | The Entity to save. |

#### Returns

`Promise`<`string`\>

The ID of the Entity just saved.

#### Defined in

[lib/repository/index.ts:119](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/repository/index.ts#L119)

___

### search

▸ **search**(): [`Search`](Search.md)<`TEntity`\>

Kicks off the process of building a query. Requires that RediSearch (and optionally
RedisJSON) be is installed on your instance of Redis.

#### Returns

[`Search`](Search.md)<`TEntity`\>

A [Search](Search.md) object.

#### Defined in

[lib/repository/index.ts:225](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/repository/index.ts#L225)

___

### searchRaw

▸ **searchRaw**(`query`): [`RawSearch`](RawSearch.md)<`TEntity`\>

Creates a search that bypassed Redis OM and instead allows you to execute a raw
RediSearch query. Requires that RediSearch (and optionally RedisJSON) be installed
on your instance of Redis.

**`query`** The raw RediSearch query you want to rune.

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `string` |

#### Returns

[`RawSearch`](RawSearch.md)<`TEntity`\>

A [RawSearch](RawSearch.md) object.

#### Defined in

[lib/repository/index.ts:237](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/repository/index.ts#L237)
