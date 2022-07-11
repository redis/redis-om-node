[redis-om](../README.md) / Client

# Class: Client

A Client is the starting point for working with Redis OM. Clients manage the
connection to Redis and provide limited functionality for executing Redis commands.
Create a client and open it before you use it:

```typescript
const client = new Client();
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
- [use](Client.md#use)

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

[lib/client.ts:131](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/client.ts#L131)

___

### execute

▸ **execute**(`command`): `Promise`<`unknown`\>

Execute an arbitrary Redis command.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `command` | (`string` \| `number` \| `boolean`)[] | The command to execute. |

#### Returns

`Promise`<`unknown`\>

The raw results of calling the Redis command.

#### Defined in

[lib/client.ts:104](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/client.ts#L104)

___

### fetchRepository

▸ **fetchRepository**<`TEntity`\>(`schema`): [`Repository`](Repository.md)<`TEntity`\>

Creates a repository for the given schema.

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `TEntity` | extends [`Entity`](Entity.md)<`TEntity`\> | The entity type for this [Schema](Schema.md) and [Repository](Repository.md). |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `schema` | [`Schema`](Schema.md)<`TEntity`\> | The schema. |

#### Returns

[`Repository`](Repository.md)<`TEntity`\>

A repository for the provided schema.

#### Defined in

[lib/client.ts:119](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/client.ts#L119)

___

### isOpen

▸ **isOpen**(): `boolean`

#### Returns

`boolean`

Whether a connection is already open.

#### Defined in

[lib/client.ts:245](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/client.ts#L245)

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

[lib/client.ts:90](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/client.ts#L90)

___

### use

▸ **use**(`connection`): `Promise`<[`Client`](Client.md)\>

Attaches an existing Node Redis connection to this Redis OM client. Closes
any existing connection.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `connection` | `RedisClientType`<{ `bf`: { `ADD`: `__module` ; `EXISTS`: `__module` ; `INFO`: `__module` ; `INSERT`: `__module` ; `LOADCHUNK`: `__module` ; `MADD`: `__module` ; `MEXISTS`: `__module` ; `RESERVE`: `__module` ; `SCANDUMP`: `__module` ; `add`: `__module` ; `exists`: `__module` ; `info`: `__module` ; `insert`: `__module` ; `loadChunk`: `__module` ; `mAdd`: `__module` ; `mExists`: `__module` ; `reserve`: `__module` ; `scanDump`: `__module`  } ; `cf`: { `ADD`: `__module` ; `ADDNX`: `__module` ; `COUNT`: `__module` ; `DEL`: `__module` ; `EXISTS`: `__module` ; `INFO`: `__module` ; `INSERT`: `__module` ; `INSERTNX`: `__module` ; `LOADCHUNK`: `__module` ; `RESERVE`: `__module` ; `SCANDUMP`: `__module` ; `add`: `__module` ; `addNX`: `__module` ; `count`: `__module` ; `del`: `__module` ; `exists`: `__module` ; `info`: `__module` ; `insert`: `__module` ; `insertNX`: `__module` ; `loadChunk`: `__module` ; `reserve`: `__module` ; `scanDump`: `__module`  } ; `cms`: { `INCRBY`: `__module` ; `INFO`: `__module` ; `INITBYDIM`: `__module` ; `INITBYPROB`: `__module` ; `MERGE`: `__module` ; `QUERY`: `__module` ; `incrBy`: `__module` ; `info`: `__module` ; `initByDim`: `__module` ; `initByProb`: `__module` ; `merge`: `__module` ; `query`: `__module`  } ; `ft`: { `AGGREGATE`: `__module` ; `ALIASADD`: `__module` ; `ALIASDEL`: `__module` ; `ALIASUPDATE`: `__module` ; `ALTER`: `__module` ; `CONFIG_GET`: `__module` ; `CONFIG_SET`: `__module` ; `CREATE`: `__module` ; `DICTADD`: `__module` ; `DICTDEL`: `__module` ; `DICTDUMP`: `__module` ; `DROPINDEX`: `__module` ; `EXPLAIN`: `__module` ; `EXPLAINCLI`: `__module` ; `INFO`: `__module` ; `PROFILEAGGREGATE`: `__module` ; `PROFILESEARCH`: `__module` ; `SEARCH`: `__module` ; `SPELLCHECK`: `__module` ; `SUGADD`: `__module` ; `SUGDEL`: `__module` ; `SUGGET`: `__module` ; `SUGGET_WITHPAYLOADS`: `__module` ; `SUGGET_WITHSCORES`: `__module` ; `SUGGET_WITHSCORES_WITHPAYLOADS`: `__module` ; `SUGLEN`: `__module` ; `SYNDUMP`: `__module` ; `SYNUPDATE`: `__module` ; `TAGVALS`: `__module` ; `_LIST`: `__module` ; `_list`: `__module` ; `aggregate`: `__module` ; `aliasAdd`: `__module` ; `aliasDel`: `__module` ; `aliasUpdate`: `__module` ; `alter`: `__module` ; `configGet`: `__module` ; `configSet`: `__module` ; `create`: `__module` ; `dictAdd`: `__module` ; `dictDel`: `__module` ; `dictDump`: `__module` ; `dropIndex`: `__module` ; `explain`: `__module` ; `explainCli`: `__module` ; `info`: `__module` ; `profileAggregate`: `__module` ; `profileSearch`: `__module` ; `search`: `__module` ; `spellCheck`: `__module` ; `sugAdd`: `__module` ; `sugDel`: `__module` ; `sugGet`: `__module` ; `sugGetWithPayloads`: `__module` ; `sugGetWithScores`: `__module` ; `sugGetWithScoresWithPayloads`: `__module` ; `sugLen`: `__module` ; `synDump`: `__module` ; `synUpdate`: `__module` ; `tagVals`: `__module`  } ; `graph`: { `CONFIG_GET`: `__module` ; `CONFIG_SET`: `__module` ; `DELETE`: `__module` ; `EXPLAIN`: `__module` ; `LIST`: `__module` ; `PROFILE`: `__module` ; `QUERY`: `__module` ; `QUERY_RO`: `__module` ; `SLOWLOG`: `__module` ; `configGet`: `__module` ; `configSet`: `__module` ; `delete`: `__module` ; `explain`: `__module` ; `list`: `__module` ; `profile`: `__module` ; `query`: `__module` ; `queryRo`: `__module` ; `slowLog`: `__module`  } ; `json`: { `ARRAPPEND`: `__module` ; `ARRINDEX`: `__module` ; `ARRINSERT`: `__module` ; `ARRLEN`: `__module` ; `ARRPOP`: `__module` ; `ARRTRIM`: `__module` ; `DEBUG_MEMORY`: `__module` ; `DEL`: `__module` ; `FORGET`: `__module` ; `GET`: `__module` ; `MGET`: `__module` ; `NUMINCRBY`: `__module` ; `NUMMULTBY`: `__module` ; `OBJKEYS`: `__module` ; `OBJLEN`: `__module` ; `RESP`: `__module` ; `SET`: `__module` ; `STRAPPEND`: `__module` ; `STRLEN`: `__module` ; `TYPE`: `__module` ; `arrAppend`: `__module` ; `arrIndex`: `__module` ; `arrInsert`: `__module` ; `arrLen`: `__module` ; `arrPop`: `__module` ; `arrTrim`: `__module` ; `debugMemory`: `__module` ; `del`: `__module` ; `forget`: `__module` ; `get`: `__module` ; `mGet`: `__module` ; `numIncrBy`: `__module` ; `numMultBy`: `__module` ; `objKeys`: `__module` ; `objLen`: `__module` ; `resp`: `__module` ; `set`: `__module` ; `strAppend`: `__module` ; `strLen`: `__module` ; `type`: `__module`  } ; `topK`: { `ADD`: `__module` ; `COUNT`: `__module` ; `INCRBY`: `__module` ; `INFO`: `__module` ; `LIST`: `__module` ; `LIST_WITHCOUNT`: `__module` ; `QUERY`: `__module` ; `RESERVE`: `__module` ; `add`: `__module` ; `count`: `__module` ; `incrBy`: `__module` ; `info`: `__module` ; `list`: `__module` ; `listWithCount`: `__module` ; `query`: `__module` ; `reserve`: `__module`  } ; `ts`: { `ADD`: `__module` ; `ALTER`: `__module` ; `CREATE`: `__module` ; `CREATERULE`: `__module` ; `DECRBY`: `__module` ; `DEL`: `__module` ; `DELETERULE`: `__module` ; `GET`: `__module` ; `INCRBY`: `__module` ; `INFO`: `__module` ; `INFO_DEBUG`: `__module` ; `MADD`: `__module` ; `MGET`: `__module` ; `MGET_WITHLABELS`: `__module` ; `MRANGE`: `__module` ; `MRANGE_WITHLABELS`: `__module` ; `MREVRANGE`: `__module` ; `MREVRANGE_WITHLABELS`: `__module` ; `QUERYINDEX`: `__module` ; `RANGE`: `__module` ; `REVRANGE`: `__module` ; `add`: `__module` ; `alter`: `__module` ; `create`: `__module` ; `createRule`: `__module` ; `decrBy`: `__module` ; `del`: `__module` ; `deleteRule`: `__module` ; `get`: `__module` ; `incrBy`: `__module` ; `info`: `__module` ; `infoDebug`: `__module` ; `mAdd`: `__module` ; `mGet`: `__module` ; `mGetWithLabels`: `__module` ; `mRange`: `__module` ; `mRangeWithLabels`: `__module` ; `mRevRange`: `__module` ; `mRevRangeWithLabels`: `__module` ; `queryIndex`: `__module` ; `range`: `__module` ; `revRange`: `__module`  }  } & `RedisModules`, `RedisFunctions`, `RedisScripts`\> | An existing Node Redis client. |

#### Returns

`Promise`<[`Client`](Client.md)\>

This [Client](Client.md) instance.

#### Defined in

[lib/client.ts:78](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/client.ts#L78)
