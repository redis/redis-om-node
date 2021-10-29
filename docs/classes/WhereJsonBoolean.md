[redis-om](../README.md) / WhereJsonBoolean

# Class: WhereJsonBoolean<TEntity\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `TEntity` | extends [`Entity`](Entity.md) |

## Hierarchy

- [`WhereBoolean`](WhereBoolean.md)<`TEntity`\>

  ↳ **`WhereJsonBoolean`**

## Table of contents

### Constructors

- [constructor](WhereJsonBoolean.md#constructor)

### Properties

- [exact](WhereJsonBoolean.md#exact)
- [exactly](WhereJsonBoolean.md#exactly)
- [field](WhereJsonBoolean.md#field)
- [search](WhereJsonBoolean.md#search)
- [value](WhereJsonBoolean.md#value)

### Accessors

- [does](WhereJsonBoolean.md#does)
- [is](WhereJsonBoolean.md#is)
- [not](WhereJsonBoolean.md#not)

### Methods

- [between](WhereJsonBoolean.md#between)
- [buildQuery](WhereJsonBoolean.md#buildquery)
- [contain](WhereJsonBoolean.md#contain)
- [containAllOf](WhereJsonBoolean.md#containallof)
- [containOneOf](WhereJsonBoolean.md#containoneof)
- [contains](WhereJsonBoolean.md#contains)
- [containsAllOf](WhereJsonBoolean.md#containsallof)
- [containsOneOf](WhereJsonBoolean.md#containsoneof)
- [eq](WhereJsonBoolean.md#eq)
- [equal](WhereJsonBoolean.md#equal)
- [equalTo](WhereJsonBoolean.md#equalto)
- [equals](WhereJsonBoolean.md#equals)
- [false](WhereJsonBoolean.md#false)
- [greaterThan](WhereJsonBoolean.md#greaterthan)
- [greaterThanOrEqualTo](WhereJsonBoolean.md#greaterthanorequalto)
- [gt](WhereJsonBoolean.md#gt)
- [gte](WhereJsonBoolean.md#gte)
- [lessThan](WhereJsonBoolean.md#lessthan)
- [lessThanOrEqualTo](WhereJsonBoolean.md#lessthanorequalto)
- [lt](WhereJsonBoolean.md#lt)
- [lte](WhereJsonBoolean.md#lte)
- [match](WhereJsonBoolean.md#match)
- [matchExact](WhereJsonBoolean.md#matchexact)
- [matchExactly](WhereJsonBoolean.md#matchexactly)
- [matches](WhereJsonBoolean.md#matches)
- [matchesExactly](WhereJsonBoolean.md#matchesexactly)
- [negate](WhereJsonBoolean.md#negate)
- [toString](WhereJsonBoolean.md#tostring)
- [true](WhereJsonBoolean.md#true)

## Constructors

### constructor

• **new WhereJsonBoolean**<`TEntity`\>(`search`, `field`)

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

[WhereBoolean](WhereBoolean.md).[constructor](WhereBoolean.md#constructor)

#### Defined in

[lib/search/where-field.ts:55](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/where-field.ts#L55)

## Properties

### exact

• `Readonly` **exact**: [`WhereText`](WhereText.md)<`TEntity`\>

#### Inherited from

[WhereBoolean](WhereBoolean.md).[exact](WhereBoolean.md#exact)

#### Defined in

[lib/search/where-field.ts:19](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/where-field.ts#L19)

___

### exactly

• `Readonly` **exactly**: [`WhereText`](WhereText.md)<`TEntity`\>

#### Inherited from

[WhereBoolean](WhereBoolean.md).[exactly](WhereBoolean.md#exactly)

#### Defined in

[lib/search/where-field.ts:20](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/where-field.ts#L20)

___

### field

• `Protected` **field**: `String`

#### Inherited from

[WhereBoolean](WhereBoolean.md).[field](WhereBoolean.md#field)

#### Defined in

[lib/search/where-field.ts:53](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/where-field.ts#L53)

___

### search

• `Protected` **search**: [`Search`](Search.md)<`TEntity`\>

#### Inherited from

[WhereBoolean](WhereBoolean.md).[search](WhereBoolean.md#search)

#### Defined in

[lib/search/where-field.ts:52](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/where-field.ts#L52)

___

### value

• `Protected` **value**: `boolean`

#### Inherited from

[WhereBoolean](WhereBoolean.md).[value](WhereBoolean.md#value)

#### Defined in

[lib/search/where-boolean.ts:6](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/where-boolean.ts#L6)

## Accessors

### does

• `get` **does**(): `this`

#### Returns

`this`

#### Inherited from

WhereBoolean.does

#### Defined in

[lib/search/where-field.ts:64](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/where-field.ts#L64)

___

### is

• `get` **is**(): `this`

#### Returns

`this`

#### Inherited from

WhereBoolean.is

#### Defined in

[lib/search/where-field.ts:60](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/where-field.ts#L60)

___

### not

• `get` **not**(): `this`

#### Returns

`this`

#### Inherited from

WhereBoolean.not

#### Defined in

[lib/search/where-field.ts:68](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/where-field.ts#L68)

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

[WhereBoolean](WhereBoolean.md).[between](WhereBoolean.md#between)

#### Defined in

[lib/search/where-field.ts:37](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/where-field.ts#L37)

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

[WhereBoolean](WhereBoolean.md).[buildQuery](WhereBoolean.md#buildquery)

#### Defined in

[lib/search/where-field.ts:79](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/where-field.ts#L79)

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

[WhereBoolean](WhereBoolean.md).[contain](WhereBoolean.md#contain)

#### Defined in

[lib/search/where-field.ts:39](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/where-field.ts#L39)

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

[WhereBoolean](WhereBoolean.md).[containAllOf](WhereBoolean.md#containallof)

#### Defined in

[lib/search/where-field.ts:42](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/where-field.ts#L42)

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

[WhereBoolean](WhereBoolean.md).[containOneOf](WhereBoolean.md#containoneof)

#### Defined in

[lib/search/where-field.ts:45](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/where-field.ts#L45)

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

[WhereBoolean](WhereBoolean.md).[contains](WhereBoolean.md#contains)

#### Defined in

[lib/search/where-field.ts:40](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/where-field.ts#L40)

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

[WhereBoolean](WhereBoolean.md).[containsAllOf](WhereBoolean.md#containsallof)

#### Defined in

[lib/search/where-field.ts:43](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/where-field.ts#L43)

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

[WhereBoolean](WhereBoolean.md).[containsOneOf](WhereBoolean.md#containsoneof)

#### Defined in

[lib/search/where-field.ts:46](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/where-field.ts#L46)

___

### eq

▸ **eq**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `boolean` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Inherited from

[WhereBoolean](WhereBoolean.md).[eq](WhereBoolean.md#eq)

#### Defined in

[lib/search/where-boolean.ts:8](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/where-boolean.ts#L8)

___

### equal

▸ **equal**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `boolean` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Inherited from

[WhereBoolean](WhereBoolean.md).[equal](WhereBoolean.md#equal)

#### Defined in

[lib/search/where-boolean.ts:13](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/where-boolean.ts#L13)

___

### equalTo

▸ **equalTo**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `boolean` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Inherited from

[WhereBoolean](WhereBoolean.md).[equalTo](WhereBoolean.md#equalto)

#### Defined in

[lib/search/where-boolean.ts:15](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/where-boolean.ts#L15)

___

### equals

▸ **equals**(`value`): [`Search`](Search.md)<`TEntity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `boolean` |

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Inherited from

[WhereBoolean](WhereBoolean.md).[equals](WhereBoolean.md#equals)

#### Defined in

[lib/search/where-boolean.ts:14](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/where-boolean.ts#L14)

___

### false

▸ **false**(): [`Search`](Search.md)<`TEntity`\>

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Inherited from

[WhereBoolean](WhereBoolean.md).[false](WhereBoolean.md#false)

#### Defined in

[lib/search/where-boolean.ts:18](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/where-boolean.ts#L18)

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

[WhereBoolean](WhereBoolean.md).[greaterThan](WhereBoolean.md#greaterthan)

#### Defined in

[lib/search/where-field.ts:26](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/where-field.ts#L26)

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

[WhereBoolean](WhereBoolean.md).[greaterThanOrEqualTo](WhereBoolean.md#greaterthanorequalto)

#### Defined in

[lib/search/where-field.ts:29](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/where-field.ts#L29)

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

[WhereBoolean](WhereBoolean.md).[gt](WhereBoolean.md#gt)

#### Defined in

[lib/search/where-field.ts:25](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/where-field.ts#L25)

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

[WhereBoolean](WhereBoolean.md).[gte](WhereBoolean.md#gte)

#### Defined in

[lib/search/where-field.ts:28](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/where-field.ts#L28)

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

[WhereBoolean](WhereBoolean.md).[lessThan](WhereBoolean.md#lessthan)

#### Defined in

[lib/search/where-field.ts:32](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/where-field.ts#L32)

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

[WhereBoolean](WhereBoolean.md).[lessThanOrEqualTo](WhereBoolean.md#lessthanorequalto)

#### Defined in

[lib/search/where-field.ts:35](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/where-field.ts#L35)

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

[WhereBoolean](WhereBoolean.md).[lt](WhereBoolean.md#lt)

#### Defined in

[lib/search/where-field.ts:31](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/where-field.ts#L31)

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

[WhereBoolean](WhereBoolean.md).[lte](WhereBoolean.md#lte)

#### Defined in

[lib/search/where-field.ts:34](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/where-field.ts#L34)

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

[WhereBoolean](WhereBoolean.md).[match](WhereBoolean.md#match)

#### Defined in

[lib/search/where-field.ts:13](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/where-field.ts#L13)

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

[WhereBoolean](WhereBoolean.md).[matchExact](WhereBoolean.md#matchexact)

#### Defined in

[lib/search/where-field.ts:15](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/where-field.ts#L15)

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

[WhereBoolean](WhereBoolean.md).[matchExactly](WhereBoolean.md#matchexactly)

#### Defined in

[lib/search/where-field.ts:16](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/where-field.ts#L16)

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

[WhereBoolean](WhereBoolean.md).[matches](WhereBoolean.md#matches)

#### Defined in

[lib/search/where-field.ts:14](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/where-field.ts#L14)

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

[WhereBoolean](WhereBoolean.md).[matchesExactly](WhereBoolean.md#matchesexactly)

#### Defined in

[lib/search/where-field.ts:17](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/where-field.ts#L17)

___

### negate

▸ `Protected` **negate**(): `void`

#### Returns

`void`

#### Inherited from

[WhereBoolean](WhereBoolean.md).[negate](WhereBoolean.md#negate)

#### Defined in

[lib/search/where-field.ts:75](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/where-field.ts#L75)

___

### toString

▸ **toString**(): `string`

#### Returns

`string`

#### Overrides

[WhereBoolean](WhereBoolean.md).[toString](WhereBoolean.md#tostring)

#### Defined in

[lib/search/where-boolean.ts:30](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/where-boolean.ts#L30)

___

### true

▸ **true**(): [`Search`](Search.md)<`TEntity`\>

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Inherited from

[WhereBoolean](WhereBoolean.md).[true](WhereBoolean.md#true)

#### Defined in

[lib/search/where-boolean.ts:17](https://github.com/redis-developer/redis-om-node/blob/b9319e2/lib/search/where-boolean.ts#L17)
