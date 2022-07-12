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

- [BaseFieldDefinition](interfaces/BaseFieldDefinition.md)
- [BooleanFieldDefinition](interfaces/BooleanFieldDefinition.md)
- [CaseSensitiveFieldDefinition](interfaces/CaseSensitiveFieldDefinition.md)
- [DateFieldDefinition](interfaces/DateFieldDefinition.md)
- [NormalizedFieldDefinition](interfaces/NormalizedFieldDefinition.md)
- [NumberFieldDefinition](interfaces/NumberFieldDefinition.md)
- [PhoneticFieldDefinition](interfaces/PhoneticFieldDefinition.md)
- [PointFieldDefinition](interfaces/PointFieldDefinition.md)
- [SeparableFieldDefinition](interfaces/SeparableFieldDefinition.md)
- [SortableFieldDefinition](interfaces/SortableFieldDefinition.md)
- [StemmingFieldDefinition](interfaces/StemmingFieldDefinition.md)
- [StringArrayFieldDefinition](interfaces/StringArrayFieldDefinition.md)
- [StringFieldDefinition](interfaces/StringFieldDefinition.md)
- [TextFieldDefinition](interfaces/TextFieldDefinition.md)
- [WeightFieldDefinition](interfaces/WeightFieldDefinition.md)

### Type Aliases

