[redis-om](../README.md) / Schema

# Class: Schema<TEntity\>

Defines a schema that determines how an [Entity](Entity.md) is mapped to Redis
data structures. Construct by passing in an [EntityConstructor](../README.md#entityconstructor),
a [SchemaDefinition](../README.md#schemadefinition), and optionally [SchemaOptions](../README.md#schemaoptions):

```typescript
const schema = new Schema(Foo, {
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
- [indexedDefault](Schema.md#indexeddefault)
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

[lib/schema/schema.ts:57](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/schema/schema.ts#L57)

## Accessors

### dataStructure

• `get` **dataStructure**(): [`DataStructure`](../README.md#datastructure)

The configured data structure, a string with the value of either `HASH` or `JSON`,
that this Schema uses to store [Entities](Entity.md) in Redis.

#### Returns

[`DataStructure`](../README.md#datastructure)

#### Defined in

[lib/schema/schema.ts:79](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/schema/schema.ts#L79)

___

### indexHash

• `get` **indexHash**(): `string`

The hash value of this index. Stored in Redis under [Schema.indexHashName](Schema.md#indexhashname).

#### Returns

`string`

#### Defined in

[lib/schema/schema.ts:100](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/schema/schema.ts#L100)

___

### indexHashName

• `get` **indexHashName**(): `string`

The configured name for the RediSearch index hash for this Schema.

#### Returns

`string`

#### Defined in

[lib/schema/schema.ts:73](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/schema/schema.ts#L73)

___

### indexName

• `get` **indexName**(): `string`

The configured name for the RediSearch index for this Schema.

#### Returns

`string`

#### Defined in

[lib/schema/schema.ts:70](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/schema/schema.ts#L70)

___

### indexedDefault

• `get` **indexedDefault**(): `boolean`

The configured indexed default setting for fields

#### Returns

`boolean`

#### Defined in

[lib/schema/schema.ts:97](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/schema/schema.ts#L97)

___

### prefix

• `get` **prefix**(): `string`

The configured keyspace prefix in Redis for this Schema.

#### Returns

`string`

#### Defined in

[lib/schema/schema.ts:67](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/schema/schema.ts#L67)

___

### stopWords

• `get` **stopWords**(): `string`[]

The configured stop words. Ignored if [Schema.useStopWords](Schema.md#usestopwords) is anything other
than `CUSTOM`.

#### Returns

`string`[]

#### Defined in

[lib/schema/schema.ts:92](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/schema/schema.ts#L92)

___

### useStopWords

• `get` **useStopWords**(): [`StopWordOptions`](../README.md#stopwordoptions)

The configured usage of stop words, a string with the value of either `OFF`, `DEFAULT`,
or `CUSTOM`. See {@link SchemaOptions.useStopWords} and {@link SchemaOptions.stopWords}
for more details.

#### Returns

[`StopWordOptions`](../README.md#stopwordoptions)

#### Defined in

[lib/schema/schema.ts:86](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/schema/schema.ts#L86)

## Methods

### generateId

▸ **generateId**(): `string`

Generates a unique string using the configured [IdStrategy](../README.md#idstrategy).

#### Returns

`string`

#### Defined in

[lib/schema/schema.ts:126](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/schema/schema.ts#L126)
