redis-om

# redis-om

## Table of contents

### Classes

- [AbstractSearch](classes/AbstractSearch.md)
- [ArrayHashInput](classes/ArrayHashInput.md)
- [Circle](classes/Circle.md)
- [Client](classes/Client.md)
- [Field](classes/Field.md)
- [FieldNotInSchema](classes/FieldNotInSchema.md)
- [InvalidHashInput](classes/InvalidHashInput.md)
- [InvalidHashValue](classes/InvalidHashValue.md)
- [InvalidInput](classes/InvalidInput.md)
- [InvalidJsonInput](classes/InvalidJsonInput.md)
- [InvalidJsonValue](classes/InvalidJsonValue.md)
- [InvalidSchema](classes/InvalidSchema.md)
- [InvalidValue](classes/InvalidValue.md)
- [NestedHashInput](classes/NestedHashInput.md)
- [NullJsonInput](classes/NullJsonInput.md)
- [NullJsonValue](classes/NullJsonValue.md)
- [PointOutOfRange](classes/PointOutOfRange.md)
- [RawSearch](classes/RawSearch.md)
- [RedisOmError](classes/RedisOmError.md)
- [Repository](classes/Repository.md)
- [Schema](classes/Schema.md)
- [Search](classes/Search.md)
- [SearchError](classes/SearchError.md)
- [SemanticSearchError](classes/SemanticSearchError.md)
- [Where](classes/Where.md)
- [WhereField](classes/WhereField.md)

### Type Aliases

