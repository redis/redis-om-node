redis-om

# redis-om

## Table of contents

### Classes

- [AbstractSearch](classes/AbstractSearch.md)
- [Circle](classes/Circle.md)
- [Client](classes/Client.md)
- [Entity](classes/Entity.md)
- [RawSearch](classes/RawSearch.md)
- [RedisError](classes/RedisError.md)
- [Repository](classes/Repository.md)
- [Schema](classes/Schema.md)
- [Search](classes/Search.md)
- [Where](classes/Where.md)
- [WhereField](classes/WhereField.md)

### Interfaces

- [BooleanField](interfaces/BooleanField.md)
- [DateField](interfaces/DateField.md)
- [Field](interfaces/Field.md)
- [NumberField](interfaces/NumberField.md)
- [PointField](interfaces/PointField.md)
- [Separable](interfaces/Separable.md)
- [Sortable](interfaces/Sortable.md)
- [StringArrayField](interfaces/StringArrayField.md)
- [StringField](interfaces/StringField.md)
- [TextField](interfaces/TextField.md)

### Type aliases

- [CircleFunction](README.md#circlefunction)
- [EntityConstructor](README.md#entityconstructor)
- [EntityCreationData](README.md#entitycreationdata)
- [EntityData](README.md#entitydata)
- [EntityValue](README.md#entityvalue)
- [FieldDefinition](README.md#fielddefinition)
- [IdStrategy](README.md#idstrategy)
- [Point](README.md#point)
- [SchemaDefinition](README.md#schemadefinition)
- [SchemaOptions](README.md#schemaoptions)
- [SearchDataStructure](README.md#searchdatastructure)
- [StopWordOptions](README.md#stopwordoptions)
- [SubSearchFunction](README.md#subsearchfunction)

## Type aliases

### CircleFunction

Ƭ **CircleFunction**: (`circle`: [`Circle`](classes/Circle.md)) => [`Circle`](classes/Circle.md)

#### Type declaration

▸ (`circle`): [`Circle`](classes/Circle.md)

A function that defines a circle for `.inCircle` searches.

##### Parameters

| Name | Type |
| :------ | :------ |
| `circle` | [`Circle`](classes/Circle.md) |

##### Returns

[`Circle`](classes/Circle.md)

#### Defined in

[lib/search/where-point.ts:9](https://github.com/redis/redis-om-node/blob/0843d26/lib/search/where-point.ts#L9)

___

### EntityConstructor

Ƭ **EntityConstructor**<`TEntity`\>: (`schema`: [`Schema`](classes/Schema.md)<`any`\>, `id`: `string`, `data?`: [`EntityData`](README.md#entitydata)) => `TEntity`

#### Type parameters

| Name | Description |
| :------ | :------ |
| `TEntity` | The [Entity](classes/Entity.md) type. |

#### Type declaration

• (`schema`, `id`, `data?`)

A constructor that creates an [Entity](classes/Entity.md) of type TEntity.

##### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | [`Schema`](classes/Schema.md)<`any`\> |
| `id` | `string` |
| `data?` | [`EntityData`](README.md#entitydata) |

#### Defined in

[lib/entity/entity.ts:18](https://github.com/redis/redis-om-node/blob/0843d26/lib/entity/entity.ts#L18)

___

### EntityCreationData

Ƭ **EntityCreationData**: `Record`<`string`, `number` \| `boolean` \| `string` \| `string`[] \| [`Point`](README.md#point) \| `Date` \| ``null``\>

Initialization data for [Entity](classes/Entity.md) creation when calling
[Repository.createEntity](classes/Repository.md#createentity) or [Repository.createAndSave](classes/Repository.md#createandsave).

#### Defined in

[lib/repository/repository.ts:15](https://github.com/redis/redis-om-node/blob/0843d26/lib/repository/repository.ts#L15)

___

### EntityData

Ƭ **EntityData**: `Record`<`string`, [`EntityValue`](README.md#entityvalue)\>

A JavaScript object containing the underlying data of an [Entity](classes/Entity.md).

#### Defined in

[lib/entity/entity.ts:12](https://github.com/redis/redis-om-node/blob/0843d26/lib/entity/entity.ts#L12)

___

### EntityValue

Ƭ **EntityValue**: `number` \| `boolean` \| `string` \| [`Point`](README.md#point) \| `Date` \| `string`[]

Valid values for properties of an [Entity](classes/Entity.md).

#### Defined in

[lib/entity/entity.ts:7](https://github.com/redis/redis-om-node/blob/0843d26/lib/entity/entity.ts#L7)

___

### FieldDefinition

Ƭ **FieldDefinition**: [`StringField`](interfaces/StringField.md) \| [`TextField`](interfaces/TextField.md) \| [`NumberField`](interfaces/NumberField.md) \| [`BooleanField`](interfaces/BooleanField.md) \| [`PointField`](interfaces/PointField.md) \| [`DateField`](interfaces/DateField.md) \| [`StringArrayField`](interfaces/StringArrayField.md)

Contains instructions telling how to map a property on an [Entity](classes/Entity.md) to Redis.

#### Defined in

[lib/schema/schema-definitions.ts:81](https://github.com/redis/redis-om-node/blob/0843d26/lib/schema/schema-definitions.ts#L81)

___

### IdStrategy

Ƭ **IdStrategy**: () => `string`

#### Type declaration

▸ (): `string`

A function that generates random [Entity IDs](classes/Entity.md#entityid).

##### Returns

`string`

#### Defined in

[lib/schema/schema-definitions.ts:89](https://github.com/redis/redis-om-node/blob/0843d26/lib/schema/schema-definitions.ts#L89)

___

### Point

Ƭ **Point**: `Object`

Defines a point on the globe using longitude and latitude.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `latitude` | `number` | The latitude of the point. |
| `longitude` | `number` | The longitude of the point. |

#### Defined in

[lib/schema/schema-definitions.ts:2](https://github.com/redis/redis-om-node/blob/0843d26/lib/schema/schema-definitions.ts#L2)

___

### SchemaDefinition

Ƭ **SchemaDefinition**: `Record`<`string`, [`FieldDefinition`](README.md#fielddefinition)\>

Group of [FieldDefinition](README.md#fielddefinition)s that define the schema for an [Entity](classes/Entity.md).

#### Defined in

[lib/schema/schema-definitions.ts:86](https://github.com/redis/redis-om-node/blob/0843d26/lib/schema/schema-definitions.ts#L86)

___

### SchemaOptions

Ƭ **SchemaOptions**: `Object`

Configuration options for a [Schema](classes/Schema.md).

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `dataStructure?` | [`SearchDataStructure`](README.md#searchdatastructure) | The data structure used to store the [Entity](classes/Entity.md) in Redis. Can be set to either `JSON` or `HASH`. Defaults to JSON. |
| `idStrategy?` | [`IdStrategy`](README.md#idstrategy) | A function that generates a random [Entity ID](classes/Entity.md#entityid). Defaults to a function that generates [ULIDs](https://github.com/ulid/spec). Combined with prefix to generate a Redis key. If prefix is `Foo` and idStratgey returns `12345` then the generated key would be `Foo:12345`. |
| `indexHashName?` | `string` | The name used by Redis OM to store the hash of the index for this [Schema](classes/Schema.md). Defaults to prefix followed by `:index:hash`. So, for a prefix of `Foo`, it would use `Foo:index:hash`. |
| `indexName?` | `string` | The name used by RediSearch to store the index for this [Schema](classes/Schema.md). Defaults to prefix followed by `:index`. So, for a prefix of `Foo`, it would use `Foo:index`. |
| `prefix?` | `string` | The string that comes before the ID when creating Redis keys for [Entities](classes/Entity.md). Defaults to the class name of the [Entity](classes/Entity.md). Combined with the results of idStrategy to generate a key. If prefix is `Foo` and idStrategy returns `12345` then the generated key would be `Foo:12345`. |
| `stopWords?` | `string`[] | Stop words to be used by this schema. If `useStopWords` is anything other than `CUSTOM`, this option is ignored. |
| `useStopWords?` | [`StopWordOptions`](README.md#stopwordoptions) | Configures the usage of stop words. Valid values are `OFF`, `DEFAULT`, and `CUSTOM`. Setting this to `OFF` disables all stop words. Setting this to `DEFAULT` uses the stop words intrinsic to RediSearch. Setting this to `CUSTOM` tells RediSearch to use the stop words in `stopWords`. |

#### Defined in

[lib/schema/schema-options.ts:7](https://github.com/redis/redis-om-node/blob/0843d26/lib/schema/schema-options.ts#L7)

___

### SearchDataStructure

Ƭ **SearchDataStructure**: ``"HASH"`` \| ``"JSON"``

The type of data structure in Redis to map objects to.

#### Defined in

[lib/client.ts:21](https://github.com/redis/redis-om-node/blob/0843d26/lib/client.ts#L21)

___

### StopWordOptions

Ƭ **StopWordOptions**: ``"OFF"`` \| ``"DEFAULT"`` \| ``"CUSTOM"``

Valid values for how to use stop words for a given [Schema](classes/Schema.md).

#### Defined in

[lib/schema/schema-definitions.ts:92](https://github.com/redis/redis-om-node/blob/0843d26/lib/schema/schema-definitions.ts#L92)

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

[lib/search/search.ts:27](https://github.com/redis/redis-om-node/blob/0843d26/lib/search/search.ts#L27)
