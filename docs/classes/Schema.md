[redis-om](../README.md) / Schema

# Class: Schema<TEntity\>

Defines a schema that determines how an [Entity](Entity.md) is mapped to Redis
data structures. Construct by passing in an [EntityConstructor](../README.md#entityconstructor),
a [SchemaDefinition](../README.md#schemadefinition), and [SchemaOptions](../README.md#schemaoptions):

```typescript
let schema = new Schema(Foo, {
  aString: { type: 'string' },
  aNumber: { type: 'number' },
  aBoolean: { type: 'boolean' },
  anArray: { type: 'array' }
}, {
  dataStructure: 'JSON
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
- [indexName](Schema.md#indexname)
- [prefix](Schema.md#prefix)

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

[lib/schema/schema.ts:53](https://github.com/redis/redis-om-node/blob/20e6b1d/lib/schema/schema.ts#L53)

## Accessors

### dataStructure

• `get` **dataStructure**(): [`SearchDataStructure`](../README.md#searchdatastructure)

The configured data structure, a string with the value of either `HASH` or `JSON`,
that this Schema uses to store [Entities](Entity.md) in Redis.

#### Returns

[`SearchDataStructure`](../README.md#searchdatastructure)

#### Defined in

[lib/schema/schema.ts:72](https://github.com/redis/redis-om-node/blob/20e6b1d/lib/schema/schema.ts#L72)

___

### indexName

• `get` **indexName**(): `string`

The configured name for the RediSearch index for this Schema.

#### Returns

`string`

#### Defined in

[lib/schema/schema.ts:66](https://github.com/redis/redis-om-node/blob/20e6b1d/lib/schema/schema.ts#L66)

___

### prefix

• `get` **prefix**(): `string`

The configured keyspace prefix in Redis for this Schema.

#### Returns

`string`

#### Defined in

[lib/schema/schema.ts:63](https://github.com/redis/redis-om-node/blob/20e6b1d/lib/schema/schema.ts#L63)

## Methods

### generateId

▸ **generateId**(): `string`

Generates a unique string using the configured [IdStrategy](../README.md#idstrategy).

#### Returns

`string`

#### Defined in

[lib/schema/schema.ts:81](https://github.com/redis/redis-om-node/blob/20e6b1d/lib/schema/schema.ts#L81)
