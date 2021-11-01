[redis-om](../README.md) / Repository

# Class: Repository<TEntity\>

A repository is the main interaction point for reading, writing, and
removing [Entities](Entity.md) from Redis. Create one by passing
in a [Schema](Schema.md) and a [Client](Client.md). Then use the [Repository.fetch](Repository.md#fetch),
[Repository.save](Repository.md#save), and [Repository.remove](Repository.md#remove) methods to manage your
data:

```typescript
let repository = new Repository<Foo>(schema, client);

let foo = await repository.fetch('01FK6TCJBDK41RJ766A4SBWDJ9');
foo.aString = 'bar';
foo.aBoolean = false;
await repository.save(foo);
```

Be sure to use the repository to create a new instance of [Entity](Entity.md) you want
to create before you save it:

```typescript
let foo = await repository.createEntity();
foo.aString = 'bar';
foo.aBoolean = false;
await repository.save(foo);
```

If you want to the [Repository.search](Repository.md#search) method, you need to create an index
first, and you need RediSearch or RedisJSON installed on your instance of Redis:

```typescript
await repository.createIndex();
let entities = await repository.search()
  .where('aString').eq('bar')
  .and('aBoolean').is.false().returnAll();
```

## Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `TEntity` | extends [`Entity`](Entity.md) | The type of [Entity](Entity.md) that this repository manages. |

## Table of contents

### Constructors

- [constructor](Repository.md#constructor)

### Methods

- [createEntity](Repository.md#createentity)
- [createIndex](Repository.md#createindex)
- [dropIndex](Repository.md#dropindex)
- [fetch](Repository.md#fetch)
- [remove](Repository.md#remove)
- [save](Repository.md#save)
- [search](Repository.md#search)

## Constructors

### constructor

• **new Repository**<`TEntity`\>(`schema`, `client`)

Constructs a new Repository.

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `TEntity` | extends [`Entity`](Entity.md)<`TEntity`\> | The type of [Entity](Entity.md) that this repository manages. |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `schema` | [`Schema`](Schema.md)<`TEntity`\> | The [Schema](Schema.md) for this Repository. |
| `client` | [`Client`](Client.md) | An open [Client](Client.md). |

#### Defined in

[lib/repository/repository.ts:60](https://github.com/redis-developer/redis-om-node/blob/3cf5542/lib/repository/repository.ts#L60)

## Methods

### createEntity

▸ **createEntity**(): `TEntity`

Creates an empty [Entity](Entity.md) with a populated [Entity.entityId](Entity.md#entityid) property.

#### Returns

`TEntity`

A newly created Entity.

#### Defined in

[lib/repository/repository.ts:92](https://github.com/redis-developer/redis-om-node/blob/3cf5542/lib/repository/repository.ts#L92)

___

### createIndex

▸ **createIndex**(): `Promise`<`void`\>

Creates an index in Redis for use by the [Repository.search](Repository.md#search) method. Requires
that RediSearch or RedisJSON is installed on your instance of Redis.

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/repository/repository.ts:71](https://github.com/redis-developer/redis-om-node/blob/3cf5542/lib/repository/repository.ts#L71)

___

### dropIndex

▸ **dropIndex**(): `Promise`<`void`\>

Removes an existing index from Redis. Use this method if you want to swap out you index
because your [Entity](Entity.md) has changed. Requires that RediSearch or RedisJSON is installed
on your instance of Redis.

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/repository/repository.ts:84](https://github.com/redis-developer/redis-om-node/blob/3cf5542/lib/repository/repository.ts#L84)

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

[lib/repository/repository.ts:130](https://github.com/redis-developer/redis-om-node/blob/3cf5542/lib/repository/repository.ts#L130)

___

### remove

▸ **remove**(`id`): `Promise`<`void`\>

Remove an [Entity](Entity.md) from Redis with the given id. If the [Entity](Entity.md) is
not found, does nothing.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | The ID of the [Entity](Entity.md) you with to delete. |

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/repository/repository.ts:151](https://github.com/redis-developer/redis-om-node/blob/3cf5542/lib/repository/repository.ts#L151)

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

[lib/repository/repository.ts:103](https://github.com/redis-developer/redis-om-node/blob/3cf5542/lib/repository/repository.ts#L103)

___

### search

▸ **search**(): [`Search`](Search.md)<`TEntity`\>

Kicks off the processes of building a query. Requires that RediSearch or
RedisJSON is installed on your instance of Redis.

#### Returns

[`Search`](Search.md)<`TEntity`\>

A [Search](Search.md) object.

#### Defined in

[lib/repository/repository.ts:162](https://github.com/redis-developer/redis-om-node/blob/3cf5542/lib/repository/repository.ts#L162)
