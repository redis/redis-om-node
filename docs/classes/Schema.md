[redis-om](../README.md) / Schema

# Class: Schema<T\>

Defines a schema that determines how an [Entity](../README.md#entity) is mapped
to Redis data structures. Construct by passing in a schema name,
a [SchemaDefinition](../README.md#schemadefinition), and optionally [SchemaOptions](../README.md#schemaoptions):

```typescript
interface Foo extends Entity {
  aString: string,
  aNumber: number,
  aBoolean: boolean,
  someText: string,
  aPoint: Point,
  aDate: Date,
  someStrings: string[],
}

const schema = new Schema<Foo>('foo', {
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

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Entity`](../README.md#entity) = `Record`<`string`, `any`\> |

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

• **new Schema**<`T`\>(`schemaName`, `schemaDef`, `options?`)

Constructs a Schema.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Entity`](../README.md#entity) = `Record`<`string`, `any`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `schemaName` | `string` | The name of the schema. Prefixes the ID when creating Redis keys. |
| `schemaDef` | [`SchemaDefinition`](../README.md#schemadefinition)<`T`\> | Defines all of the fields for the Schema and how they are mapped to Redis. |
| `options?` | [`SchemaOptions`](../README.md#schemaoptions) | Additional options for this Schema. |

#### Defined in

[lib/schema/schema.ts:59](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/schema/schema.ts#L59)

## Accessors

### dataStructure

• `get` **dataStructure**(): [`DataStructure`](../README.md#datastructure)

The configured data structure, a string with the value of either `HASH` or `JSON`,
that this Schema uses to store [Entities](../README.md#entity) in Redis.

#### Returns

[`DataStructure`](../README.md#datastructure)

#### Defined in

[lib/schema/schema.ts:102](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/schema/schema.ts#L102)

___

### fields

• `get` **fields**(): [`Field`](Field.md)[]

The [Fields](Field.md) defined by this Schema.

#### Returns

[`Field`](Field.md)[]

#### Defined in

[lib/schema/schema.ts:78](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/schema/schema.ts#L78)

___

### indexHash

• `get` **indexHash**(): `string`

A hash for this Schema that is used to determine if the Schema has been
changed when calling [createIndex](Repository.md#createindex).

#### Returns

`string`

#### Defined in

[lib/schema/schema.ts:130](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/schema/schema.ts#L130)

___

### indexHashName

• `get` **indexHashName**(): `string`

The configured name for the RediSearch index hash for this Schema.

#### Returns

`string`

#### Defined in

[lib/schema/schema.ts:96](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/schema/schema.ts#L96)

___

### indexName

• `get` **indexName**(): `string`

The configured name for the RediSearch index for this Schema.

#### Returns

`string`

#### Defined in

[lib/schema/schema.ts:93](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/schema/schema.ts#L93)

___

### schemaName

• `get` **schemaName**(): `string`

The name of the schema. Prefixes the ID when creating Redis keys. Combined
with the results of idStrategy to generate a key. If name is `foo` and
idStrategy returns `12345` then the generated key would be `foo:12345`.

#### Returns

`string`

#### Defined in

[lib/schema/schema.ts:73](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/schema/schema.ts#L73)

___

### stopWords

• `get` **stopWords**(): `string`[]

The configured stop words. Ignored if [useStopWords](Schema.md#usestopwords) is anything other
than `CUSTOM`.

#### Returns

`string`[]

#### Defined in

[lib/schema/schema.ts:114](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/schema/schema.ts#L114)

___

### useStopWords

• `get` **useStopWords**(): [`StopWordOptions`](../README.md#stopwordoptions)

The configured usage of stop words, a string with the value of either `OFF`, `DEFAULT`,
or `CUSTOM`. See [SchemaOptions](../README.md#schemaoptions) for more details.

#### Returns

[`StopWordOptions`](../README.md#stopwordoptions)

#### Defined in

[lib/schema/schema.ts:108](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/schema/schema.ts#L108)

## Methods

### fieldByName

▸ **fieldByName**(`name`): ``null`` \| [`Field`](Field.md)

Gets a single [Field](Field.md) defined by this Schema.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `Exclude`<keyof `T`, keyof [`EntityInternal`](../README.md#entityinternal)\> | The name of the [Field](Field.md) in this Schema. |

#### Returns

``null`` \| [`Field`](Field.md)

The [Field](Field.md), or null of not found.

#### Defined in

[lib/schema/schema.ts:88](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/schema/schema.ts#L88)

___

### generateId

▸ **generateId**(): `Promise`<`string`\>

Generates a unique string using the configured [IdStrategy](../README.md#idstrategy).

#### Returns

`Promise`<`string`\>

The generated id.

#### Defined in

[lib/schema/schema.ts:121](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/schema/schema.ts#L121)
