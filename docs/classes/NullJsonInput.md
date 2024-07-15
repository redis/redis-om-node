[redis-om](../README.md) / NullJsonInput

# Class: NullJsonInput

## Hierarchy

- [`InvalidInput`](InvalidInput.md)

  ↳ **`NullJsonInput`**

## Table of contents

### Constructors

- [constructor](NullJsonInput.md#constructor)

### Properties

- [cause](NullJsonInput.md#cause)
- [message](NullJsonInput.md#message)
- [name](NullJsonInput.md#name)
- [stack](NullJsonInput.md#stack)
- [prepareStackTrace](NullJsonInput.md#preparestacktrace)
- [stackTraceLimit](NullJsonInput.md#stacktracelimit)

### Accessors

- [fieldName](NullJsonInput.md#fieldname)
- [fieldType](NullJsonInput.md#fieldtype)
- [jsonPath](NullJsonInput.md#jsonpath)

### Methods

- [captureStackTrace](NullJsonInput.md#capturestacktrace)

## Constructors

### constructor

• **new NullJsonInput**(`field`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | [`Field`](Field.md) |

#### Overrides

[InvalidInput](InvalidInput.md).[constructor](InvalidInput.md#constructor)

#### Defined in

[lib/error/invalid-input.ts:10](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/error/invalid-input.ts#L10)

## Properties

### cause

• `Optional` **cause**: `unknown`

#### Inherited from

[InvalidInput](InvalidInput.md).[cause](InvalidInput.md#cause)

#### Defined in

node_modules/typescript/lib/lib.es2022.error.d.ts:26

___

### message

• **message**: `string`

#### Inherited from

[InvalidInput](InvalidInput.md).[message](InvalidInput.md#message)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1054

___

### name

• **name**: `string`

#### Inherited from

[InvalidInput](InvalidInput.md).[name](InvalidInput.md#name)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1053

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

[InvalidInput](InvalidInput.md).[stack](InvalidInput.md#stack)

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

[InvalidInput](InvalidInput.md).[prepareStackTrace](InvalidInput.md#preparestacktrace)

#### Defined in

node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

[InvalidInput](InvalidInput.md).[stackTraceLimit](InvalidInput.md#stacktracelimit)

#### Defined in

node_modules/@types/node/globals.d.ts:13

## Accessors

### fieldName

• `get` **fieldName**(): `string`

#### Returns

`string`

#### Defined in

[lib/error/invalid-input.ts:16](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/error/invalid-input.ts#L16)

___

### fieldType

• `get` **fieldType**(): [`FieldType`](../README.md#fieldtype)

#### Returns

[`FieldType`](../README.md#fieldtype)

#### Defined in

[lib/error/invalid-input.ts:17](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/error/invalid-input.ts#L17)

___

### jsonPath

• `get` **jsonPath**(): `string`

#### Returns

`string`

#### Defined in

[lib/error/invalid-input.ts:18](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/error/invalid-input.ts#L18)

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

[InvalidInput](InvalidInput.md).[captureStackTrace](InvalidInput.md#capturestacktrace)

#### Defined in

node_modules/@types/node/globals.d.ts:4
