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
- [containOneOf](WhereField.md#containoneof)
- [contains](WhereField.md#contains)
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

Makes a call to [WhereField.match](WhereField.md#match) a [WhereField.matchExact](WhereField.md#matchexact) call. Calling
this multiple times will have no effect.

**`returns`** this.

#### Defined in

[lib/search/where-field.ts:79](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/where-field.ts#L79)

___

### exactly

• `Readonly` **exactly**: [`WhereField`](WhereField.md)<`TEntity`\>

Makes a call to [WhereField.match](WhereField.md#match) a [WhereField.matchExact](WhereField.md#matchexact) call. Calling
this multiple times will have no effect.

**`returns`** this.

#### Defined in

[lib/search/where-field.ts:86](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/where-field.ts#L86)

## Accessors

### does

• `get` **does**(): `this`

Returns the current instance. Syntactic sugar to make your code more fluent.

#### Returns

`this`

this

#### Defined in

[lib/search/where-field.ts:227](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/where-field.ts#L227)

___

### is

• `get` **is**(): `this`

Returns the current instance. Syntactic sugar to make your code more fluent.

#### Returns

`this`

this

#### Defined in

[lib/search/where-field.ts:219](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/where-field.ts#L219)

___

### not

• `get` **not**(): `this`

Negates the query on the field, cause it to match when the condition is
*not* met. Calling this multiple times will negate the negation.

#### Returns

`this`

this

#### Defined in

[lib/search/where-field.ts:236](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/where-field.ts#L236)

## Methods

### between

▸ **between**(`lower`, `upper`): [`Search`](Search.md)<`TEntity`\>

Adds an inclusive range comparison against a field to the search query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `lower` | `number` | The lower bound of the range. |
| `upper` | `number` | The upper bound of the range. |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:162](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/where-field.ts#L162)

___

### contain

▸ **contain**(`value`): [`Search`](Search.md)<`TEntity`\>

Adds a whole-string match for a value within an array to the search query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | The string to be matched. |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:169](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/where-field.ts#L169)

___

### containOneOf

▸ **containOneOf**(...`value`): [`Search`](Search.md)<`TEntity`\>

Adds a whole-string match against an array to the query. If any of the provided
strings in `value` is matched in the array, this matched.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...value` | `string`[] | An array of strings that you want to match one of. |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:184](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/where-field.ts#L184)

___

### contains

▸ **contains**(`value`): [`Search`](Search.md)<`TEntity`\>

Adds a whole-string match for a value within an array to the search query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | The string to be matched. |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:176](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/where-field.ts#L176)

___

### containsOneOf

▸ **containsOneOf**(...`value`): [`Search`](Search.md)<`TEntity`\>

Adds a whole-string match against an array to the query. If any of the provided
strings in `value` is matched in the array, this matched.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...value` | `string`[] | An array of strings that you want to match one of. |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:192](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/where-field.ts#L192)

___

### eq

▸ **eq**(`value`): [`Search`](Search.md)<`TEntity`\>

Adds an equals comparison to the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `boolean` | The value to be compared |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:16](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/where-field.ts#L16)

___

### equal

▸ **equal**(`value`): [`Search`](Search.md)<`TEntity`\>

Adds an equals comparison to the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `boolean` | The value to be compared |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:23](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/where-field.ts#L23)

___

### equalTo

▸ **equalTo**(`value`): [`Search`](Search.md)<`TEntity`\>

Adds an equals comparison to the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `boolean` | The value to be compared |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:37](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/where-field.ts#L37)

___

### equals

▸ **equals**(`value`): [`Search`](Search.md)<`TEntity`\>

Adds an equals comparison to the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `boolean` | The value to be compared |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:30](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/where-field.ts#L30)

___

### false

▸ **false**(): [`Search`](Search.md)<`TEntity`\>

Adds a boolean match with a value of `false` to the query.

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:98](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/where-field.ts#L98)

___

### greaterThan

▸ **greaterThan**(`value`): [`Search`](Search.md)<`TEntity`\>

Adds a greater than comparison against a field to the search query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `number` | The number to compare against. |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:112](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/where-field.ts#L112)

___

### greaterThanOrEqualTo

▸ **greaterThanOrEqualTo**(`value`): [`Search`](Search.md)<`TEntity`\>

Adds a greater than or equal to comparison against a field to the search query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `number` | The number to compare against. |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:126](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/where-field.ts#L126)

___

### gt

▸ **gt**(`value`): [`Search`](Search.md)<`TEntity`\>

Adds a greater than comparison against a field to the search query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `number` | The number to compare against. |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:105](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/where-field.ts#L105)

___

### gte

▸ **gte**(`value`): [`Search`](Search.md)<`TEntity`\>

Adds a greater than or equal to comparison against a field to the search query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `number` | The number to compare against. |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:119](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/where-field.ts#L119)

___

### lessThan

▸ **lessThan**(`value`): [`Search`](Search.md)<`TEntity`\>

Adds a less than comparison against a field to the search query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `number` | The number to compare against. |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:140](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/where-field.ts#L140)

___

### lessThanOrEqualTo

▸ **lessThanOrEqualTo**(`value`): [`Search`](Search.md)<`TEntity`\>

Adds a less than or equal to comparison against a field to the search query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `number` | The number to compare against. |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:154](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/where-field.ts#L154)

___

### lt

▸ **lt**(`value`): [`Search`](Search.md)<`TEntity`\>

Adds a less than comparison against a field to the search query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `number` | The number to compare against. |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:133](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/where-field.ts#L133)

___

### lte

▸ **lte**(`value`): [`Search`](Search.md)<`TEntity`\>

Adds a less than or equal to comparison against a field to the search query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `number` | The number to compare against. |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:147](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/where-field.ts#L147)

___

### match

▸ **match**(`value`): [`Search`](Search.md)<`TEntity`\>

Adds a full-text search comparison to the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | The word or phrase sought. |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:44](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/where-field.ts#L44)

___

### matchExact

▸ **matchExact**(`value`): [`Search`](Search.md)<`TEntity`\>

Adds a full-text search comparison to the query that matches an exact word or phrase.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | The word or phrase sought. |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:58](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/where-field.ts#L58)

___

### matchExactly

▸ **matchExactly**(`value`): [`Search`](Search.md)<`TEntity`\>

Adds a full-text search comparison to the query that matches an exact word or phrase.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | The word or phrase sought. |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:65](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/where-field.ts#L65)

___

### matches

▸ **matches**(`value`): [`Search`](Search.md)<`TEntity`\>

Adds a full-text search comparison to the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | The word or phrase sought. |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:51](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/where-field.ts#L51)

___

### matchesExactly

▸ **matchesExactly**(`value`): [`Search`](Search.md)<`TEntity`\>

Adds a full-text search comparison to the query that matches an exact word or phrase.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | The word or phrase sought. |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:72](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/where-field.ts#L72)

___

### toString

▸ `Abstract` **toString**(): `string`

Converts this [Where](Where.md) into a portion of a RediSearch query.

#### Returns

`string`

#### Inherited from

[Where](Where.md).[toString](Where.md#tostring)

#### Defined in

[lib/search/where-field.ts:241](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/where-field.ts#L241)

___

### true

▸ **true**(): [`Search`](Search.md)<`TEntity`\>

Adds a boolean match with a value of `true` to the query.

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:92](https://github.com/redis/redis-om-node/blob/ee688a6/lib/search/where-field.ts#L92)
