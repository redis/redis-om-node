[redis-om](../README.md) / Field

# Class: Field

Describes a field in a [Schema](Schema.md).

## Table of contents

### Constructors

- [constructor](Field.md#constructor)

### Accessors

- [caseSensitive](Field.md#casesensitive)
- [hashField](Field.md#hashfield)
- [indexed](Field.md#indexed)
- [isArray](Field.md#isarray)
- [jsonPath](Field.md#jsonpath)
- [matcher](Field.md#matcher)
- [name](Field.md#name)
- [normalized](Field.md#normalized)
- [separator](Field.md#separator)
- [sortable](Field.md#sortable)
- [stemming](Field.md#stemming)
- [type](Field.md#type)
- [weight](Field.md#weight)

## Constructors

### constructor

• **new Field**(`name`, `definition`)

Creates a Field.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The name of the Field. |
| `definition` | [`FieldDefinition`](../README.md#fielddefinition) | The underlying [FieldDefinition](../README.md#fielddefinition). |

#### Defined in

[lib/schema/field.ts:17](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/schema/field.ts#L17)

## Accessors

### caseSensitive

• `get` **caseSensitive**(): `boolean`

The case-sensitivity of the field.

#### Returns

`boolean`

#### Defined in

[lib/schema/field.ts:55](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/schema/field.ts#L55)

___

### hashField

• `get` **hashField**(): `string`

The field name used to store this [Field](Field.md) in a Hash.

#### Returns

`string`

#### Defined in

[lib/schema/field.ts:33](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/schema/field.ts#L33)

___

### indexed

• `get` **indexed**(): `boolean`

Indicates the field as being indexed—and thus queryable—by RediSearch.

#### Returns

`boolean`

#### Defined in

[lib/schema/field.ts:60](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/schema/field.ts#L60)

___

### isArray

• `get` **isArray**(): `boolean`

Is this type an array or not.

#### Returns

`boolean`

#### Defined in

[lib/schema/field.ts:85](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/schema/field.ts#L85)

___

### jsonPath

• `get` **jsonPath**(): `string`

The JSONPath used to store this [Field](Field.md) in a JSON document.

#### Returns

`string`

#### Defined in

[lib/schema/field.ts:38](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/schema/field.ts#L38)

___

### matcher

• `get` **matcher**(): ``null`` \| `string`

The phonetic matcher for the field.

#### Returns

``null`` \| `string`

#### Defined in

[lib/schema/field.ts:80](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/schema/field.ts#L80)

___

### name

• `get` **name**(): `string`

The name of the field.

#### Returns

`string`

#### Defined in

[lib/schema/field.ts:23](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/schema/field.ts#L23)

___

### normalized

• `get` **normalized**(): `boolean`

Indicates that the field is normalized. Ignored if sortable is false.

#### Returns

`boolean`

#### Defined in

[lib/schema/field.ts:70](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/schema/field.ts#L70)

___

### separator

• `get` **separator**(): `string`

The separator for string[] fields when stored in Hashes.

#### Returns

`string`

#### Defined in

[lib/schema/field.ts:45](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/schema/field.ts#L45)

___

### sortable

• `get` **sortable**(): `boolean`

Indicates that the field as sortable.

#### Returns

`boolean`

#### Defined in

[lib/schema/field.ts:50](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/schema/field.ts#L50)

___

### stemming

• `get` **stemming**(): `boolean`

Indicates that the field as indexed with stemming support.

#### Returns

`boolean`

#### Defined in

[lib/schema/field.ts:65](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/schema/field.ts#L65)

___

### type

• `get` **type**(): [`FieldType`](../README.md#fieldtype)

The [type](../README.md#fieldtype) of the field.

#### Returns

[`FieldType`](../README.md#fieldtype)

#### Defined in

[lib/schema/field.ts:28](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/schema/field.ts#L28)

___

### weight

• `get` **weight**(): ``null`` \| `number`

The search weight of the field.

#### Returns

``null`` \| `number`

#### Defined in

[lib/schema/field.ts:75](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/schema/field.ts#L75)
