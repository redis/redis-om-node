[redis-om](../README.md) / WhereArray

# Class: WhereArray<TEntity\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `TEntity` | extends [`Entity`](Entity.md) |

## Hierarchy

- [`WhereField`](WhereField.md)<`TEntity`\>

  ↳ **`WhereArray`**

## Table of contents

### Constructors

- [constructor](WhereArray.md#constructor)

### Properties

- [exact](WhereArray.md#exact)
- [exactly](WhereArray.md#exactly)
- [field](WhereArray.md#field)
- [search](WhereArray.md#search)

### Accessors

- [does](WhereArray.md#does)
- [is](WhereArray.md#is)
- [not](WhereArray.md#not)

### Methods

- [between](WhereArray.md#between)
- [buildQuery](WhereArray.md#buildquery)
- [contain](WhereArray.md#contain)
- [containAllOf](WhereArray.md#containallof)
- [containOneOf](WhereArray.md#containoneof)
- [contains](WhereArray.md#contains)
- [containsAllOf](WhereArray.md#containsallof)
- [containsOneOf](WhereArray.md#containsoneof)
- [eq](WhereArray.md#eq)
- [equal](WhereArray.md#equal)
- [equalTo](WhereArray.md#equalto)
- [equals](WhereArray.md#equals)
- [false](WhereArray.md#false)
- [greaterThan](WhereArray.md#greaterthan)
- [greaterThanOrEqualTo](WhereArray.md#greaterthanorequalto)
- [gt](WhereArray.md#gt)
- [gte](WhereArray.md#gte)
- [lessThan](WhereArray.md#lessthan)
- [lessThanOrEqualTo](WhereArray.md#lessthanorequalto)
- [lt](WhereArray.md#lt)
- [lte](WhereArray.md#lte)
- [match](WhereArray.md#match)
- [matchExact](WhereArray.md#matchexact)
- [matchExactly](WhereArray.md#matchexactly)
- [matches](WhereArray.md#matches)
- [matchesExactly](WhereArray.md#matchesexactly)
- [negate](WhereArray.md#negate)
- [toString](WhereArray.md#tostring)
- [true](WhereArray.md#true)

## Constructors

### constructor

• **new WhereArray**<`TEntity`\>(`search`, `field`)

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

[WhereField](WhereField.md).[constructor](WhereField.md#constructor)

#### Defined in

[lib/search/where-field.ts:55](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-field.ts#L55)

## Properties

### exact

• `Readonly` **exact**: [`WhereText`](WhereText.md)<`TEntity`\>

#### Inherited from

[WhereField](WhereField.md).[exact](WhereField.md#exact)

#### Defined in

[lib/search/where-field.ts:19](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-field.ts#L19)

___

### exactly

• `Readonly` **exactly**: [`WhereText`](WhereText.md)<`TEntity`\>

#### Inherited from

[WhereField](WhereField.md).[exactly](WhereField.md#exactly)

#### Defined in

[lib/search/where-field.ts:20](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-field.ts#L20)

___

### field

• `Protected` **field**: `String`

#### Inherited from

[WhereField](WhereField.md).[field](WhereField.md#field)

#### Defined in

[lib/search/where-field.ts:53](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-field.ts#L53)

___

### search

• `Protected` **search**: [`Search`](Search.md)<`TEntity`\>

#### Inherited from

[WhereField](WhereField.md).[search](WhereField.md#search)

#### Defined in

[lib/search/where-field.ts:52](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-field.ts#L52)

## Accessors

### does

• `get` **does**(): `this`

#### Returns

`this`

#### Inherited from

WhereField.does

#### Defined in

[lib/search/where-field.ts:64](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-field.ts#L64)

___

### is

• `get` **is**(): `this`

#### Returns

`this`

#### Inherited from

WhereField.is

#### Defined in

[lib/search/where-field.ts:60](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-field.ts#L60)

___

### not

• `get` **not**(): `this`

#### Returns

`this`

#### Inherited from

WhereField.not

#### Defined in

[lib/search/where-field.ts:68](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-field.ts#L68)

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

#### Inherited from

[WhereField](WhereField.md).[between](WhereField.md#between)

#### Defined in

[lib/search/where-field.ts:37](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-field.ts#L37)

___

### buildQuery

▸ `Protected` **buildQuery**(`valuePortion`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `valuePortion` | `string` |

#### Returns

`string`

#### Inherited from

[WhereField](WhereField.md).[buildQuery](WhereField.md#buildquery)

#### Defined in

[lib/search/where-field.ts:79](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-field.ts#L79)

___

### contain

▸ **contain**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Overrides

[WhereField](WhereField.md).[contain](WhereField.md#contain)

#### Defined in

[lib/search/where-array.ts:8](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-array.ts#L8)

___

### containAllOf

▸ **containAllOf**(...`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...value` | `string`[] |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Inherited from

[WhereField](WhereField.md).[containAllOf](WhereField.md#containallof)

#### Defined in

[lib/search/where-field.ts:42](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-field.ts#L42)

___

### containOneOf

▸ **containOneOf**(...`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...value` | `string`[] |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Overrides

[WhereField](WhereField.md).[containOneOf](WhereField.md#containoneof)

#### Defined in

[lib/search/where-array.ts:20](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-array.ts#L20)

___

### contains

▸ **contains**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Overrides

[WhereField](WhereField.md).[contains](WhereField.md#contains)

#### Defined in

[lib/search/where-array.ts:13](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-array.ts#L13)

___

### containsAllOf

▸ **containsAllOf**(...`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...value` | `string`[] |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Inherited from

[WhereField](WhereField.md).[containsAllOf](WhereField.md#containsallof)

#### Defined in

[lib/search/where-field.ts:43](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-field.ts#L43)

___

### containsOneOf

▸ **containsOneOf**(...`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...value` | `string`[] |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Overrides

[WhereField](WhereField.md).[containsOneOf](WhereField.md#containsoneof)

#### Defined in

[lib/search/where-array.ts:15](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-array.ts#L15)

___

### eq

▸ **eq**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` \| `number` \| `boolean` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Inherited from

[WhereField](WhereField.md).[eq](WhereField.md#eq)

#### Defined in

[lib/search/where-field.ts:8](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-field.ts#L8)

___

### equal

▸ **equal**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` \| `number` \| `boolean` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Inherited from

[WhereField](WhereField.md).[equal](WhereField.md#equal)

#### Defined in

[lib/search/where-field.ts:9](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-field.ts#L9)

___

### equalTo

▸ **equalTo**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` \| `number` \| `boolean` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Inherited from

[WhereField](WhereField.md).[equalTo](WhereField.md#equalto)

#### Defined in

[lib/search/where-field.ts:11](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-field.ts#L11)

___

### equals

▸ **equals**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` \| `number` \| `boolean` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Inherited from

[WhereField](WhereField.md).[equals](WhereField.md#equals)

#### Defined in

[lib/search/where-field.ts:10](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-field.ts#L10)

___

### false

▸ **false**(): [`Search`](Search.md)<`TEntity`\>

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Inherited from

[WhereField](WhereField.md).[false](WhereField.md#false)

#### Defined in

[lib/search/where-field.ts:23](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-field.ts#L23)

___

### greaterThan

▸ **greaterThan**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Inherited from

[WhereField](WhereField.md).[greaterThan](WhereField.md#greaterthan)

#### Defined in

[lib/search/where-field.ts:26](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-field.ts#L26)

___

### greaterThanOrEqualTo

▸ **greaterThanOrEqualTo**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Inherited from

[WhereField](WhereField.md).[greaterThanOrEqualTo](WhereField.md#greaterthanorequalto)

#### Defined in

[lib/search/where-field.ts:29](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-field.ts#L29)

___

### gt

▸ **gt**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Inherited from

[WhereField](WhereField.md).[gt](WhereField.md#gt)

#### Defined in

[lib/search/where-field.ts:25](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-field.ts#L25)

___

### gte

▸ **gte**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Inherited from

[WhereField](WhereField.md).[gte](WhereField.md#gte)

#### Defined in

[lib/search/where-field.ts:28](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-field.ts#L28)

___

### lessThan

▸ **lessThan**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Inherited from

[WhereField](WhereField.md).[lessThan](WhereField.md#lessthan)

#### Defined in

[lib/search/where-field.ts:32](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-field.ts#L32)

___

### lessThanOrEqualTo

▸ **lessThanOrEqualTo**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Inherited from

[WhereField](WhereField.md).[lessThanOrEqualTo](WhereField.md#lessthanorequalto)

#### Defined in

[lib/search/where-field.ts:35](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-field.ts#L35)

___

### lt

▸ **lt**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Inherited from

[WhereField](WhereField.md).[lt](WhereField.md#lt)

#### Defined in

[lib/search/where-field.ts:31](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-field.ts#L31)

___

### lte

▸ **lte**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Inherited from

[WhereField](WhereField.md).[lte](WhereField.md#lte)

#### Defined in

[lib/search/where-field.ts:34](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-field.ts#L34)

___

### match

▸ **match**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Inherited from

[WhereField](WhereField.md).[match](WhereField.md#match)

#### Defined in

[lib/search/where-field.ts:13](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-field.ts#L13)

___

### matchExact

▸ **matchExact**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Inherited from

[WhereField](WhereField.md).[matchExact](WhereField.md#matchexact)

#### Defined in

[lib/search/where-field.ts:15](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-field.ts#L15)

___

### matchExactly

▸ **matchExactly**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Inherited from

[WhereField](WhereField.md).[matchExactly](WhereField.md#matchexactly)

#### Defined in

[lib/search/where-field.ts:16](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-field.ts#L16)

___

### matches

▸ **matches**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Inherited from

[WhereField](WhereField.md).[matches](WhereField.md#matches)

#### Defined in

[lib/search/where-field.ts:14](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-field.ts#L14)

___

### matchesExactly

▸ **matchesExactly**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Inherited from

[WhereField](WhereField.md).[matchesExactly](WhereField.md#matchesexactly)

#### Defined in

[lib/search/where-field.ts:17](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-field.ts#L17)

___

### negate

▸ `Protected` **negate**(): `void`

#### Returns

`void`

#### Inherited from

[WhereField](WhereField.md).[negate](WhereField.md#negate)

#### Defined in

[lib/search/where-field.ts:75](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-field.ts#L75)

___

### toString

▸ **toString**(): `string`

#### Returns

`string`

#### Overrides

[WhereField](WhereField.md).[toString](WhereField.md#tostring)

#### Defined in

[lib/search/where-array.ts:22](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-array.ts#L22)

___

### true

▸ **true**(): [`Search`](Search.md)<`TEntity`\>

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Inherited from

[WhereField](WhereField.md).[true](WhereField.md#true)

#### Defined in

[lib/search/where-field.ts:22](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-field.ts#L22)
