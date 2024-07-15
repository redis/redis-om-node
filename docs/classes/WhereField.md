[redis-om](../README.md) / WhereField

# Class: WhereField<T\>

Abstract base class that all fields you want to filter
with extend. When you call [where](Search.md#where), a
subclass of this is returned.

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Entity`](../README.md#entity) = `Record`<`string`, `any`\> |

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

- [after](WhereField.md#after)
- [before](WhereField.md#before)
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
- [inCircle](WhereField.md#incircle)
- [inRadius](WhereField.md#inradius)
- [lessThan](WhereField.md#lessthan)
- [lessThanOrEqualTo](WhereField.md#lessthanorequalto)
- [lt](WhereField.md#lt)
- [lte](WhereField.md#lte)
- [match](WhereField.md#match)
- [matchExact](WhereField.md#matchexact)
- [matchExactly](WhereField.md#matchexactly)
- [matches](WhereField.md#matches)
- [matchesExactly](WhereField.md#matchesexactly)
- [on](WhereField.md#on)
- [onOrAfter](WhereField.md#onorafter)
- [onOrBefore](WhereField.md#onorbefore)
- [toString](WhereField.md#tostring)
- [true](WhereField.md#true)

## Properties

### exact

• `Readonly` **exact**: [`WhereField`](WhereField.md)<`T`\>

Makes a call to [match](WhereField.md#match) a [matchExact](WhereField.md#matchexact) call. Calling
this multiple times will have no effect.

#### Defined in

[lib/search/where-field.ts:99](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-field.ts#L99)

___

### exactly

• `Readonly` **exactly**: [`WhereField`](WhereField.md)<`T`\>

Makes a call to [match](WhereField.md#match) a [matchExact](WhereField.md#matchexact) call. Calling
this multiple times will have no effect.

#### Defined in

[lib/search/where-field.ts:106](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-field.ts#L106)

## Accessors

### does

• `get` **does**(): `this`

Returns the current instance. Syntactic sugar to make your code more fluent.

#### Returns

`this`

this

#### Defined in

[lib/search/where-field.ts:296](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-field.ts#L296)

___

### is

• `get` **is**(): `this`

Returns the current instance. Syntactic sugar to make your code more fluent.

#### Returns

`this`

this

#### Defined in

[lib/search/where-field.ts:288](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-field.ts#L288)

___

### not

• `get` **not**(): `this`

Negates the query on the field, cause it to match when the condition is
*not* met. Calling this multiple times will negate the negation.

#### Returns

`this`

this

#### Defined in

[lib/search/where-field.ts:305](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-field.ts#L305)

## Methods

### after

▸ **after**(`value`): [`Search`](Search.md)<`T`\>

Add a search that matches all datetimes *after* the provided UTC datetime to the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `Date` | The datetime to compare against. |

#### Returns

[`Search`](Search.md)<`T`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:247](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-field.ts#L247)

___

### before

▸ **before**(`value`): [`Search`](Search.md)<`T`\>

Add a search that matches all datetimes *before* the provided UTC datetime to the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `Date` | The datetime to compare against. |

#### Returns

[`Search`](Search.md)<`T`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:240](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-field.ts#L240)

___

### between

▸ **between**(`lower`, `upper`): [`Search`](Search.md)<`T`\>

Adds an inclusive range comparison against a field to the search query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `lower` | `string` \| `number` \| `Date` | The lower bound of the range. |
| `upper` | `string` \| `number` \| `Date` | The upper bound of the range. |

#### Returns

[`Search`](Search.md)<`T`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:182](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-field.ts#L182)

___

### contain

▸ **contain**(`value`): [`Search`](Search.md)<`T`\>

Adds a whole-string match for a value within a string array to the search query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | The string to be matched. |

#### Returns

[`Search`](Search.md)<`T`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:189](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-field.ts#L189)

___

### containOneOf

▸ **containOneOf**(`...value`): [`Search`](Search.md)<`T`\>

Adds a whole-string match against a string array to the query. If any of the provided
strings in `value` is matched in the array, this matched.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...value` | `string`[] | An array of strings that you want to match one of. |

#### Returns

[`Search`](Search.md)<`T`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:204](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-field.ts#L204)

___

### contains

▸ **contains**(`value`): [`Search`](Search.md)<`T`\>

Adds a whole-string match for a value within a string array to the search query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | The string to be matched. |

#### Returns

[`Search`](Search.md)<`T`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:196](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-field.ts#L196)

___

### containsOneOf

▸ **containsOneOf**(`...value`): [`Search`](Search.md)<`T`\>

Adds a whole-string match against a string array to the query. If any of the provided
strings in `value` is matched in the array, this matched.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...value` | `string`[] | An array of strings that you want to match one of. |

#### Returns

[`Search`](Search.md)<`T`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:212](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-field.ts#L212)

___

### eq

▸ **eq**(`value`): [`Search`](Search.md)<`T`\>

Adds an equals comparison to the query.

NOTE: this function is not available for strings where full-text
search is enabled. In that scenario, use `.match`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `boolean` \| `Date` | The value to be compared |

#### Returns

[`Search`](Search.md)<`T`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:21](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-field.ts#L21)

___

### equal

▸ **equal**(`value`): [`Search`](Search.md)<`T`\>

Adds an equals comparison to the query.

NOTE: this function is not available for strings where full-text
search is enabled. In that scenario, use `.match`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `boolean` \| `Date` | The value to be compared |

#### Returns

[`Search`](Search.md)<`T`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:31](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-field.ts#L31)

___

### equalTo

▸ **equalTo**(`value`): [`Search`](Search.md)<`T`\>

Adds an equals comparison to the query.

NOTE: this function is not available for strings where full-text
search is enabled. In that scenario, use `.match`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `boolean` \| `Date` | The value to be compared |

#### Returns

[`Search`](Search.md)<`T`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:51](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-field.ts#L51)

___

### equals

▸ **equals**(`value`): [`Search`](Search.md)<`T`\>

Adds an equals comparison to the query.

NOTE: this function is not available for strings where full-text
search is enabled. In that scenario, use `.match`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `boolean` \| `Date` | The value to be compared |

#### Returns

[`Search`](Search.md)<`T`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:41](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-field.ts#L41)

___

### false

▸ **false**(): [`Search`](Search.md)<`T`\>

Adds a boolean match with a value of `false` to the query.

#### Returns

[`Search`](Search.md)<`T`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:118](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-field.ts#L118)

___

### greaterThan

▸ **greaterThan**(`value`): [`Search`](Search.md)<`T`\>

Adds a greater than comparison against a field to the search query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `Date` | The value to compare against. |

#### Returns

[`Search`](Search.md)<`T`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:132](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-field.ts#L132)

___

### greaterThanOrEqualTo

▸ **greaterThanOrEqualTo**(`value`): [`Search`](Search.md)<`T`\>

Adds a greater than or equal to comparison against a field to the search query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `Date` | The value to compare against. |

#### Returns

[`Search`](Search.md)<`T`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:146](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-field.ts#L146)

___

### gt

▸ **gt**(`value`): [`Search`](Search.md)<`T`\>

Adds a greater than comparison against a field to the search query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `Date` | The value to compare against. |

#### Returns

[`Search`](Search.md)<`T`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:125](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-field.ts#L125)

___

### gte

▸ **gte**(`value`): [`Search`](Search.md)<`T`\>

Adds a greater than or equal to comparison against a field to the search query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `Date` | The value to compare against. |

#### Returns

[`Search`](Search.md)<`T`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:139](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-field.ts#L139)

___

### inCircle

▸ **inCircle**(`circleFn`): [`Search`](Search.md)<`T`\>

Adds a search for points that fall within a defined circle.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `circleFn` | [`CircleFunction`](../README.md#circlefunction) | A function that returns a [Circle](Circle.md) instance defining the search area. |

#### Returns

[`Search`](Search.md)<`T`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:219](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-field.ts#L219)

___

### inRadius

▸ **inRadius**(`circleFn`): [`Search`](Search.md)<`T`\>

Adds a search for points that fall within a defined radius.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `circleFn` | [`CircleFunction`](../README.md#circlefunction) | A function that returns a [Circle](Circle.md) instance defining the search area. |

#### Returns

[`Search`](Search.md)<`T`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:226](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-field.ts#L226)

___

### lessThan

▸ **lessThan**(`value`): [`Search`](Search.md)<`T`\>

Adds a less than comparison against a field to the search query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `Date` | The value to compare against. |

#### Returns

[`Search`](Search.md)<`T`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:160](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-field.ts#L160)

___

### lessThanOrEqualTo

▸ **lessThanOrEqualTo**(`value`): [`Search`](Search.md)<`T`\>

Adds a less than or equal to comparison against a field to the search query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `Date` | The value to compare against. |

#### Returns

[`Search`](Search.md)<`T`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:174](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-field.ts#L174)

___

### lt

▸ **lt**(`value`): [`Search`](Search.md)<`T`\>

Adds a less than comparison against a field to the search query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `Date` | The value to compare against. |

#### Returns

[`Search`](Search.md)<`T`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:153](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-field.ts#L153)

___

### lte

▸ **lte**(`value`): [`Search`](Search.md)<`T`\>

Adds a less than or equal to comparison against a field to the search query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `Date` | The value to compare against. |

#### Returns

[`Search`](Search.md)<`T`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:167](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-field.ts#L167)

___

### match

▸ **match**(`value`, `options?`): [`Search`](Search.md)<`T`\>

Adds a full-text search comparison to the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `boolean` | The word or phrase sought. |
| `options?` | `Object` |  |
| `options.fuzzyMatching?` | `boolean` | Whether to use fuzzy matching to find the sought word or phrase. Defaults to `false`. |
| `options.levenshteinDistance?` | ``2`` \| ``1`` \| ``3`` | The levenshtein distance to use for fuzzy matching. Supported values are `1`, `2`, and `3`. Defaults to `1`. |

#### Returns

[`Search`](Search.md)<`T`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:61](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-field.ts#L61)

___

### matchExact

▸ **matchExact**(`value`): [`Search`](Search.md)<`T`\>

Adds a full-text search comparison to the query that matches an exact word or phrase.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `boolean` | The word or phrase sought. |

#### Returns

[`Search`](Search.md)<`T`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:78](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-field.ts#L78)

___

### matchExactly

▸ **matchExactly**(`value`): [`Search`](Search.md)<`T`\>

Adds a full-text search comparison to the query that matches an exact word or phrase.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `boolean` | The word or phrase sought. |

#### Returns

[`Search`](Search.md)<`T`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:85](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-field.ts#L85)

___

### matches

▸ **matches**(`value`, `options?`): [`Search`](Search.md)<`T`\>

Adds a full-text search comparison to the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `boolean` | The word or phrase sought. |
| `options?` | `Object` |  |
| `options.fuzzyMatching?` | `boolean` | Whether to use fuzzy matching to find the sought word or phrase. Defaults to `false`. |
| `options.levenshteinDistance?` | ``2`` \| ``1`` \| ``3`` | The levenshtein distance to use for fuzzy matching. Supported values are `1`, `2`, and `3`. Defaults to `1`. |

#### Returns

[`Search`](Search.md)<`T`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:71](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-field.ts#L71)

___

### matchesExactly

▸ **matchesExactly**(`value`): [`Search`](Search.md)<`T`\>

Adds a full-text search comparison to the query that matches an exact word or phrase.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `boolean` | The word or phrase sought. |

#### Returns

[`Search`](Search.md)<`T`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:92](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-field.ts#L92)

___

### on

▸ **on**(`value`): [`Search`](Search.md)<`T`\>

Add a search for an exact UTC datetime to the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `Date` | The datetime to match. |

#### Returns

[`Search`](Search.md)<`T`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:233](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-field.ts#L233)

___

### onOrAfter

▸ **onOrAfter**(`value`): [`Search`](Search.md)<`T`\>

Add a search that matches all datetimes *on or after* the provided UTC datetime to the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `Date` | The datetime to compare against. |

#### Returns

[`Search`](Search.md)<`T`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:261](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-field.ts#L261)

___

### onOrBefore

▸ **onOrBefore**(`value`): [`Search`](Search.md)<`T`\>

Add a search that matches all datetimes *on or before* the provided UTC datetime to the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `Date` | The datetime to compare against. |

#### Returns

[`Search`](Search.md)<`T`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:254](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-field.ts#L254)

___

### toString

▸ `Abstract` **toString**(): `string`

Converts this [Where](Where.md) into a portion of a RediSearch query.

#### Returns

`string`

#### Inherited from

[Where](Where.md).[toString](Where.md#tostring)

#### Defined in

[lib/search/where-field.ts:310](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-field.ts#L310)

___

### true

▸ **true**(): [`Search`](Search.md)<`T`\>

Adds a boolean match with a value of `true` to the query.

#### Returns

[`Search`](Search.md)<`T`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:112](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-field.ts#L112)
