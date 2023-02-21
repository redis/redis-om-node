[redis-om](../README.md) / Schema

# Class: Schema

Defines a schema that determines how an [Entity](../README.md#entity) is mapped to Redis
data structures. Construct by passing in a prefix for keys in Redis, a
[SchemaDefinition](../README.md#schemadefinition), and optionally [SchemaOptions](../README.md#schemaoptions):

```typescript
const schema = new Schema('Foo', {
  aString: { type: 'string' },
  aNumber: { type: 'number' },
  aBoolean: { type: 'boolean' },
  someText: { type: 'text' },
  aPoint: { type: 'point' },
  aDate: { type: 'date' },
  someStrings: { type: 'string[]' }
}, {
  dataStructure: 'HASH'
})
```

A Schema is primarily used by a [Repository](Repository.md) which requires a Schema in
its constructor.

## Table of contents

### Constructors

- [constructor](Schema.md#constructor)

### Accessors

- [dataStructure](Schema.md#datastructure)
- [fields](Schema.md#fields)
- [indexHash](Schema.md#indexhash)
- [indexHashName](Schema.md#indexhashname)
- [indexName](Schema.md#indexname)
- [prefix](Schema.md#prefix)
- [stopWords](Schema.md#stopwords)
- [useStopWords](Schema.md#usestopwords)

### Methods

- [fieldByName](Schema.md#fieldbyname)
- [generateId](Schema.md#generateid)

## Constructors

### constructor

• **new Schema**(`prefix`, `schemaDef`, `options?`)

Constructs a Schema.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prefix` | `string` | The string that comes before the ID when creating Redis keys. |
| `schemaDef` | [`SchemaDefinition`](../README.md#schemadefinition) | Defines all of the fields for the Schema and how they are mapped to Redis. |
| `options?` | [`SchemaOptions`](../README.md#schemaoptions) | Additional options for this Schema. |

#### Defined in

[lib/schema/schema.ts:47](https://github.com/redis/redis-om-node/blob/b3c437e/lib/schema/schema.ts#L47)

## Accessors

### dataStructure

• `get` **dataStructure**(): [`DataStructure`](../README.md#datastructure)

The configured data structure, a string with the value of either `HASH` or `JSON`,
that this Schema uses to store [Entities](../README.md#entity) in Redis.

#### Returns

[`DataStructure`](../README.md#datastructure)

#### Defined in

[lib/schema/schema.ts:90](https://github.com/redis/redis-om-node/blob/b3c437e/lib/schema/schema.ts#L90)

___

### fields

• `get` **fields**(): [`Field`](Field.md)[]

The [Fields](Field.md) defined by this Schema.

#### Returns

[`Field`](Field.md)[]

#### Defined in

[lib/schema/schema.ts:66](https://github.com/redis/redis-om-node/blob/b3c437e/lib/schema/schema.ts#L66)

___

### indexHash

• `get` **indexHash**(): `string`

A hash for this Schema that is used to determine if the Schema has been
changed when calling [createIndex](Repository.md#createindex).

#### Returns

`string`

#### Defined in

[lib/schema/schema.ts:118](https://github.com/redis/redis-om-node/blob/b3c437e/lib/schema/schema.ts#L118)

___

### indexHashName

• `get` **indexHashName**(): `string`

The configured name for the RediSearch index hash for this Schema.

#### Returns

`string`

#### Defined in

[lib/schema/schema.ts:84](https://github.com/redis/redis-om-node/blob/b3c437e/lib/schema/schema.ts#L84)

___

### indexName

• `get` **indexName**(): `string`

The configured name for the RediSearch index for this Schema.

#### Returns

`string`

#### Defined in

[lib/schema/schema.ts:81](https://github.com/redis/redis-om-node/blob/b3c437e/lib/schema/schema.ts#L81)

___

### prefix

• `get` **prefix**(): `string`

The string that comes before the ID when creating Redis keys. Combined
with the results of idStrategy to generate a key. If prefix is `Foo` and
idStrategy returns `12345` then the generated key would be `Foo:12345`.

#### Returns

`string`

#### Defined in

[lib/schema/schema.ts:61](https://github.com/redis/redis-om-node/blob/b3c437e/lib/schema/schema.ts#L61)

___

### stopWords

• `get` **stopWords**(): `string`[]

The configured stop words. Ignored if [useStopWords](Schema.md#usestopwords) is anything other
than `CUSTOM`.

#### Returns

`string`[]

#### Defined in

[lib/schema/schema.ts:102](https://github.com/redis/redis-om-node/blob/b3c437e/lib/schema/schema.ts#L102)

___

### useStopWords

• `get` **useStopWords**(): [`StopWordOptions`](../README.md#stopwordoptions)

The configured usage of stop words, a string with the value of either `OFF`, `DEFAULT`,
or `CUSTOM`. See [SchemaOptions](../README.md#schemaoptions) for more details.

#### Returns

[`StopWordOptions`](../README.md#stopwordoptions)

#### Defined in

[lib/schema/schema.ts:96](https://github.com/redis/redis-om-node/blob/b3c437e/lib/schema/schema.ts#L96)

## Methods

### fieldByName

▸ **fieldByName**(`name`): [`Field`](Field.md)

Gets a single [Field](Field.md) defined by this Schema.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The name of the [Field](Field.md) in this Schema. |

#### Returns

[`Field`](Field.md)

The [Field](Field.md), or null of not found.

#### Defined in

[lib/schema/schema.ts:76](https://github.com/redis/redis-om-node/blob/b3c437e/lib/schema/schema.ts#L76)

___

### generateId

▸ **generateId**(): `Promise`<`string`\>

Generates a unique string using the configured [IdStrategy](../README.md#idstrategy).

#### Returns

`Promise`<`string`\>

The generated id.

#### Defined in

[lib/schema/schema.ts:109](https://github.com/redis/redis-om-node/blob/b3c437e/lib/schema/schema.ts#L109)
