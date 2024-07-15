[redis-om](../README.md) / NullJsonValue

# Class: NullJsonValue

## Hierarchy

- [`InvalidValue`](InvalidValue.md)

  ↳ **`NullJsonValue`**

## Table of contents

### Constructors

- [constructor](NullJsonValue.md#constructor)

### Properties

- [cause](NullJsonValue.md#cause)
- [message](NullJsonValue.md#message)
- [name](NullJsonValue.md#name)
- [stack](NullJsonValue.md#stack)
- [prepareStackTrace](NullJsonValue.md#preparestacktrace)
- [stackTraceLimit](NullJsonValue.md#stacktracelimit)

### Accessors

- [fieldName](NullJsonValue.md#fieldname)
- [fieldType](NullJsonValue.md#fieldtype)
- [jsonPath](NullJsonValue.md#jsonpath)

### Methods

- [captureStackTrace](NullJsonValue.md#capturestacktrace)

## Constructors

### constructor

• **new NullJsonValue**(`field`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | [`Field`](Field.md) |

#### Overrides

[InvalidValue](InvalidValue.md).[constructor](InvalidValue.md#constructor)

#### Defined in

[lib/error/invalid-value.ts:10](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/error/invalid-value.ts#L10)

## Properties

### cause

• `Optional` **cause**: `unknown`

#### Inherited from

[InvalidValue](InvalidValue.md).[cause](InvalidValue.md#cause)

#### Defined in

node_modules/typescript/lib/lib.es2022.error.d.ts:26

___

### message

• **message**: `string`

#### Inherited from

[InvalidValue](InvalidValue.md).[message](InvalidValue.md#message)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1054

___

### name

• **name**: `string`

#### Inherited from

[InvalidValue](InvalidValue.md).[name](InvalidValue.md#name)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1053

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

[InvalidValue](InvalidValue.md).[stack](InvalidValue.md#stack)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1055

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

**`See`**

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

#### Inherited from

[InvalidValue](InvalidValue.md).[prepareStackTrace](InvalidValue.md#preparestacktrace)

#### Defined in

node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

[InvalidValue](InvalidValue.md).[stackTraceLimit](InvalidValue.md#stacktracelimit)

#### Defined in

node_modules/@types/node/globals.d.ts:13

## Accessors

### fieldName

• `get` **fieldName**(): `string`

#### Returns

`string`

#### Defined in

[lib/error/invalid-value.ts:16](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/error/invalid-value.ts#L16)

___

### fieldType

• `get` **fieldType**(): [`FieldType`](../README.md#fieldtype)

#### Returns

[`FieldType`](../README.md#fieldtype)

#### Defined in

[lib/error/invalid-value.ts:17](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/error/invalid-value.ts#L17)

___

### jsonPath

• `get` **jsonPath**(): `string`

#### Returns

`string`

#### Defined in

[lib/error/invalid-value.ts:18](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/error/invalid-value.ts#L18)

## Methods

### captureStackTrace

▸ `Static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

[InvalidValue](InvalidValue.md).[captureStackTrace](InvalidValue.md#capturestacktrace)

#### Defined in

node_modules/@types/node/globals.d.ts:4
