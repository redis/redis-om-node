[redis-om](../README.md) / WhereField

# Class: WhereField<TEntity\>

## Type parameters

| Name |
| :------ |
| `TEntity` |

## Hierarchy

- [`Where`](Where.md)

  ↳ **`WhereField`**

  ↳↳ [`WhereArray`](WhereArray.md)

  ↳↳ [`WhereBoolean`](WhereBoolean.md)

  ↳↳ [`WhereNumber`](WhereNumber.md)

  ↳↳ [`WhereString`](WhereString.md)

  ↳↳ [`WhereText`](WhereText.md)

## Table of contents

### Constructors

- [constructor](WhereField.md#constructor)

### Properties

- [exact](WhereField.md#exact)
- [exactly](WhereField.md#exactly)
- [field](WhereField.md#field)
- [search](WhereField.md#search)

### Accessors

- [does](WhereField.md#does)
- [is](WhereField.md#is)
- [not](WhereField.md#not)

### Methods

- [between](WhereField.md#between)
- [buildQuery](WhereField.md#buildquery)
- [contain](WhereField.md#contain)
- [containAllOf](WhereField.md#containallof)
- [containOneOf](WhereField.md#containoneof)
- [contains](WhereField.md#contains)
- [containsAllOf](WhereField.md#containsallof)
- [containsOneOf](WhereField.md#containsoneof)
- [eq](WhereField.md#eq)
- [equal](WhereField.md#equal)
- [equalTo](WhereField.md#equalto)
- [equals](WhereField.md#equals)
- [false](WhereField.md#false)
- [greaterThan](WhereField.md#greaterthan)
- [greaterThanOrEqualTo](WhereField.md#greaterthanorequalto)
- [gt](WhereField.md#gt)
- [gte](WhereField.md#gte)
- [lessThan](WhereField.md#lessthan)
- [lessThanOrEqualTo](WhereField.md#lessthanorequalto)
- [lt](WhereField.md#lt)
- [lte](WhereField.md#lte)
- [match](WhereField.md#match)
- [matchExact](WhereField.md#matchexact)
- [matchExactly](WhereField.md#matchexactly)
- [matches](WhereField.md#matches)
- [matchesExactly](WhereField.md#matchesexactly)
- [negate](WhereField.md#negate)
- [toString](WhereField.md#tostring)
- [true](WhereField.md#true)

## Constructors

### constructor

• **new WhereField**<`TEntity`\>(`search`, `field`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TEntity` | extends [`Entity`](Entity.md)<`TEntity`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `search` | [`Search`](Search.md)<`TEntity`\> |
| `field` | `string` |

#### Inherited from

[Where](Where.md).[constructor](Where.md#constructor)

#### Defined in

[lib/search/where-field.ts:55](https://github.com/redis-developer/redis-om-node/blob/8f6d2ee/lib/search/where-field.ts#L55)

## Properties

### exact

• `Readonly` **exact**: [`WhereText`](WhereText.md)<`TEntity`\>

#### Defined in

[lib/search/where-field.ts:19](https://github.com/redis-developer/redis-om-node/blob/8f6d2ee/lib/search/where-field.ts#L19)

___

### exactly

• `Readonly` **exactly**: [`WhereText`](WhereText.md)<`TEntity`\>

#### Defined in

[lib/search/where-field.ts:20](https://github.com/redis-developer/redis-om-node/blob/8f6d2ee/lib/search/where-field.ts#L20)

___

### field

• `Protected` **field**: `String`

#### Defined in

[lib/search/where-field.ts:53](https://github.com/redis-developer/redis-om-node/blob/8f6d2ee/lib/search/where-field.ts#L53)

___

### search

• `Protected` **search**: [`Search`](Search.md)<`TEntity`\>

#### Defined in

[lib/search/where-field.ts:52](https://github.com/redis-developer/redis-om-node/blob/8f6d2ee/lib/search/where-field.ts#L52)

## Accessors

### does

• `get` **does**(): `this`

#### Returns

`this`

#### Defined in

[lib/search/where-field.ts:64](https://github.com/redis-developer/redis-om-node/blob/8f6d2ee/lib/search/where-field.ts#L64)

___

### is

• `get` **is**(): `this`

#### Returns

`this`

#### Defined in

[lib/search/where-field.ts:60](https://github.com/redis-developer/redis-om-node/blob/8f6d2ee/lib/search/where-field.ts#L60)

___

### not

• `get` **not**(): `this`

#### Returns

`this`

#### Defined in

[lib/search/where-field.ts:68](https://github.com/redis-developer/redis-om-node/blob/8f6d2ee/lib/search/where-field.ts#L68)

## Methods

### between

▸ **between**(`lower`, `upper`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `lower` | `number` |
| `upper` | `number` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Defined in

[lib/search/where-field.ts:37](https://github.com/redis-developer/redis-om-node/blob/8f6d2ee/lib/search/where-field.ts#L37)

___

### buildQuery

▸ `Protected` **buildQuery**(`valuePortion`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `valuePortion` | `string` |

#### Returns

`string`

#### Defined in

[lib/search/where-field.ts:79](https://github.com/redis-developer/redis-om-node/blob/8f6d2ee/lib/search/where-field.ts#L79)

___

### contain

▸ **contain**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Defined in

[lib/search/where-field.ts:39](https://github.com/redis-developer/redis-om-node/blob/8f6d2ee/lib/search/where-field.ts#L39)

___

### containAllOf

▸ **containAllOf**(...`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...value` | `string`[] |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Defined in

[lib/search/where-field.ts:42](https://github.com/redis-developer/redis-om-node/blob/8f6d2ee/lib/search/where-field.ts#L42)

___

### containOneOf

▸ **containOneOf**(...`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...value` | `string`[] |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Defined in

[lib/search/where-field.ts:45](https://github.com/redis-developer/redis-om-node/blob/8f6d2ee/lib/search/where-field.ts#L45)

___

### contains

▸ **contains**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Defined in

[lib/search/where-field.ts:40](https://github.com/redis-developer/redis-om-node/blob/8f6d2ee/lib/search/where-field.ts#L40)

___

### containsAllOf

▸ **containsAllOf**(...`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...value` | `string`[] |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Defined in

[lib/search/where-field.ts:43](https://github.com/redis-developer/redis-om-node/blob/8f6d2ee/lib/search/where-field.ts#L43)

___

### containsOneOf

▸ **containsOneOf**(...`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...value` | `string`[] |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Defined in

[lib/search/where-field.ts:46](https://github.com/redis-developer/redis-om-node/blob/8f6d2ee/lib/search/where-field.ts#L46)

___

### eq

▸ **eq**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` \| `number` \| `boolean` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Defined in

[lib/search/where-field.ts:8](https://github.com/redis-developer/redis-om-node/blob/8f6d2ee/lib/search/where-field.ts#L8)

___

### equal

▸ **equal**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` \| `number` \| `boolean` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Defined in

[lib/search/where-field.ts:9](https://github.com/redis-developer/redis-om-node/blob/8f6d2ee/lib/search/where-field.ts#L9)

___

### equalTo

▸ **equalTo**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` \| `number` \| `boolean` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Defined in

[lib/search/where-field.ts:11](https://github.com/redis-developer/redis-om-node/blob/8f6d2ee/lib/search/where-field.ts#L11)

___

### equals

▸ **equals**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` \| `number` \| `boolean` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Defined in

[lib/search/where-field.ts:10](https://github.com/redis-developer/redis-om-node/blob/8f6d2ee/lib/search/where-field.ts#L10)

___

### false

▸ **false**(): [`Search`](Search.md)<`TEntity`\>

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Defined in

[lib/search/where-field.ts:23](https://github.com/redis-developer/redis-om-node/blob/8f6d2ee/lib/search/where-field.ts#L23)

___

### greaterThan

▸ **greaterThan**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Defined in

[lib/search/where-field.ts:26](https://github.com/redis-developer/redis-om-node/blob/8f6d2ee/lib/search/where-field.ts#L26)

___

### greaterThanOrEqualTo

▸ **greaterThanOrEqualTo**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Defined in

[lib/search/where-field.ts:29](https://github.com/redis-developer/redis-om-node/blob/8f6d2ee/lib/search/where-field.ts#L29)

___

### gt

▸ **gt**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Defined in

[lib/search/where-field.ts:25](https://github.com/redis-developer/redis-om-node/blob/8f6d2ee/lib/search/where-field.ts#L25)

___

### gte

▸ **gte**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Defined in

[lib/search/where-field.ts:28](https://github.com/redis-developer/redis-om-node/blob/8f6d2ee/lib/search/where-field.ts#L28)

___

### lessThan

▸ **lessThan**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Defined in

[lib/search/where-field.ts:32](https://github.com/redis-developer/redis-om-node/blob/8f6d2ee/lib/search/where-field.ts#L32)

___

### lessThanOrEqualTo

▸ **lessThanOrEqualTo**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Defined in

[lib/search/where-field.ts:35](https://github.com/redis-developer/redis-om-node/blob/8f6d2ee/lib/search/where-field.ts#L35)

___

### lt

▸ **lt**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Defined in

[lib/search/where-field.ts:31](https://github.com/redis-developer/redis-om-node/blob/8f6d2ee/lib/search/where-field.ts#L31)

___

### lte

▸ **lte**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Defined in

[lib/search/where-field.ts:34](https://github.com/redis-developer/redis-om-node/blob/8f6d2ee/lib/search/where-field.ts#L34)

___

### match

▸ **match**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Defined in

[lib/search/where-field.ts:13](https://github.com/redis-developer/redis-om-node/blob/8f6d2ee/lib/search/where-field.ts#L13)

___

### matchExact

▸ **matchExact**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Defined in

[lib/search/where-field.ts:15](https://github.com/redis-developer/redis-om-node/blob/8f6d2ee/lib/search/where-field.ts#L15)

___

### matchExactly

▸ **matchExactly**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Defined in

[lib/search/where-field.ts:16](https://github.com/redis-developer/redis-om-node/blob/8f6d2ee/lib/search/where-field.ts#L16)

___

### matches

▸ **matches**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Defined in

[lib/search/where-field.ts:14](https://github.com/redis-developer/redis-om-node/blob/8f6d2ee/lib/search/where-field.ts#L14)

___

### matchesExactly

▸ **matchesExactly**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Defined in

[lib/search/where-field.ts:17](https://github.com/redis-developer/redis-om-node/blob/8f6d2ee/lib/search/where-field.ts#L17)

___

### negate

▸ `Protected` **negate**(): `void`

#### Returns

`void`

#### Defined in

[lib/search/where-field.ts:75](https://github.com/redis-developer/redis-om-node/blob/8f6d2ee/lib/search/where-field.ts#L75)

___

### toString

▸ `Abstract` **toString**(): `string`

Converts this [Where](Where.md) into a partion of a RediSearch query.

#### Returns

`string`

#### Inherited from

[Where](Where.md).[toString](Where.md#tostring)

#### Defined in

[lib/search/where-field.ts:73](https://github.com/redis-developer/redis-om-node/blob/8f6d2ee/lib/search/where-field.ts#L73)

___

### true

▸ **true**(): [`Search`](Search.md)<`TEntity`\>

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Defined in

[lib/search/where-field.ts:22](https://github.com/redis-developer/redis-om-node/blob/8f6d2ee/lib/search/where-field.ts#L22)
