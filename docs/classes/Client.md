[redis-om](../README.md) / Client

# Class: Client

A Client is the starting point for working with Redis OM. Clients manage the
connection to Redis and provide limited functionality for executing Redis commands.
Create a client and open it before you use it:

```typescript
let client = new Client();
await client.open();
```

A Client is primarily used by a [Repository](Repository.md) which requires a client in
its constructor.

## Table of contents

### Constructors

- [constructor](Client.md#constructor)

### Methods

- [close](Client.md#close)
- [execute](Client.md#execute)
- [fetchRepository](Client.md#fetchrepository)
- [isOpen](Client.md#isopen)
- [open](Client.md#open)

## Constructors

### constructor

• **new Client**()

## Methods

### close

▸ **close**(): `Promise`<`void`\>

Close the connection to Redis.

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/client.ts:95](https://github.com/redis/redis-om-node/blob/ee688a6/lib/client.ts#L95)

___

### execute

▸ **execute**<`TResult`\>(`command`): `Promise`<`TResult`\>

Execute an arbitrary Redis command.

#### Type parameters

| Name | Description |
| :------ | :------ |
| `TResult` | Expect result type such as `string`, `string[]`, or whatever complex type Redis returns. |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `command` | (`string` \| `number` \| `boolean`)[] | The command to execute. |

#### Returns

`Promise`<`TResult`\>

The raw results of calling the Redis command.

#### Defined in

[lib/client.ts:72](https://github.com/redis/redis-om-node/blob/ee688a6/lib/client.ts#L72)

___

### fetchRepository

▸ **fetchRepository**<`TEntity`\>(`schema`): [`Repository`](Repository.md)<`TEntity`\>

Creates a repository for the given schema.

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `TEntity` | extends [`Entity`](Entity.md)<`TEntity`\> | The entity type for this {@lin Schema} and [Repository](Repository.md). |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `schema` | [`Schema`](Schema.md)<`TEntity`\> | The schema. |

#### Returns

[`Repository`](Repository.md)<`TEntity`\>

A repository for the provided schema.

#### Defined in

[lib/client.ts:87](https://github.com/redis/redis-om-node/blob/ee688a6/lib/client.ts#L87)

___

### isOpen

▸ **isOpen**(): `boolean`

#### Returns

`boolean`

Whether a connection is already open

#### Defined in

[lib/client.ts:168](https://github.com/redis/redis-om-node/blob/ee688a6/lib/client.ts#L168)

___

### open

▸ **open**(`url?`): `Promise`<`void`\>

Open a connection to Redis at the provided URL.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `url` | `string` | `'redis://localhost:6379'` | A URL to Redis as defined with the [IANA](https://www.iana.org/assignments/uri-schemes/prov/redis). |

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/client.ts:60](https://github.com/redis/redis-om-node/blob/ee688a6/lib/client.ts#L60)
