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

• `Readonly` **exact**: [`WhereField`](WhereField.md)<`TEntity`\>

Makes a call to [WhereField.match](WhereField.md#match) a [WhereField.matchExact](WhereField.md#matchexact) call. Calling
this multiple times will have no effect.

**`returns`** this.

#### Defined in

[lib/search/where-field.ts:92](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/where-field.ts#L92)

___

### exactly

• `Readonly` **exactly**: [`WhereField`](WhereField.md)<`TEntity`\>

Makes a call to [WhereField.match](WhereField.md#match) a [WhereField.matchExact](WhereField.md#matchexact) call. Calling
this multiple times will have no effect.

**`returns`** this.

#### Defined in

[lib/search/where-field.ts:99](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/where-field.ts#L99)

## Accessors

### does

• `get` **does**(): `this`

Returns the current instance. Syntactic sugar to make your code more fluent.

#### Returns

`this`

this

#### Defined in

[lib/search/where-field.ts:289](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/where-field.ts#L289)

___

### is

• `get` **is**(): `this`

Returns the current instance. Syntactic sugar to make your code more fluent.

#### Returns

`this`

this

#### Defined in

[lib/search/where-field.ts:281](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/where-field.ts#L281)

___

### not

• `get` **not**(): `this`

Negates the query on the field, cause it to match when the condition is
*not* met. Calling this multiple times will negate the negation.

#### Returns

`this`

this

#### Defined in

[lib/search/where-field.ts:298](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/where-field.ts#L298)

## Methods

### after

▸ **after**(`value`): [`Search`](Search.md)<`TEntity`\>

Add a search that matches all datetimes *after* the provided UTC datetime to the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `Date` | The datetime to compare against. |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:240](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/where-field.ts#L240)

___

### before

▸ **before**(`value`): [`Search`](Search.md)<`TEntity`\>

Add a search that matches all datetimes *before* the provided UTC datetime to the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `Date` | The datetime to compare against. |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:233](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/where-field.ts#L233)

___

### between

▸ **between**(`lower`, `upper`): [`Search`](Search.md)<`TEntity`\>

Adds an inclusive range comparison against a field to the search query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `lower` | `string` \| `number` \| `Date` | The lower bound of the range. |
| `upper` | `string` \| `number` \| `Date` | The upper bound of the range. |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:175](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/where-field.ts#L175)

___

### contain

▸ **contain**(`value`): [`Search`](Search.md)<`TEntity`\>

Adds a whole-string match for a value within a string array to the search query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | The string to be matched. |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:182](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/where-field.ts#L182)

___

### containOneOf

▸ **containOneOf**(...`value`): [`Search`](Search.md)<`TEntity`\>

Adds a whole-string match against a string array to the query. If any of the provided
strings in `value` is matched in the array, this matched.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...value` | `string`[] | An array of strings that you want to match one of. |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:197](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/where-field.ts#L197)

___

### contains

▸ **contains**(`value`): [`Search`](Search.md)<`TEntity`\>

Adds a whole-string match for a value within a string array to the search query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | The string to be matched. |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:189](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/where-field.ts#L189)

___

### containsOneOf

▸ **containsOneOf**(...`value`): [`Search`](Search.md)<`TEntity`\>

Adds a whole-string match against a string array to the query. If any of the provided
strings in `value` is matched in the array, this matched.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...value` | `string`[] | An array of strings that you want to match one of. |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:205](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/where-field.ts#L205)

___

### eq

▸ **eq**(`value`): [`Search`](Search.md)<`TEntity`\>

Adds an equals comparison to the query.

NOTE: this function is not available for strings where full-text
search is enabled. In that scenario, use `.match`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `boolean` \| `Date` | The value to be compared |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:20](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/where-field.ts#L20)

___

### equal

▸ **equal**(`value`): [`Search`](Search.md)<`TEntity`\>

Adds an equals comparison to the query.

NOTE: this function is not available for strings where full-text
search is enabled. In that scenario, use `.match`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `boolean` \| `Date` | The value to be compared |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:30](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/where-field.ts#L30)

___

### equalTo

▸ **equalTo**(`value`): [`Search`](Search.md)<`TEntity`\>

Adds an equals comparison to the query.

NOTE: this function is not available for strings where full-text
search is enabled. In that scenario, use `.match`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `boolean` \| `Date` | The value to be compared |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:50](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/where-field.ts#L50)

___

### equals

▸ **equals**(`value`): [`Search`](Search.md)<`TEntity`\>

Adds an equals comparison to the query.

NOTE: this function is not available for strings where full-text
search is enabled. In that scenario, use `.match`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `boolean` \| `Date` | The value to be compared |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:40](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/where-field.ts#L40)

___

### false

▸ **false**(): [`Search`](Search.md)<`TEntity`\>

Adds a boolean match with a value of `false` to the query.

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:111](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/where-field.ts#L111)

___

### greaterThan

▸ **greaterThan**(`value`): [`Search`](Search.md)<`TEntity`\>

Adds a greater than comparison against a field to the search query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `Date` | The value to compare against. |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:125](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/where-field.ts#L125)

___

### greaterThanOrEqualTo

▸ **greaterThanOrEqualTo**(`value`): [`Search`](Search.md)<`TEntity`\>

Adds a greater than or equal to comparison against a field to the search query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `Date` | The value to compare against. |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:139](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/where-field.ts#L139)

___

### gt

▸ **gt**(`value`): [`Search`](Search.md)<`TEntity`\>

Adds a greater than comparison against a field to the search query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `Date` | The value to compare against. |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:118](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/where-field.ts#L118)

___

### gte

▸ **gte**(`value`): [`Search`](Search.md)<`TEntity`\>

Adds a greater than or equal to comparison against a field to the search query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `Date` | The value to compare against. |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:132](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/where-field.ts#L132)

___

### inCircle

▸ **inCircle**(`circleFn`): [`Search`](Search.md)<`TEntity`\>

Adds a search for points that fall within a defined circle.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `circleFn` | [`CircleFunction`](../README.md#circlefunction) | A function that returns a [Circle](Circle.md) instance defining the search area. |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:212](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/where-field.ts#L212)

___

### inRadius

▸ **inRadius**(`circleFn`): [`Search`](Search.md)<`TEntity`\>

Adds a search for points that fall within a defined radius.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `circleFn` | [`CircleFunction`](../README.md#circlefunction) | A function that returns a [Circle](Circle.md) instance defining the search area. |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:219](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/where-field.ts#L219)

___

### lessThan

▸ **lessThan**(`value`): [`Search`](Search.md)<`TEntity`\>

Adds a less than comparison against a field to the search query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `Date` | The value to compare against. |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:153](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/where-field.ts#L153)

___

### lessThanOrEqualTo

▸ **lessThanOrEqualTo**(`value`): [`Search`](Search.md)<`TEntity`\>

Adds a less than or equal to comparison against a field to the search query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `Date` | The value to compare against. |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:167](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/where-field.ts#L167)

___

### lt

▸ **lt**(`value`): [`Search`](Search.md)<`TEntity`\>

Adds a less than comparison against a field to the search query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `Date` | The value to compare against. |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:146](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/where-field.ts#L146)

___

### lte

▸ **lte**(`value`): [`Search`](Search.md)<`TEntity`\>

Adds a less than or equal to comparison against a field to the search query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `Date` | The value to compare against. |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:160](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/where-field.ts#L160)

___

### match

▸ **match**(`value`): [`Search`](Search.md)<`TEntity`\>

Adds a full-text search comparison to the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `boolean` | The word or phrase sought. |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:57](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/where-field.ts#L57)

___

### matchExact

▸ **matchExact**(`value`): [`Search`](Search.md)<`TEntity`\>

Adds a full-text search comparison to the query that matches an exact word or phrase.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `boolean` | The word or phrase sought. |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:71](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/where-field.ts#L71)

___

### matchExactly

▸ **matchExactly**(`value`): [`Search`](Search.md)<`TEntity`\>

Adds a full-text search comparison to the query that matches an exact word or phrase.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `boolean` | The word or phrase sought. |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:78](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/where-field.ts#L78)

___

### matches

▸ **matches**(`value`): [`Search`](Search.md)<`TEntity`\>

Adds a full-text search comparison to the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `boolean` | The word or phrase sought. |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:64](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/where-field.ts#L64)

___

### matchesExactly

▸ **matchesExactly**(`value`): [`Search`](Search.md)<`TEntity`\>

Adds a full-text search comparison to the query that matches an exact word or phrase.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `boolean` | The word or phrase sought. |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:85](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/where-field.ts#L85)

___

### on

▸ **on**(`value`): [`Search`](Search.md)<`TEntity`\>

Add a search for an exact UTC datetime to the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `Date` | The datetime to match. |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:226](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/where-field.ts#L226)

___

### onOrAfter

▸ **onOrAfter**(`value`): [`Search`](Search.md)<`TEntity`\>

Add a search that matches all datetimes *on or after* the provided UTC datetime to the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `Date` | The datetime to compare against. |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:254](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/where-field.ts#L254)

___

### onOrBefore

▸ **onOrBefore**(`value`): [`Search`](Search.md)<`TEntity`\>

Add a search that matches all datetimes *on or before* the provided UTC datetime to the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `Date` | The datetime to compare against. |

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:247](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/where-field.ts#L247)

___

### toString

▸ `Abstract` **toString**(): `string`

Converts this [Where](Where.md) into a portion of a RediSearch query.

#### Returns

`string`

#### Inherited from

[Where](Where.md).[toString](Where.md#tostring)

#### Defined in

[lib/search/where-field.ts:303](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/where-field.ts#L303)

___

### true

▸ **true**(): [`Search`](Search.md)<`TEntity`\>

Adds a boolean match with a value of `true` to the query.

#### Returns

[`Search`](Search.md)<`TEntity`\>

The [Search](Search.md) that was called to create this [WhereField](WhereField.md).

#### Defined in

[lib/search/where-field.ts:105](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/search/where-field.ts#L105)