- [AllFieldDefinition](README.md#allfielddefinition)
- [BooleanFieldDefinition](README.md#booleanfielddefinition)
- [CircleFunction](README.md#circlefunction)
- [CommonFieldDefinition](README.md#commonfielddefinition)
- [DataStructure](README.md#datastructure)
- [DateFieldDefinition](README.md#datefielddefinition)
- [Entity](README.md#entity)
- [EntityData](README.md#entitydata)
- [EntityDataValue](README.md#entitydatavalue)
- [EntityInternal](README.md#entityinternal)
- [EntityKeys](README.md#entitykeys)
- [FieldDefinition](README.md#fielddefinition)
- [FieldType](README.md#fieldtype)
- [IdStrategy](README.md#idstrategy)
- [InferSchema](README.md#inferschema)
- [NumberArrayFieldDefinition](README.md#numberarrayfielddefinition)
- [NumberFieldDefinition](README.md#numberfielddefinition)
- [Point](README.md#point)
- [PointFieldDefinition](README.md#pointfielddefinition)
- [RedisClientConnection](README.md#redisclientconnection)
- [RedisClusterConnection](README.md#redisclusterconnection)
- [RedisConnection](README.md#redisconnection)
- [SchemaDefinition](README.md#schemadefinition)
- [SchemaOptions](README.md#schemaoptions)
- [StopWordOptions](README.md#stopwordoptions)
- [StringArrayFieldDefinition](README.md#stringarrayfielddefinition)
- [StringFieldDefinition](README.md#stringfielddefinition)
- [SubSearchFunction](README.md#subsearchfunction)
- [TextFieldDefinition](README.md#textfielddefinition)

### Variables

- [EntityId](README.md#entityid)
- [EntityKeyName](README.md#entitykeyname)

## Type Aliases

### AllFieldDefinition

Ƭ **AllFieldDefinition**: `Object`

All configuration properties that any field might have, regardless of type.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `alias?` | `string` | The default field name in Redis is the property name defined in the [SchemaDefinition](README.md#schemadefinition). Overrides the field name for a Hash to this value or in the case of JSON documents, sets the JSONPath to this value preceded by `$.`. Overridden by [field](README.md#field) and/or [path](README.md#path) settings. **`Deprecated`** |
| `caseSensitive?` | `boolean` | Is the original case of this field indexed with Redis OM. Defaults to false. |
| `field?` | `string` | The field name used to store this in a Redis Hash. Defaults to the name used in the [SchemaDefinition](README.md#schemadefinition) or the [alias](README.md#alias) property. |
| `indexed?` | `boolean` | Is this field indexed and thus searchable with Redis OM. Defaults to true. |
| `matcher?` | ``"dm:en"`` \| ``"dm:fr"`` \| ``"dm:pt"`` \| ``"dm:es"`` | Enables setting the phonetic matcher to use, supported matchers are: dm:en - Double Metaphone for English dm:fr - Double Metaphone for French dm:pt - Double Metaphone for Portuguese dm:es - Double Metaphone for Spanish |
| `normalized?` | `boolean` | Is this (sortable) field normalized when indexed. Defaults to true. |
| `path?` | `string` | The JSONPath expression this field references. Used only by search and only for JSON documents. Defaults to the name used in the [SchemaDefinition](README.md#schemadefinition) or the [alias](README.md#alias) property prefixed with `$.` . |
| `separator?` | `string` | Due to how RediSearch works, strings and arrays are sometimes stored the same in Redis, as a simple string. This is the separator used to split those strings when it is an array. If your StringField contains this separator, this can cause problems. You can change it here to avoid those problems. Defaults to `\|`. |
| `sortable?` | `boolean` | Enables sorting by this field. |
| `stemming?` | `boolean` | Is word stemming applied to this field with Redis OM. Defaults to true. |
| `type` | [`FieldType`](README.md#fieldtype) | The type of the field (i.e. string, number, boolean, etc.) |
| `weight?` | `number` | Enables setting the weight to apply to a text field |

#### Defined in

[lib/schema/definitions.ts:7](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/schema/definitions.ts#L7)

___

### BooleanFieldDefinition

Ƭ **BooleanFieldDefinition**: { `type`: ``"boolean"``  } & [`CommonFieldDefinition`](README.md#commonfielddefinition) & `Pick`<[`AllFieldDefinition`](README.md#allfielddefinition), ``"sortable"``\>

A field representing a boolean.

#### Defined in

[lib/schema/definitions.ts:80](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/schema/definitions.ts#L80)

___

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

[lib/search/where-point.ts:8](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-point.ts#L8)

___

### CommonFieldDefinition

Ƭ **CommonFieldDefinition**: `Pick`<[`AllFieldDefinition`](README.md#allfielddefinition), ``"type"`` \| ``"alias"`` \| ``"indexed"`` \| ``"field"`` \| ``"path"``\>

The configuration properties that all fields have in common.

#### Defined in

[lib/schema/definitions.ts:77](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/schema/definitions.ts#L77)

___

### DataStructure

Ƭ **DataStructure**: ``"HASH"`` \| ``"JSON"``

The type of data structure in Redis to map objects to.

#### Defined in

[lib/schema/options.ts:2](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/schema/options.ts#L2)

___

### DateFieldDefinition

Ƭ **DateFieldDefinition**: { `type`: ``"date"``  } & [`CommonFieldDefinition`](README.md#commonfielddefinition) & `Pick`<[`AllFieldDefinition`](README.md#allfielddefinition), ``"sortable"``\>

A field representing a date/time.

#### Defined in

[lib/schema/definitions.ts:85](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/schema/definitions.ts#L85)

___

### Entity

Ƭ **Entity**: [`EntityData`](README.md#entitydata) & [`EntityInternal`](README.md#entityinternal)

Defines the objects returned from calls to [repositories](classes/Repository.md).

#### Defined in

[lib/entity/entity.ts:16](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/entity/entity.ts#L16)

___

### EntityData

Ƭ **EntityData**: `Object`

The free-form data associated with an [Entity](README.md#entity).

#### Index signature

▪ [key: `string`]: [`EntityDataValue`](README.md#entitydatavalue) \| [`EntityData`](README.md#entitydata) \| ([`EntityDataValue`](README.md#entitydatavalue) \| [`EntityData`](README.md#entitydata))[]

#### Defined in

[lib/entity/entity.ts:20](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/entity/entity.ts#L20)

___

### EntityDataValue

Ƭ **EntityDataValue**: `string` \| `number` \| `boolean` \| `Date` \| [`Point`](README.md#point) \| ``null`` \| `undefined` \| ([`EntityDataValue`](README.md#entitydatavalue) \| [`EntityData`](README.md#entitydata))[]

Valid types for values in an [Entity](README.md#entity).

#### Defined in

[lib/entity/entity.ts:25](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/entity/entity.ts#L25)

___

### EntityInternal

Ƭ **EntityInternal**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `[EntityId]?` | `string` | The unique ID of the [Entity](README.md#entity). Access using the [EntityId](README.md#entityid) Symbol. |
| `[EntityKeyName]?` | `string` | The key the [Entity](README.md#entity) is stored under inside of Redis. Access using the [EntityKeyName](README.md#entitykeyname) Symbol. |

#### Defined in

[lib/entity/entity.ts:7](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/entity/entity.ts#L7)

___

### EntityKeys

Ƭ **EntityKeys**<`T`\>: `Exclude`<keyof `T`, keyof [`EntityInternal`](README.md#entityinternal)\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Entity`](README.md#entity) |

#### Defined in

[lib/entity/entity.ts:17](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/entity/entity.ts#L17)

___

### FieldDefinition

Ƭ **FieldDefinition**: [`BooleanFieldDefinition`](README.md#booleanfielddefinition) \| [`DateFieldDefinition`](README.md#datefielddefinition) \| [`NumberFieldDefinition`](README.md#numberfielddefinition) \| [`NumberArrayFieldDefinition`](README.md#numberarrayfielddefinition) \| [`PointFieldDefinition`](README.md#pointfielddefinition) \| [`StringFieldDefinition`](README.md#stringfielddefinition) \| [`StringArrayFieldDefinition`](README.md#stringarrayfielddefinition) \| [`TextFieldDefinition`](README.md#textfielddefinition)

Contains instructions telling how to map a property on an [Entity](README.md#entity) to Redis.

#### Defined in

[lib/schema/definitions.ts:119](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/schema/definitions.ts#L119)

___

### FieldType

Ƭ **FieldType**: ``"boolean"`` \| ``"date"`` \| ``"number"`` \| ``"number[]"`` \| ``"point"`` \| ``"string"`` \| ``"string[]"`` \| ``"text"``

Valid field types for a [FieldDefinition](README.md#fielddefinition).

#### Defined in

[lib/schema/definitions.ts:4](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/schema/definitions.ts#L4)

___

### IdStrategy

Ƭ **IdStrategy**: () => `Promise`<`string`\>

#### Type declaration

▸ (): `Promise`<`string`\>

A function that generates random entityIds.

##### Returns

`Promise`<`string`\>

#### Defined in

[lib/schema/options.ts:5](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/schema/options.ts#L5)

___

### InferSchema

Ƭ **InferSchema**<`T`\>: `T` extends [`Schema`](classes/Schema.md)<infer R\> ? `R` : `never`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[lib/schema/schema.ts:181](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/schema/schema.ts#L181)

___

### NumberArrayFieldDefinition

Ƭ **NumberArrayFieldDefinition**: { `type`: ``"number[]"``  } & [`CommonFieldDefinition`](README.md#commonfielddefinition) & `Pick`<[`AllFieldDefinition`](README.md#allfielddefinition), ``"sortable"``\>

A field representing an array of numbers.

#### Defined in

[lib/schema/definitions.ts:95](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/schema/definitions.ts#L95)

___

### NumberFieldDefinition

Ƭ **NumberFieldDefinition**: { `type`: ``"number"``  } & [`CommonFieldDefinition`](README.md#commonfielddefinition) & `Pick`<[`AllFieldDefinition`](README.md#allfielddefinition), ``"sortable"``\>

A field representing a number.

#### Defined in

[lib/schema/definitions.ts:90](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/schema/definitions.ts#L90)

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

[lib/entity/entity.ts:28](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/entity/entity.ts#L28)

___

### PointFieldDefinition

Ƭ **PointFieldDefinition**: { `type`: ``"point"``  } & [`CommonFieldDefinition`](README.md#commonfielddefinition)

A field representing a point on the globe.

#### Defined in

[lib/schema/definitions.ts:100](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/schema/definitions.ts#L100)

___

### RedisClientConnection

Ƭ **RedisClientConnection**: `ReturnType`<typeof `createClient`\>

A conventional Redis connection.

#### Defined in

[lib/client/client.ts:8](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/client/client.ts#L8)

___

### RedisClusterConnection

Ƭ **RedisClusterConnection**: `ReturnType`<typeof `createCluster`\>

A clustered Redis connection.

#### Defined in

[lib/client/client.ts:11](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/client/client.ts#L11)

___

### RedisConnection

Ƭ **RedisConnection**: [`RedisClientConnection`](README.md#redisclientconnection) \| [`RedisClusterConnection`](README.md#redisclusterconnection)

A Redis connection, clustered or conventional.

#### Defined in

[lib/client/client.ts:14](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/client/client.ts#L14)

___

### SchemaDefinition

Ƭ **SchemaDefinition**<`T`\>: `Record`<[`EntityKeys`](README.md#entitykeys)<`T`\>, [`FieldDefinition`](README.md#fielddefinition)\>

Group of [FieldDefinition](README.md#fielddefinition)s that define the schema for an [Entity](README.md#entity).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Entity`](README.md#entity) = `Record`<`string`, `any`\> |

#### Defined in

[lib/schema/definitions.ts:125](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/schema/definitions.ts#L125)

___

### SchemaOptions

Ƭ **SchemaOptions**: `Object`

Configuration options for a [Schema](classes/Schema.md).

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `dataStructure?` | [`DataStructure`](README.md#datastructure) | The data structure used to store the [Entity](README.md#entity) in Redis. Can be set to either `JSON` or `HASH`. Defaults to JSON. |
| `idStrategy?` | [`IdStrategy`](README.md#idstrategy) | A function that generates a random entityId. Defaults to a function that generates [ULIDs](https://github.com/ulid/spec). Combined with prefix to generate a Redis key. If prefix is `Foo` and idStratgey returns `12345` then the generated key would be `Foo:12345`. |
| `indexHashName?` | `string` | The name used by Redis OM to store the hash of the index for this [Schema](classes/Schema.md). Defaults to prefix followed by `:index:hash`. So, for a prefix of `Foo`, it would use `Foo:index:hash`. |
| `indexName?` | `string` | The name used by RediSearch to store the index for this [Schema](classes/Schema.md). Defaults to prefix followed by `:index`. So, for a prefix of `Foo`, it would use `Foo:index`. |
| `stopWords?` | `string`[] | Stop words to be used by this schema. If `useStopWords` is anything other than `CUSTOM`, this option is ignored. |
| `useStopWords?` | [`StopWordOptions`](README.md#stopwordoptions) | Configures the usage of stop words. Valid values are `OFF`, `DEFAULT`, and `CUSTOM`. Setting this to `OFF` disables all stop words. Setting this to `DEFAULT` uses the stop words intrinsic to RediSearch. Setting this to `CUSTOM` tells RediSearch to use the stop words in `stopWords`. |

#### Defined in

[lib/schema/options.ts:11](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/schema/options.ts#L11)

___

### StopWordOptions

Ƭ **StopWordOptions**: ``"OFF"`` \| ``"DEFAULT"`` \| ``"CUSTOM"``

Valid values for how to use stop words for a given [Schema](classes/Schema.md).

#### Defined in

[lib/schema/options.ts:8](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/schema/options.ts#L8)

___

### StringArrayFieldDefinition

Ƭ **StringArrayFieldDefinition**: { `type`: ``"string[]"``  } & [`CommonFieldDefinition`](README.md#commonfielddefinition) & `Pick`<[`AllFieldDefinition`](README.md#allfielddefinition), ``"sortable"`` \| ``"caseSensitive"`` \| ``"normalized"`` \| ``"separator"``\>

A field representing an array of strings.

#### Defined in

[lib/schema/definitions.ts:109](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/schema/definitions.ts#L109)

___

### StringFieldDefinition

Ƭ **StringFieldDefinition**: { `type`: ``"string"``  } & [`CommonFieldDefinition`](README.md#commonfielddefinition) & `Pick`<[`AllFieldDefinition`](README.md#allfielddefinition), ``"sortable"`` \| ``"caseSensitive"`` \| ``"normalized"`` \| ``"separator"``\>

A field representing a whole string.

#### Defined in

[lib/schema/definitions.ts:104](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/schema/definitions.ts#L104)

___

### SubSearchFunction

Ƭ **SubSearchFunction**<`T`\>: (`search`: [`Search`](classes/Search.md)<`T`\>) => [`Search`](classes/Search.md)<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Entity`](README.md#entity) |

#### Type declaration

▸ (`search`): [`Search`](classes/Search.md)<`T`\>

A function that takes a [Search](classes/Search.md) and returns a [Search](classes/Search.md). Used in nested queries.

##### Parameters

| Name | Type |
| :------ | :------ |
| `search` | [`Search`](classes/Search.md)<`T`\> |

##### Returns

[`Search`](classes/Search.md)<`T`\>

#### Defined in

[lib/search/search.ts:31](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/search.ts#L31)

___

### TextFieldDefinition

Ƭ **TextFieldDefinition**: { `type`: ``"text"``  } & [`CommonFieldDefinition`](README.md#commonfielddefinition) & `Pick`<[`AllFieldDefinition`](README.md#allfielddefinition), ``"sortable"`` \| ``"normalized"`` \| ``"matcher"`` \| ``"stemming"`` \| ``"weight"``\>

A field representing searchable text.

#### Defined in

[lib/schema/definitions.ts:114](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/schema/definitions.ts#L114)

## Variables

### EntityId

• `Const` **EntityId**: typeof [`EntityId`](README.md#entityid)

The Symbol used to access the entity ID of an [Entity](README.md#entity).

#### Defined in

[lib/entity/entity.ts:2](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/entity/entity.ts#L2)

___

### EntityKeyName

• `Const` **EntityKeyName**: typeof [`EntityKeyName`](README.md#entitykeyname)

The Symbol used to access the keyname of an [Entity](README.md#entity).

#### Defined in

[lib/entity/entity.ts:5](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/entity/entity.ts#L5)
