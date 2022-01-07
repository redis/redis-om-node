redis-om

# redis-om

## Table of contents

### Classes

- [Client](classes/Client.md)
- [Entity](classes/Entity.md)
- [RedisError](classes/RedisError.md)
- [Repository](classes/Repository.md)
- [Schema](classes/Schema.md)
- [Search](classes/Search.md)
- [Where](classes/Where.md)
- [WhereField](classes/WhereField.md)

### Interfaces

- [ArrayField](interfaces/ArrayField.md)
- [BooleanField](interfaces/BooleanField.md)
- [Field](interfaces/Field.md)
- [NumericField](interfaces/NumericField.md)
- [StringField](interfaces/StringField.md)

### Type aliases

- [EntityConstructor](README.md#entityconstructor)
- [EntityCreationData](README.md#entitycreationdata)
- [EntityData](README.md#entitydata)
- [FieldDefinition](README.md#fielddefinition)
- [IdStrategy](README.md#idstrategy)
- [SchemaDefinition](README.md#schemadefinition)
- [SchemaOptions](README.md#schemaoptions)
- [SearchDataStructure](README.md#searchdatastructure)
- [StopWordOptions](README.md#stopwordoptions)
- [SubSearchFunction](README.md#subsearchfunction)

## Type aliases

### EntityConstructor

Ƭ **EntityConstructor**<`TEntity`\>: (`schemaDef`: [`SchemaDefinition`](README.md#schemadefinition), `id`: `string`, `data?`: [`EntityData`](README.md#entitydata)) => `TEntity`

#### Type parameters

| Name | Description |
| :------ | :------ |
| `TEntity` | The [Entity](classes/Entity.md) type. |

#### Type declaration

• (`schemaDef`, `id`, `data?`)

A constructor that creates an [Entity](classes/Entity.md) of type TEntity.

##### Parameters

| Name | Type |
| :------ | :------ |
| `schemaDef` | [`SchemaDefinition`](README.md#schemadefinition) |
| `id` | `string` |
| `data?` | [`EntityData`](README.md#entitydata) |

#### Defined in

[lib/entity/entity.ts:12](https://github.com/redis/redis-om-node/blob/ee688a6/lib/entity/entity.ts#L12)

___

### EntityCreationData

Ƭ **EntityCreationData**: `Record`<`string`, `number` \| `boolean` \| `string` \| `string`[] \| ``null``\>

Initialization data for [Entity](classes/Entity.md) creation when calling
[Repository.createEntity](classes/Repository.md#createentity) or [Repository.createAndSave](classes/Repository.md#createandsave).

#### Defined in

[lib/repository/repository.ts:14](https://github.com/redis/redis-om-node/blob/ee688a6/lib/repository/repository.ts#L14)

___

### EntityData

Ƭ **EntityData**: `Record`<`string`, `number` \| `boolean` \| `string` \| `string`[]\>

A JavaScript object containing the underlying data of an [Entity](classes/Entity.md).

#### Defined in

[lib/entity/entity.ts:6](https://github.com/redis/redis-om-node/blob/ee688a6/lib/entity/entity.ts#L6)

___

### FieldDefinition

Ƭ **FieldDefinition**: [`NumericField`](interfaces/NumericField.md) \| [`StringField`](interfaces/StringField.md) \| [`BooleanField`](interfaces/BooleanField.md) \| [`ArrayField`](interfaces/ArrayField.md)

Contains instructions telling how to map a property on an [Entity](classes/Entity.md) to Redis.

#### Defined in

[lib/schema/schema-definitions.ts:54](https://github.com/redis/redis-om-node/blob/ee688a6/lib/schema/schema-definitions.ts#L54)

___

### IdStrategy

Ƭ **IdStrategy**: () => `string`

#### Type declaration

▸ (): `string`

A function that generates random [Entity IDs](classes/Entity.md#entityid).

##### Returns

`string`

#### Defined in

[lib/schema/schema-definitions.ts:62](https://github.com/redis/redis-om-node/blob/ee688a6/lib/schema/schema-definitions.ts#L62)

___

### SchemaDefinition

Ƭ **SchemaDefinition**: `Record`<`string`, [`FieldDefinition`](README.md#fielddefinition)\>

Group of [FieldDefinition](README.md#fielddefinition)s that define the schema for an [Entity](classes/Entity.md).

#### Defined in

[lib/schema/schema-definitions.ts:59](https://github.com/redis/redis-om-node/blob/ee688a6/lib/schema/schema-definitions.ts#L59)

___

### SchemaOptions

Ƭ **SchemaOptions**: `Object`

Configuration options for a [Schema](classes/Schema.md).

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `dataStructure?` | [`SearchDataStructure`](README.md#searchdatastructure) | The data structure used to store the [Entity](classes/Entity.md) in Redis. |
| `idStrategy?` | [`IdStrategy`](README.md#idstrategy) | A function that generates a random [Entity ID](classes/Entity.md#entityid). Defaults to a function that generates [ULIDs](https://github.com/ulid/spec). Combined with prefix to generate a Redis key. If prefix is `Foo` and idStratgey returns `12345` then the generated key would be `Foo:12345`. |
| `indexName?` | `string` | The name used by RediSearch to store the index for this [Schema](classes/Schema.md). Defaults to prefix followed by `:index`. So, for a prefix of `Foo`, it would use `Foo:index`. |
| `prefix?` | `string` | The string that comes before the ID when creating Redis keys for [Entities](classes/Entity.md). Defaults to the class name of the [Entity](classes/Entity.md). Combined with the results of idStrategy to generate a key. If prefix is `Foo` and idStrategy returns `12345` then the generated key would be `Foo:12345`. |
| `stopWords?` | `string`[] | Stop words to be used by this schema. If `useStopWords` is anything other than `CUSTOM`, this option is ignored. |
| `useStopWords?` | [`StopWordOptions`](README.md#stopwordoptions) | Configures the usage of stop words. Valid values are `OFF`, `DEFAULT`, and `CUSTOM`. Setting this to `OFF` disables all stop words. Setting this to `DEFAULT` uses the stop words intrinsic to RediSearch. Setting this to `CUSTOM` tells RediSearch to use the stop words in `stopWords`. |

#### Defined in

[lib/schema/schema-options.ts:7](https://github.com/redis/redis-om-node/blob/ee688a6/lib/schema/schema-options.ts#L7)

___

### SearchDataStructure

Ƭ **SearchDataStructure**: ``"HASH"`` \| ``"JSON"``

The type of data structure in Redis to map objects to.

#### Defined in

[lib/client.ts:21](https://github.com/redis/redis-om-node/blob/ee688a6/lib/client.ts#L21)

___

### StopWordOptions

Ƭ **StopWordOptions**: ``"OFF"`` \| ``"DEFAULT"`` \| ``"CUSTOM"``

Valid values for how to use stop words for a given [Schema](classes/Schema.md).

#### Defined in

[lib/schema/schema-definitions.ts:65](https://github.com/redis/redis-om-node/blob/ee688a6/lib/schema/schema-definitions.ts#L65)

___

### SubSearchFunction

Ƭ **SubSearchFunction**<`TEntity`\>: (`search`: [`Search`](classes/Search.md)<`TEntity`\>) => [`Search`](classes/Search.md)<`TEntity`\>

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `TEntity` | extends [`Entity`](classes/Entity.md) | The type of [Entity](classes/Entity.md) being sought. |

#### Type declaration

▸ (`search`): [`Search`](classes/Search.md)<`TEntity`\>

A function that takes a [Search](classes/Search.md) and returns a [Search](classes/Search.md). Used in nested queries.

##### Parameters

| Name | Type |
| :------ | :------ |
| `search` | [`Search`](classes/Search.md)<`TEntity`\> |

##### Returns

[`Search`](classes/Search.md)<`TEntity`\>

#### Defined in

[lib/search/search.ts:22](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/search.ts#L22)