- [CircleFunction](README.md#circlefunction)
- [DataStructure](README.md#datastructure)
- [EntityConstructor](README.md#entityconstructor)
- [EntityData](README.md#entitydata)
- [EntityValue](README.md#entityvalue)
- [FieldDefinition](README.md#fielddefinition)
- [IdStrategy](README.md#idstrategy)
- [Point](README.md#point)
- [SchemaDefinition](README.md#schemadefinition)
- [SchemaFieldType](README.md#schemafieldtype)
- [SchemaOptions](README.md#schemaoptions)
- [SearchDataStructure](README.md#searchdatastructure)
- [StopWordOptions](README.md#stopwordoptions)
- [SubSearchFunction](README.md#subsearchfunction)

## Type Aliases

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

[lib/search/where-point.ts:9](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/where-point.ts#L9)

___

### DataStructure

Ƭ **DataStructure**: ``"HASH"`` \| ``"JSON"``

The type of data structure in Redis to map objects to.

#### Defined in

[lib/schema/options/data-structure.ts:2](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/schema/options/data-structure.ts#L2)

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

[lib/entity/entity-constructor.ts:8](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/entity/entity-constructor.ts#L8)

___

### EntityData

Ƭ **EntityData**: `Record`<`string`, [`EntityValue`](README.md#entityvalue)\>

A JavaScript object containing the underlying data of an [Entity](classes/Entity.md).

#### Defined in

[lib/entity/entity-data.ts:6](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/entity/entity-data.ts#L6)

___

### EntityValue

Ƭ **EntityValue**: `string` \| `number` \| `boolean` \| [`Point`](README.md#point) \| `Date` \| `any`[] \| ``null``

Valid types for properties on an [Entity](classes/Entity.md).

#### Defined in

[lib/entity/entity-value.ts:6](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/entity/entity-value.ts#L6)

___

### FieldDefinition

Ƭ **FieldDefinition**: [`StringFieldDefinition`](interfaces/StringFieldDefinition.md) \| [`TextFieldDefinition`](interfaces/TextFieldDefinition.md) \| [`NumberFieldDefinition`](interfaces/NumberFieldDefinition.md) \| [`BooleanFieldDefinition`](interfaces/BooleanFieldDefinition.md) \| [`PointFieldDefinition`](interfaces/PointFieldDefinition.md) \| [`DateFieldDefinition`](interfaces/DateFieldDefinition.md) \| [`StringArrayFieldDefinition`](interfaces/StringArrayFieldDefinition.md)

Contains instructions telling how to map a property on an [Entity](classes/Entity.md) to Redis.

#### Defined in

[lib/schema/definition/field-definition.ts:10](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/schema/definition/field-definition.ts#L10)

___

### IdStrategy

Ƭ **IdStrategy**: () => `string`

#### Type declaration

▸ (): `string`

A function that generates random [Entity IDs](classes/Entity.md#entityid).

##### Returns

`string`

#### Defined in

[lib/schema/options/id-strategy.ts:2](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/schema/options/id-strategy.ts#L2)

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

[lib/entity/point.ts:2](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/entity/point.ts#L2)

___

### SchemaDefinition

Ƭ **SchemaDefinition**: `Record`<`string`, [`FieldDefinition`](README.md#fielddefinition)\>

Group of [FieldDefinition](README.md#fielddefinition)s that define the schema for an [Entity](classes/Entity.md).

#### Defined in

[lib/schema/definition/schema-definition.ts:6](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/schema/definition/schema-definition.ts#L6)

___

### SchemaFieldType

Ƭ **SchemaFieldType**: ``"string"`` \| ``"number"`` \| ``"boolean"`` \| ``"text"`` \| ``"date"`` \| ``"point"`` \| ``"string[]"``

Valid types a [FieldDefinition](README.md#fielddefinition).

#### Defined in

[lib/schema/definition/schema-field-type.ts:4](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/schema/definition/schema-field-type.ts#L4)

___

### SchemaOptions

Ƭ **SchemaOptions**: `Object`

Configuration options for a [Schema](classes/Schema.md).

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `dataStructure?` | [`DataStructure`](README.md#datastructure) | The data structure used to store the [Entity](classes/Entity.md) in Redis. Can be set to either `JSON` or `HASH`. Defaults to JSON. |
| `idStrategy?` | [`IdStrategy`](README.md#idstrategy) | A function that generates a random [Entity ID](classes/Entity.md#entityid). Defaults to a function that generates [ULIDs](https://github.com/ulid/spec). Combined with prefix to generate a Redis key. If prefix is `Foo` and idStratgey returns `12345` then the generated key would be `Foo:12345`. |
| `indexHashName?` | `string` | The name used by Redis OM to store the hash of the index for this [Schema](classes/Schema.md). Defaults to prefix followed by `:index:hash`. So, for a prefix of `Foo`, it would use `Foo:index:hash`. |
| `indexName?` | `string` | The name used by RediSearch to store the index for this [Schema](classes/Schema.md). Defaults to prefix followed by `:index`. So, for a prefix of `Foo`, it would use `Foo:index`. |
| `indexedDefault?` | `boolean` | Whether fields are indexed by default |
| `prefix?` | `string` | The string that comes before the ID when creating Redis keys for [Entities](classes/Entity.md). Defaults to the class name of the [Entity](classes/Entity.md). Combined with the results of idStrategy to generate a key. If prefix is `Foo` and idStrategy returns `12345` then the generated key would be `Foo:12345`. |
| `stopWords?` | `string`[] | Stop words to be used by this schema. If `useStopWords` is anything other than `CUSTOM`, this option is ignored. |
| `useStopWords?` | [`StopWordOptions`](README.md#stopwordoptions) | Configures the usage of stop words. Valid values are `OFF`, `DEFAULT`, and `CUSTOM`. Setting this to `OFF` disables all stop words. Setting this to `DEFAULT` uses the stop words intrinsic to RediSearch. Setting this to `CUSTOM` tells RediSearch to use the stop words in `stopWords`. |

#### Defined in

[lib/schema/options/schema-options.ts:9](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/schema/options/schema-options.ts#L9)

___

### SearchDataStructure

Ƭ **SearchDataStructure**: ``"HASH"`` \| ``"JSON"``

The type of data structure in Redis to map objects to.

#### Defined in

[lib/client.ts:23](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/client.ts#L23)

___

### StopWordOptions

Ƭ **StopWordOptions**: ``"OFF"`` \| ``"DEFAULT"`` \| ``"CUSTOM"``

Valid values for how to use stop words for a given [Schema](classes/Schema.md).

#### Defined in

[lib/schema/options/stop-word-options.ts:2](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/schema/options/stop-word-options.ts#L2)

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

[lib/search/search.ts:26](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/search.ts#L26)
