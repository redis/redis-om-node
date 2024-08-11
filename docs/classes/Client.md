[redis-om](../README.md) / Client

# Class: Client

A Client is the starting point for working with Redis OM. Clients manage the
connection to Redis and provide limited functionality for executing Redis commands.
Create a client and open it before you use it:

```typescript
const client = new Client()
await client.open()
```

A Client is primarily used by a [Repository](Repository.md) which requires a client in
its constructor.

**`Deprecated`**

Just use Node Redis client directly and pass it to the Repository.

## Table of contents

### Constructors

- [constructor](Client.md#constructor)

### Accessors

- [redis](Client.md#redis)

### Methods

- [close](Client.md#close)
- [fetchRepository](Client.md#fetchrepository)
- [isOpen](Client.md#isopen)
- [open](Client.md#open)
- [use](Client.md#use)
- [useNoClose](Client.md#usenoclose)

## Constructors

### constructor

• **new Client**()

## Accessors

### redis

• `get` **redis**(): `undefined` \| [`RedisConnection`](../README.md#redisconnection)

Returns the underlying Node Redis connection being used.

#### Returns

`undefined` \| [`RedisConnection`](../README.md#redisconnection)

#### Defined in

[lib/client/client.ts:70](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/client/client.ts#L70)

## Methods

### close

▸ **close**(): `Promise`<`void`\>

Close the connection to Redis.

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/client/client.ts:127](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/client/client.ts#L127)

___

### fetchRepository

▸ **fetchRepository**<`T`\>(`schema`): [`Repository`](Repository.md)<[`InferSchema`](../README.md#inferschema)<`T`\>\>

Creates a repository for the given schema.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Schema`](Schema.md)<`any`, `T`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `schema` | `T` | The schema. |

#### Returns

[`Repository`](Repository.md)<[`InferSchema`](../README.md#inferschema)<`T`\>\>

A repository for the provided schema.

#### Defined in

[lib/client/client.ts:119](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/client/client.ts#L119)

___

### isOpen

▸ **isOpen**(): `boolean`

#### Returns

`boolean`

Whether a connection is already open.

#### Defined in

[lib/client/client.ts:213](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/client/client.ts#L213)

___

### open

▸ **open**(`url?`): `Promise`<[`Client`](Client.md)\>

Open a connection to Redis at the provided URL.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `url` | `string` | `'redis://localhost:6379'` | A URL to Redis as defined with the [IANA](https://www.iana.org/assignments/uri-schemes/prov/redis). |

#### Returns

`Promise`<[`Client`](Client.md)\>

This [Client](Client.md) instance.

#### Defined in

[lib/client/client.ts:104](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/client/client.ts#L104)

___

### use

▸ **use**(`connection`): `Promise`<[`Client`](Client.md)\>

Attaches an existing Node Redis connection to this Redis OM client. Closes
any existing connection.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `connection` | [`RedisConnection`](../README.md#redisconnection) | An existing Node Redis client. |

#### Returns

`Promise`<[`Client`](Client.md)\>

This [Client](Client.md) instance.

#### Defined in

[lib/client/client.ts:81](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/client/client.ts#L81)

___

### useNoClose

▸ **useNoClose**(`connection`): [`Client`](Client.md)

Attaches an existing Node Redis connection to this Redis OM client. Does
not close any existing connection.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `connection` | [`RedisConnection`](../README.md#redisconnection) | An existing Node Redis client. |

#### Returns

[`Client`](Client.md)

This [Client](Client.md) instance.

#### Defined in

[lib/client/client.ts:93](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/client/client.ts#L93)
