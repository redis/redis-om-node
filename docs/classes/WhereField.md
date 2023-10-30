[redis-om](../README.md) / WhereField

# Class: WhereField

Abstract base class that all fields you want to filter
with extend. When you call [where](Search.md#where), a
subclass of this is returned.

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

• `Readonly` **exact**: [`WhereField`](WhereField.md)

Makes a call to [match](WhereField.md#match) a [matchExact](WhereField.md#matchexact) call. Calling
this multiple times will have no effect.

#### Defined in

[lib/search/where-field.ts:96](https://github.com/redis/redis-om-node/blob/d8438f7/lib/search/where-field.ts#L96)

___

### exactly

• `Readonly` **exactly**: [`WhereField`](WhereField.md)

Makes a call to [match](WhereField.md#match) a [matchExact](WhereField.md#matchexact) call. Calling
this multiple times will have no effect.

#### Defined in

[lib/search/where-field.ts:103](https://github.com/redis/redis-om-node/blob/d8438f7/lib/search/where-field.ts#L103)

## Accessors

### does

• `get` **does**(): `this`

Returns the current instance. Syntactic sugar to make your code more fluent.

#### Returns

`this`

this

#### Defined in

[lib/search/where-field.ts:293](https://github.com/redis/redis-om-node/blob/d8438f7/lib/search/where-field.ts#L293)

___

### is

• `get` **is**(): `this`

Returns the current instance. Syntactic sugar to make your code more fluent.

#### Returns

`this`

this

#### Defined in

[lib/search/where-field.ts:285](https://github.com/redis/redis-om-node/blob/d8438f7/lib/search/where-field.ts#L285)

___

### not

• `get` **not**(): `this`

Negates the query on the field, cause it to match when the condition is
*not* met. Calling this multiple times will negate the negation.

#### Returns

`this`

this

#### Defined in

[lib/search/where-field.ts:302](https://github.com/redis/redis-om-node/blob/d8438f7/lib/search/where-field.ts#L302)

## Methods

### after

▸ **after**(`value`): [`Search`](Search.md)

Add a search that matches all datetimes *after* the provided UTC datetime to the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `Date` | The datetime to compare against. |

#### Returns

[`Search`](Search.md)

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:244](https://github.com/redis/redis-om-node/blob/d8438f7/lib/search/where-field.ts#L244)

___

### before

▸ **before**(`value`): [`Search`](Search.md)

Add a search that matches all datetimes *before* the provided UTC datetime to the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `Date` | The datetime to compare against. |

#### Returns

[`Search`](Search.md)

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:237](https://github.com/redis/redis-om-node/blob/d8438f7/lib/search/where-field.ts#L237)

___

### between

▸ **between**(`lower`, `upper`): [`Search`](Search.md)

Adds an inclusive range comparison against a field to the search query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `lower` | `string` \| `number` \| `Date` | The lower bound of the range. |
| `upper` | `string` \| `number` \| `Date` | The upper bound of the range. |

#### Returns

[`Search`](Search.md)

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:179](https://github.com/redis/redis-om-node/blob/d8438f7/lib/search/where-field.ts#L179)

___

### contain

▸ **contain**(`value`): [`Search`](Search.md)

Adds a whole-string match for a value within a string array to the search query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | The string to be matched. |

#### Returns

[`Search`](Search.md)

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:186](https://github.com/redis/redis-om-node/blob/d8438f7/lib/search/where-field.ts#L186)

___

### containOneOf

▸ **containOneOf**(`...value`): [`Search`](Search.md)

Adds a whole-string match against a string array to the query. If any of the provided
strings in `value` is matched in the array, this matched.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...value` | `string`[] | An array of strings that you want to match one of. |

#### Returns

[`Search`](Search.md)

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:201](https://github.com/redis/redis-om-node/blob/d8438f7/lib/search/where-field.ts#L201)

___

### contains

▸ **contains**(`value`): [`Search`](Search.md)

Adds a whole-string match for a value within a string array to the search query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | The string to be matched. |

#### Returns

[`Search`](Search.md)

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:193](https://github.com/redis/redis-om-node/blob/d8438f7/lib/search/where-field.ts#L193)

___

### containsOneOf

▸ **containsOneOf**(`...value`): [`Search`](Search.md)

Adds a whole-string match against a string array to the query. If any of the provided
strings in `value` is matched in the array, this matched.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...value` | `string`[] | An array of strings that you want to match one of. |

#### Returns

[`Search`](Search.md)

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:209](https://github.com/redis/redis-om-node/blob/d8438f7/lib/search/where-field.ts#L209)

___

### eq

▸ **eq**(`value`): [`Search`](Search.md)

Adds an equals comparison to the query.

NOTE: this function is not available for strings where full-text
search is enabled. In that scenario, use `.match`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `boolean` \| `Date` | The value to be compared |

#### Returns

[`Search`](Search.md)

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:20](https://github.com/redis/redis-om-node/blob/d8438f7/lib/search/where-field.ts#L20)

___

### equal

▸ **equal**(`value`): [`Search`](Search.md)

Adds an equals comparison to the query.

NOTE: this function is not available for strings where full-text
search is enabled. In that scenario, use `.match`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `boolean` \| `Date` | The value to be compared |

#### Returns

[`Search`](Search.md)

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:30](https://github.com/redis/redis-om-node/blob/d8438f7/lib/search/where-field.ts#L30)

___

### equalTo

▸ **equalTo**(`value`): [`Search`](Search.md)

Adds an equals comparison to the query.

NOTE: this function is not available for strings where full-text
search is enabled. In that scenario, use `.match`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `boolean` \| `Date` | The value to be compared |

#### Returns

[`Search`](Search.md)

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:50](https://github.com/redis/redis-om-node/blob/d8438f7/lib/search/where-field.ts#L50)

___

### equals

▸ **equals**(`value`): [`Search`](Search.md)

Adds an equals comparison to the query.

NOTE: this function is not available for strings where full-text
search is enabled. In that scenario, use `.match`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `boolean` \| `Date` | The value to be compared |

#### Returns

[`Search`](Search.md)

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:40](https://github.com/redis/redis-om-node/blob/d8438f7/lib/search/where-field.ts#L40)

___

### false

▸ **false**(): [`Search`](Search.md)

Adds a boolean match with a value of `false` to the query.

#### Returns

[`Search`](Search.md)

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:115](https://github.com/redis/redis-om-node/blob/d8438f7/lib/search/where-field.ts#L115)

___

### greaterThan

▸ **greaterThan**(`value`): [`Search`](Search.md)

Adds a greater than comparison against a field to the search query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `Date` | The value to compare against. |

#### Returns

[`Search`](Search.md)

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:129](https://github.com/redis/redis-om-node/blob/d8438f7/lib/search/where-field.ts#L129)

___

### greaterThanOrEqualTo

▸ **greaterThanOrEqualTo**(`value`): [`Search`](Search.md)

Adds a greater than or equal to comparison against a field to the search query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `Date` | The value to compare against. |

#### Returns

[`Search`](Search.md)

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:143](https://github.com/redis/redis-om-node/blob/d8438f7/lib/search/where-field.ts#L143)

___

### gt

▸ **gt**(`value`): [`Search`](Search.md)

Adds a greater than comparison against a field to the search query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `Date` | The value to compare against. |

#### Returns

[`Search`](Search.md)

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:122](https://github.com/redis/redis-om-node/blob/d8438f7/lib/search/where-field.ts#L122)

___

### gte

▸ **gte**(`value`): [`Search`](Search.md)

Adds a greater than or equal to comparison against a field to the search query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `Date` | The value to compare against. |

#### Returns

[`Search`](Search.md)

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:136](https://github.com/redis/redis-om-node/blob/d8438f7/lib/search/where-field.ts#L136)

___

### inCircle

▸ **inCircle**(`circleFn`): [`Search`](Search.md)

Adds a search for points that fall within a defined circle.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `circleFn` | [`CircleFunction`](../README.md#circlefunction) | A function that returns a [Circle](Circle.md) instance defining the search area. |

#### Returns

[`Search`](Search.md)

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:216](https://github.com/redis/redis-om-node/blob/d8438f7/lib/search/where-field.ts#L216)

___

### inRadius

▸ **inRadius**(`circleFn`): [`Search`](Search.md)

Adds a search for points that fall within a defined radius.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `circleFn` | [`CircleFunction`](../README.md#circlefunction) | A function that returns a [Circle](Circle.md) instance defining the search area. |

#### Returns

[`Search`](Search.md)

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:223](https://github.com/redis/redis-om-node/blob/d8438f7/lib/search/where-field.ts#L223)

___

### lessThan

▸ **lessThan**(`value`): [`Search`](Search.md)

Adds a less than comparison against a field to the search query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `Date` | The value to compare against. |

#### Returns

[`Search`](Search.md)

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:157](https://github.com/redis/redis-om-node/blob/d8438f7/lib/search/where-field.ts#L157)

___

### lessThanOrEqualTo

▸ **lessThanOrEqualTo**(`value`): [`Search`](Search.md)

Adds a less than or equal to comparison against a field to the search query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `Date` | The value to compare against. |

#### Returns

[`Search`](Search.md)

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:171](https://github.com/redis/redis-om-node/blob/d8438f7/lib/search/where-field.ts#L171)

___

### lt

▸ **lt**(`value`): [`Search`](Search.md)

Adds a less than comparison against a field to the search query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `Date` | The value to compare against. |

#### Returns

[`Search`](Search.md)

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:150](https://github.com/redis/redis-om-node/blob/d8438f7/lib/search/where-field.ts#L150)

___

### lte

▸ **lte**(`value`): [`Search`](Search.md)

Adds a less than or equal to comparison against a field to the search query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `Date` | The value to compare against. |

#### Returns

[`Search`](Search.md)

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:164](https://github.com/redis/redis-om-node/blob/d8438f7/lib/search/where-field.ts#L164)

___

### match

▸ **match**(`value`, `options?`): [`Search`](Search.md)

Adds a full-text search comparison to the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `boolean` | The word or phrase sought. |
| `options?` | `Object` | - |
| `options.fuzzyMatching?` | `boolean` | Whether to use fuzzy matching to find the sought word or phrase. Defaults to `false`. |
| `options.levenshteinDistance?` | ``2`` \| ``1`` \| ``3`` | The levenshtein distance to use for fuzzy matching. Supported values are `1`, `2`, and `3`. Defaults to `1`. |

#### Returns

[`Search`](Search.md)

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:59](https://github.com/redis/redis-om-node/blob/d8438f7/lib/search/where-field.ts#L59)

___

### matchExact

▸ **matchExact**(`value`): [`Search`](Search.md)

Adds a full-text search comparison to the query that matches an exact word or phrase.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `boolean` | The word or phrase sought. |

#### Returns

[`Search`](Search.md)

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:75](https://github.com/redis/redis-om-node/blob/d8438f7/lib/search/where-field.ts#L75)

___

### matchExactly

▸ **matchExactly**(`value`): [`Search`](Search.md)

Adds a full-text search comparison to the query that matches an exact word or phrase.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `boolean` | The word or phrase sought. |

#### Returns

[`Search`](Search.md)

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:82](https://github.com/redis/redis-om-node/blob/d8438f7/lib/search/where-field.ts#L82)

___

### matches

▸ **matches**(`value`, `options?`): [`Search`](Search.md)

Adds a full-text search comparison to the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `boolean` | The word or phrase sought. |
| `options?` | `Object` | - |
| `options.fuzzyMatching?` | `boolean` | Whether to use fuzzy matching to find the sought word or phrase. Defaults to `false`. |
| `options.levenshteinDistance?` | ``2`` \| ``1`` \| ``3`` | The levenshtein distance to use for fuzzy matching. Supported values are `1`, `2`, and `3`. Defaults to `1`. |

#### Returns

[`Search`](Search.md)

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:68](https://github.com/redis/redis-om-node/blob/d8438f7/lib/search/where-field.ts#L68)

___

### matchesExactly

▸ **matchesExactly**(`value`): [`Search`](Search.md)

Adds a full-text search comparison to the query that matches an exact word or phrase.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `boolean` | The word or phrase sought. |

#### Returns

[`Search`](Search.md)

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:89](https://github.com/redis/redis-om-node/blob/d8438f7/lib/search/where-field.ts#L89)

___

### on

▸ **on**(`value`): [`Search`](Search.md)

Add a search for an exact UTC datetime to the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `Date` | The datetime to match. |

#### Returns

[`Search`](Search.md)

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:230](https://github.com/redis/redis-om-node/blob/d8438f7/lib/search/where-field.ts#L230)

___

### onOrAfter

▸ **onOrAfter**(`value`): [`Search`](Search.md)

Add a search that matches all datetimes *on or after* the provided UTC datetime to the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `Date` | The datetime to compare against. |

#### Returns

[`Search`](Search.md)

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:258](https://github.com/redis/redis-om-node/blob/d8438f7/lib/search/where-field.ts#L258)

___

### onOrBefore

▸ **onOrBefore**(`value`): [`Search`](Search.md)

Add a search that matches all datetimes *on or before* the provided UTC datetime to the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `Date` | The datetime to compare against. |

#### Returns

[`Search`](Search.md)

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:251](https://github.com/redis/redis-om-node/blob/d8438f7/lib/search/where-field.ts#L251)

___

### toString

▸ `Abstract` **toString**(): `string`

Converts this [Where](Where.md) into a portion of a RediSearch query.

#### Returns

`string`

#### Inherited from

[Where](Where.md).[toString](Where.md#tostring)

#### Defined in

[lib/search/where-field.ts:307](https://github.com/redis/redis-om-node/blob/d8438f7/lib/search/where-field.ts#L307)

___

### true

▸ **true**(): [`Search`](Search.md)

Adds a boolean match with a value of `true` to the query.

#### Returns

[`Search`](Search.md)

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:109](https://github.com/redis/redis-om-node/blob/d8438f7/lib/search/where-field.ts#L109)
