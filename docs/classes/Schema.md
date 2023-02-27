[redis-om](../README.md) / Schema

# Class: Schema

Defines a schema that determines how an [Entity](../README.md#entity) is mapped
to Redis data structures. Construct by passing in a schema name,
a [SchemaDefinition](../README.md#schemadefinition), and optionally [SchemaOptions](../README.md#schemaoptions):

```typescript
const schema = new Schema('foo', {
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
- [schemaName](Schema.md#schemaname)
- [stopWords](Schema.md#stopwords)
- [useStopWords](Schema.md#usestopwords)

### Methods

- [fieldByName](Schema.md#fieldbyname)
- [generateId](Schema.md#generateid)

## Constructors

### constructor

• **new Schema**(`schemaName`, `schemaDef`, `options?`)

Constructs a Schema.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `schemaName` | `string` | The name of the schema. Prefixes the ID when creating Redis keys. |
| `schemaDef` | [`SchemaDefinition`](../README.md#schemadefinition) | Defines all of the fields for the Schema and how they are mapped to Redis. |
| `options?` | [`SchemaOptions`](../README.md#schemaoptions) | Additional options for this Schema. |

#### Defined in

[lib/schema/schema.ts:48](https://github.com/redis/redis-om-node/blob/e552415/lib/schema/schema.ts#L48)

## Accessors

### dataStructure

• `get` **dataStructure**(): [`DataStructure`](../README.md#datastructure)

The configured data structure, a string with the value of either `HASH` or `JSON`,
that this Schema uses to store [Entities](../README.md#entity) in Redis.

#### Returns

[`DataStructure`](../README.md#datastructure)

#### Defined in

[lib/schema/schema.ts:91](https://github.com/redis/redis-om-node/blob/e552415/lib/schema/schema.ts#L91)

___

### fields

• `get` **fields**(): [`Field`](Field.md)[]

The [Fields](Field.md) defined by this Schema.

#### Returns

[`Field`](Field.md)[]

#### Defined in

[lib/schema/schema.ts:67](https://github.com/redis/redis-om-node/blob/e552415/lib/schema/schema.ts#L67)

___

### indexHash

• `get` **indexHash**(): `string`

A hash for this Schema that is used to determine if the Schema has been
changed when calling [createIndex](Repository.md#createindex).

#### Returns

`string`

#### Defined in

[lib/schema/schema.ts:119](https://github.com/redis/redis-om-node/blob/e552415/lib/schema/schema.ts#L119)

___

### indexHashName

• `get` **indexHashName**(): `string`

The configured name for the RediSearch index hash for this Schema.

#### Returns

`string`

#### Defined in

[lib/schema/schema.ts:85](https://github.com/redis/redis-om-node/blob/e552415/lib/schema/schema.ts#L85)

___

### indexName

• `get` **indexName**(): `string`

The configured name for the RediSearch index for this Schema.

#### Returns

`string`

#### Defined in

[lib/schema/schema.ts:82](https://github.com/redis/redis-om-node/blob/e552415/lib/schema/schema.ts#L82)

___

### schemaName

• `get` **schemaName**(): `string`

The name of the schema. Prefixes the ID when creating Redis keys. Combined
with the results of idStrategy to generate a key. If name is `foo` and
idStrategy returns `12345` then the generated key would be `foo:12345`.

#### Returns

`string`

#### Defined in

[lib/schema/schema.ts:62](https://github.com/redis/redis-om-node/blob/e552415/lib/schema/schema.ts#L62)

___

### stopWords

• `get` **stopWords**(): `string`[]

The configured stop words. Ignored if [useStopWords](Schema.md#usestopwords) is anything other
than `CUSTOM`.

#### Returns

`string`[]

#### Defined in

[lib/schema/schema.ts:103](https://github.com/redis/redis-om-node/blob/e552415/lib/schema/schema.ts#L103)

___

### useStopWords

• `get` **useStopWords**(): [`StopWordOptions`](../README.md#stopwordoptions)

The configured usage of stop words, a string with the value of either `OFF`, `DEFAULT`,
or `CUSTOM`. See [SchemaOptions](../README.md#schemaoptions) for more details.

#### Returns

[`StopWordOptions`](../README.md#stopwordoptions)

#### Defined in

[lib/schema/schema.ts:97](https://github.com/redis/redis-om-node/blob/e552415/lib/schema/schema.ts#L97)

## Methods

### fieldByName

▸ **fieldByName**(`name`): ``null`` \| [`Field`](Field.md)

Gets a single [Field](Field.md) defined by this Schema.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The name of the [Field](Field.md) in this Schema. |

#### Returns

``null`` \| [`Field`](Field.md)

The [Field](Field.md), or null of not found.

#### Defined in

[lib/schema/schema.ts:77](https://github.com/redis/redis-om-node/blob/e552415/lib/schema/schema.ts#L77)

___

### generateId

▸ **generateId**(): `Promise`<`string`\>

Generates a unique string using the configured [IdStrategy](../README.md#idstrategy).

#### Returns

`Promise`<`string`\>

The generated id.

#### Defined in

[lib/schema/schema.ts:110](https://github.com/redis/redis-om-node/blob/e552415/lib/schema/schema.ts#L110)
