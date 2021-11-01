[redis-om](../README.md) / WhereField

# Class: WhereField<TEntity\>

Abstract base class that all fields you want to filter
with extend. When you call [Search.where](Search.md#where), a
subclass of this is returned.

## Type parameters

| Name |
| :------ |
| `TEntity` |

## Hierarchy

- [`Where`](Where.md)

  ↳ **`WhereField`**

## Table of contents

### Properties

- [exact](WhereField.md#exact)
- [exactly](WhereField.md#exactly)

### Accessors

- [does](WhereField.md#does)
- [is](WhereField.md#is)
- [not](WhereField.md#not)

### Methods

- [between](WhereField.md#between)
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
- [toString](WhereField.md#tostring)
- [true](WhereField.md#true)

## Properties

### exact

• `Readonly` **exact**: [`WhereField`](WhereField.md)<`TEntity`\>

#### Defined in

[lib/search/where-field.ts:45](https://github.com/redis-developer/redis-om-node/blob/3cf5542/lib/search/where-field.ts#L45)

___

### exactly

• `Readonly` **exactly**: [`WhereField`](WhereField.md)<`TEntity`\>

#### Defined in

[lib/search/where-field.ts:46](https://github.com/redis-developer/redis-om-node/blob/3cf5542/lib/search/where-field.ts#L46)

## Accessors

### does

• `get` **does**(): `this`

Returns the current instance. Syntactic sugar to make your code more fluent.

#### Returns

`this`

this

#### Defined in

[lib/search/where-field.ts:107](https://github.com/redis-developer/redis-om-node/blob/3cf5542/lib/search/where-field.ts#L107)

___

### is

• `get` **is**(): `this`

Returns the current instance. Syntactic sugar to make your code more fluent.

#### Returns

`this`

this

#### Defined in

[lib/search/where-field.ts:99](https://github.com/redis-developer/redis-om-node/blob/3cf5542/lib/search/where-field.ts#L99)

___

### not

• `get` **not**(): `this`

Negates the query on the field, cause it to match when the condition is
*not* met. Calling this multiple times will negate the negation.

#### Returns

`this`

this

#### Defined in

[lib/search/where-field.ts:116](https://github.com/redis-developer/redis-om-node/blob/3cf5542/lib/search/where-field.ts#L116)

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

[lib/search/where-field.ts:63](https://github.com/redis-developer/redis-om-node/blob/3cf5542/lib/search/where-field.ts#L63)

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

[lib/search/where-field.ts:65](https://github.com/redis-developer/redis-om-node/blob/3cf5542/lib/search/where-field.ts#L65)

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

[lib/search/where-field.ts:68](https://github.com/redis-developer/redis-om-node/blob/3cf5542/lib/search/where-field.ts#L68)

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

[lib/search/where-field.ts:71](https://github.com/redis-developer/redis-om-node/blob/3cf5542/lib/search/where-field.ts#L71)

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

[lib/search/where-field.ts:66](https://github.com/redis-developer/redis-om-node/blob/3cf5542/lib/search/where-field.ts#L66)

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

[lib/search/where-field.ts:69](https://github.com/redis-developer/redis-om-node/blob/3cf5542/lib/search/where-field.ts#L69)

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

[lib/search/where-field.ts:72](https://github.com/redis-developer/redis-om-node/blob/3cf5542/lib/search/where-field.ts#L72)

___

### eq

▸ **eq**(`value`): [`Search`](Search.md)<`TEntity`\>

Adds an equals comparisson to the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `boolean` | The value to be compared |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:16](https://github.com/redis-developer/redis-om-node/blob/3cf5542/lib/search/where-field.ts#L16)

___

### equal

▸ **equal**(`value`): [`Search`](Search.md)<`TEntity`\>

Adds an equals comparisson to the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `boolean` | The value to be compared |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:23](https://github.com/redis-developer/redis-om-node/blob/3cf5542/lib/search/where-field.ts#L23)

___

### equalTo

▸ **equalTo**(`value`): [`Search`](Search.md)<`TEntity`\>

Adds an equals comparisson to the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `boolean` | The value to be compared |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:37](https://github.com/redis-developer/redis-om-node/blob/3cf5542/lib/search/where-field.ts#L37)

___

### equals

▸ **equals**(`value`): [`Search`](Search.md)<`TEntity`\>

Adds an equals comparisson to the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `boolean` | The value to be compared |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:30](https://github.com/redis-developer/redis-om-node/blob/3cf5542/lib/search/where-field.ts#L30)

___

### false

▸ **false**(): [`Search`](Search.md)<`TEntity`\>

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Defined in

[lib/search/where-field.ts:49](https://github.com/redis-developer/redis-om-node/blob/3cf5542/lib/search/where-field.ts#L49)

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

[lib/search/where-field.ts:52](https://github.com/redis-developer/redis-om-node/blob/3cf5542/lib/search/where-field.ts#L52)

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

[lib/search/where-field.ts:55](https://github.com/redis-developer/redis-om-node/blob/3cf5542/lib/search/where-field.ts#L55)

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

[lib/search/where-field.ts:51](https://github.com/redis-developer/redis-om-node/blob/3cf5542/lib/search/where-field.ts#L51)

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

[lib/search/where-field.ts:54](https://github.com/redis-developer/redis-om-node/blob/3cf5542/lib/search/where-field.ts#L54)

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

[lib/search/where-field.ts:58](https://github.com/redis-developer/redis-om-node/blob/3cf5542/lib/search/where-field.ts#L58)

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

[lib/search/where-field.ts:61](https://github.com/redis-developer/redis-om-node/blob/3cf5542/lib/search/where-field.ts#L61)

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

[lib/search/where-field.ts:57](https://github.com/redis-developer/redis-om-node/blob/3cf5542/lib/search/where-field.ts#L57)

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

[lib/search/where-field.ts:60](https://github.com/redis-developer/redis-om-node/blob/3cf5542/lib/search/where-field.ts#L60)

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

[lib/search/where-field.ts:39](https://github.com/redis-developer/redis-om-node/blob/3cf5542/lib/search/where-field.ts#L39)

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

[lib/search/where-field.ts:41](https://github.com/redis-developer/redis-om-node/blob/3cf5542/lib/search/where-field.ts#L41)

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

[lib/search/where-field.ts:42](https://github.com/redis-developer/redis-om-node/blob/3cf5542/lib/search/where-field.ts#L42)

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

[lib/search/where-field.ts:40](https://github.com/redis-developer/redis-om-node/blob/3cf5542/lib/search/where-field.ts#L40)

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

[lib/search/where-field.ts:43](https://github.com/redis-developer/redis-om-node/blob/3cf5542/lib/search/where-field.ts#L43)

___

### toString

▸ `Abstract` **toString**(): `string`

Converts this [Where](Where.md) into a portion of a RediSearch query.

#### Returns

`string`

#### Inherited from

[Where](Where.md).[toString](Where.md#tostring)

#### Defined in

[lib/search/where-field.ts:121](https://github.com/redis-developer/redis-om-node/blob/3cf5542/lib/search/where-field.ts#L121)

___

### true

▸ **true**(): [`Search`](Search.md)<`TEntity`\>

#### Returns

[`Search`](Search.md)<`TEntity`\>

#### Defined in

[lib/search/where-field.ts:48](https://github.com/redis-developer/redis-om-node/blob/3cf5542/lib/search/where-field.ts#L48)
