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

## Accessors

### caseSensitive

• `get` **caseSensitive**(): `boolean`

The case-sensitivity of the field.

#### Returns

`boolean`

___

### hashField

• `get` **hashField**(): `string`

The field name used to store this [Field](Field.md) in a Hash.

#### Returns

`string`

___

### indexed

• `get` **indexed**(): `boolean`

Indicates the field as being indexed—and thus queryable—by RediSearch.

#### Returns

`boolean`

___

### jsonPath

• `get` **jsonPath**(): `string`

The JSONPath used to store this [Field](Field.md) in a JSON document.

#### Returns

`string`

___

### matcher

• `get` **matcher**(): ``null`` \| `string`

The phonetic matcher for the field.

#### Returns

``null`` \| `string`

___

### name

• `get` **name**(): `string`

The name of the field.

#### Returns

`string`

___

### normalized

• `get` **normalized**(): `boolean`

Inidicates that the field is normalized.

#### Returns

`boolean`

___

### separator

• `get` **separator**(): `string`

The separator for string[] fields when stored in Hashes.

#### Returns

`string`

___

### sortable

• `get` **sortable**(): `boolean`

Indicates that the field as sortable.

#### Returns

`boolean`

___

### stemming

• `get` **stemming**(): `boolean`

Indicates that the field as indexed with stemming support.

#### Returns

`boolean`

___

### type

• `get` **type**(): [`FieldType`](../README.md#fieldtype)

The [type](../README.md#fieldtype) of the field.

#### Returns

[`FieldType`](../README.md#fieldtype)

___

### weight

• `get` **weight**(): ``null`` \| `number`

The search weight of the field.

#### Returns

``null`` \| `number`
