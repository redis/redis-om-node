[redis-om](../README.md) / Schema

# Class: Schema<TEntity\>

Defines a schema that determines how an [Entity](Entity.md) is mapped to Redis
data structures. Construct by passing in an [EntityConstructor](../README.md#entityconstructor),
a [SchemaDefinition](../README.md#schemadefinition), and optionally [SchemaOptions](../README.md#schemaoptions):

```typescript
let schema = new Schema(Foo, {
  aString: { type: 'string' },
  aNumber: { type: 'number' },
  aBoolean: { type: 'boolean' },
  someText: { type: 'text' },
  aPoint: { type: 'point' },
  aDate: { type: 'date' },
  someStrings: { type: 'string[]' }
}, {
  dataStructure: 'HASH'
});
```

A Schema is primarily used by a [Repository](Repository.md) which requires a Schema in
its constructor.

## Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `TEntity` | extends [`Entity`](Entity.md) | The [Entity](Entity.md) this Schema defines. |

## Table of contents

### Constructors

- [constructor](Schema.md#constructor)

### Accessors

- [dataStructure](Schema.md#datastructure)
- [indexHash](Schema.md#indexhash)
- [indexHashName](Schema.md#indexhashname)
- [indexName](Schema.md#indexname)
- [prefix](Schema.md#prefix)
- [stopWords](Schema.md#stopwords)
- [useStopWords](Schema.md#usestopwords)

### Methods

- [generateId](Schema.md#generateid)

## Constructors

### constructor

• **new Schema**<`TEntity`\>(`ctor`, `schemaDef`, `options?`)

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `TEntity` | extends [`Entity`](Entity.md)<`TEntity`\> | The [Entity](Entity.md) this Schema defines. |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ctor` | [`EntityConstructor`](../README.md#entityconstructor)<`TEntity`\> | A constructor that creates an [Entity](Entity.md) of type TEntity. |
| `schemaDef` | [`SchemaDefinition`](../README.md#schemadefinition) | Defines all of the fields for the Schema and how they are mapped to Redis. |
| `options?` | [`SchemaOptions`](../README.md#schemaoptions) | Additional options for this Schema. |

#### Defined in

[lib/schema/schema.ts:58](https://github.com/redis/redis-om-node/blob/0843d26/lib/schema/schema.ts#L58)

## Accessors

### dataStructure

• `get` **dataStructure**(): [`SearchDataStructure`](../README.md#searchdatastructure)

The configured data structure, a string with the value of either `HASH` or `JSON`,
that this Schema uses to store [Entities](Entity.md) in Redis.

#### Returns

[`SearchDataStructure`](../README.md#searchdatastructure)

#### Defined in

[lib/schema/schema.ts:80](https://github.com/redis/redis-om-node/blob/0843d26/lib/schema/schema.ts#L80)

___

### indexHash

• `get` **indexHash**(): `string`

The hash value of this index. Stored in Redis under [Schema.indexHashName](Schema.md#indexhashname).

#### Returns

`string`

#### Defined in

[lib/schema/schema.ts:96](https://github.com/redis/redis-om-node/blob/0843d26/lib/schema/schema.ts#L96)

___

### indexHashName

• `get` **indexHashName**(): `string`

The configured name for the RediSearch index hash for this Schema.

#### Returns

`string`

#### Defined in

[lib/schema/schema.ts:74](https://github.com/redis/redis-om-node/blob/0843d26/lib/schema/schema.ts#L74)

___

### indexName

• `get` **indexName**(): `string`

The configured name for the RediSearch index for this Schema.

#### Returns

`string`

#### Defined in

[lib/schema/schema.ts:71](https://github.com/redis/redis-om-node/blob/0843d26/lib/schema/schema.ts#L71)

___

### prefix

• `get` **prefix**(): `string`

The configured keyspace prefix in Redis for this Schema.

#### Returns

`string`

#### Defined in

[lib/schema/schema.ts:68](https://github.com/redis/redis-om-node/blob/0843d26/lib/schema/schema.ts#L68)

___

### stopWords

• `get` **stopWords**(): `string`[]

The configured stop words. Ignored if [Schema.useStopWords](Schema.md#usestopwords) is anything other
than `CUSTOM`.

#### Returns

`string`[]

#### Defined in

[lib/schema/schema.ts:93](https://github.com/redis/redis-om-node/blob/0843d26/lib/schema/schema.ts#L93)

___

### useStopWords

• `get` **useStopWords**(): [`StopWordOptions`](../README.md#stopwordoptions)

The configured usage of stop words, a string with the value of either `OFF`, `DEFAULT`,
or `CUSTOM`. See {@link SchemaOptions.useStopWords} and {@link SchemaOptions.stopWords}
for more details.

#### Returns

[`StopWordOptions`](../README.md#stopwordoptions)

#### Defined in

[lib/schema/schema.ts:87](https://github.com/redis/redis-om-node/blob/0843d26/lib/schema/schema.ts#L87)

## Methods

### generateId

▸ **generateId**(): `string`

Generates a unique string using the configured [IdStrategy](../README.md#idstrategy).

#### Returns

`string`

#### Defined in

[lib/schema/schema.ts:118](https://github.com/redis/redis-om-node/blob/0843d26/lib/schema/schema.ts#L118)
