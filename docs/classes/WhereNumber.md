[redis-om](../README.md) / WhereNumber

# Class: WhereNumber<TEntity\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `TEntity` | extends [`Entity`](Entity.md) |

## Hierarchy

- [`WhereField`](WhereField.md)<`TEntity`\>

  ↳ **`WhereNumber`**

## Table of contents

### Constructors

- [constructor](WhereNumber.md#constructor)

### Properties

- [exact](WhereNumber.md#exact)
- [exactly](WhereNumber.md#exactly)
- [field](WhereNumber.md#field)
- [search](WhereNumber.md#search)

### Accessors

- [does](WhereNumber.md#does)
- [is](WhereNumber.md#is)
- [not](WhereNumber.md#not)

### Methods

- [between](WhereNumber.md#between)
- [buildQuery](WhereNumber.md#buildquery)
- [contain](WhereNumber.md#contain)
- [containAllOf](WhereNumber.md#containallof)
- [containOneOf](WhereNumber.md#containoneof)
- [contains](WhereNumber.md#contains)
- [containsAllOf](WhereNumber.md#containsallof)
- [containsOneOf](WhereNumber.md#containsoneof)
- [eq](WhereNumber.md#eq)
- [equal](WhereNumber.md#equal)
- [equalTo](WhereNumber.md#equalto)
- [equals](WhereNumber.md#equals)
- [false](WhereNumber.md#false)
- [greaterThan](WhereNumber.md#greaterthan)
- [greaterThanOrEqualTo](WhereNumber.md#greaterthanorequalto)
- [gt](WhereNumber.md#gt)
- [gte](WhereNumber.md#gte)
- [lessThan](WhereNumber.md#lessthan)
- [lessThanOrEqualTo](WhereNumber.md#lessthanorequalto)
- [lt](WhereNumber.md#lt)
- [lte](WhereNumber.md#lte)
- [match](WhereNumber.md#match)
- [matchExact](WhereNumber.md#matchexact)
- [matchExactly](WhereNumber.md#matchexactly)
- [matches](WhereNumber.md#matches)
- [matchesExactly](WhereNumber.md#matchesexactly)
- [negate](WhereNumber.md#negate)
- [toString](WhereNumber.md#tostring)
- [true](WhereNumber.md#true)

## Constructors

### constructor

• **new WhereNumber**<`TEntity`\>(`search`, `field`)

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

#### Overrides

[WhereField](WhereField.md).[between](WhereField.md#between)

#### Defined in

[lib/search/where-number.ts:39](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-number.ts#L39)

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

#### Inherited from

[WhereField](WhereField.md).[contain](WhereField.md#contain)

#### Defined in

[lib/search/where-field.ts:39](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-field.ts#L39)

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

#### Inherited from

[WhereField](WhereField.md).[containOneOf](WhereField.md#containoneof)

#### Defined in

[lib/search/where-field.ts:45](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-field.ts#L45)

___

### contains

▸ **contains**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Inherited from

[WhereField](WhereField.md).[contains](WhereField.md#contains)

#### Defined in

[lib/search/where-field.ts:40](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-field.ts#L40)

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

#### Inherited from

[WhereField](WhereField.md).[containsOneOf](WhereField.md#containsoneof)

#### Defined in

[lib/search/where-field.ts:46](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-field.ts#L46)

___

### eq

▸ **eq**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Overrides

[WhereField](WhereField.md).[eq](WhereField.md#eq)

#### Defined in

[lib/search/where-number.ts:11](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-number.ts#L11)

___

### equal

▸ **equal**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Overrides

[WhereField](WhereField.md).[equal](WhereField.md#equal)

#### Defined in

[lib/search/where-number.ts:45](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-number.ts#L45)

___

### equalTo

▸ **equalTo**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Overrides

[WhereField](WhereField.md).[equalTo](WhereField.md#equalto)

#### Defined in

[lib/search/where-number.ts:47](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-number.ts#L47)

___

### equals

▸ **equals**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Overrides

[WhereField](WhereField.md).[equals](WhereField.md#equals)

#### Defined in

[lib/search/where-number.ts:46](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-number.ts#L46)

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

#### Overrides

[WhereField](WhereField.md).[greaterThan](WhereField.md#greaterthan)

#### Defined in

[lib/search/where-number.ts:49](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-number.ts#L49)

___

### greaterThanOrEqualTo

▸ **greaterThanOrEqualTo**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Overrides

[WhereField](WhereField.md).[greaterThanOrEqualTo](WhereField.md#greaterthanorequalto)

#### Defined in

[lib/search/where-number.ts:50](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-number.ts#L50)

___

### gt

▸ **gt**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Overrides

[WhereField](WhereField.md).[gt](WhereField.md#gt)

#### Defined in

[lib/search/where-number.ts:17](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-number.ts#L17)

___

### gte

▸ **gte**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Overrides

[WhereField](WhereField.md).[gte](WhereField.md#gte)

#### Defined in

[lib/search/where-number.ts:23](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-number.ts#L23)

___

### lessThan

▸ **lessThan**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Overrides

[WhereField](WhereField.md).[lessThan](WhereField.md#lessthan)

#### Defined in

[lib/search/where-number.ts:51](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-number.ts#L51)

___

### lessThanOrEqualTo

▸ **lessThanOrEqualTo**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Overrides

[WhereField](WhereField.md).[lessThanOrEqualTo](WhereField.md#lessthanorequalto)

#### Defined in

[lib/search/where-number.ts:52](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-number.ts#L52)

___

### lt

▸ **lt**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Overrides

[WhereField](WhereField.md).[lt](WhereField.md#lt)

#### Defined in

[lib/search/where-number.ts:28](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-number.ts#L28)

___

### lte

▸ **lte**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Overrides

[WhereField](WhereField.md).[lte](WhereField.md#lte)

#### Defined in

[lib/search/where-number.ts:34](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-number.ts#L34)

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

[lib/search/where-number.ts:54](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-number.ts#L54)

___

### true

▸ **true**(): [`Search`](Search.md)<`TEntity`\>

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Inherited from

[WhereField](WhereField.md).[true](WhereField.md#true)

#### Defined in

[lib/search/where-field.ts:22](https://github.com/redis-developer/redis-om-node/blob/d4db235/lib/search/where-field.ts#L22)
