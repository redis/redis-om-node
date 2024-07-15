[redis-om](../README.md) / InvalidHashInput

# Class: InvalidHashInput

## Hierarchy

- [`InvalidInput`](InvalidInput.md)

  ↳ **`InvalidHashInput`**

## Table of contents

### Constructors

- [constructor](InvalidHashInput.md#constructor)

### Properties

- [cause](InvalidHashInput.md#cause)
- [message](InvalidHashInput.md#message)
- [name](InvalidHashInput.md#name)
- [stack](InvalidHashInput.md#stack)
- [prepareStackTrace](InvalidHashInput.md#preparestacktrace)
- [stackTraceLimit](InvalidHashInput.md#stacktracelimit)

### Accessors

- [fieldName](InvalidHashInput.md#fieldname)
- [fieldType](InvalidHashInput.md#fieldtype)

### Methods

- [captureStackTrace](InvalidHashInput.md#capturestacktrace)

## Constructors

### constructor

• **new InvalidHashInput**(`field`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | [`Field`](Field.md) |

#### Overrides

[InvalidInput](InvalidInput.md).[constructor](InvalidInput.md#constructor)

#### Defined in

[lib/error/invalid-input.ts:40](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/error/invalid-input.ts#L40)

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

[lib/error/invalid-input.ts:46](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/error/invalid-input.ts#L46)

___

### fieldType

• `get` **fieldType**(): [`FieldType`](../README.md#fieldtype)

#### Returns

[`FieldType`](../README.md#fieldtype)

#### Defined in

[lib/error/invalid-input.ts:47](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/error/invalid-input.ts#L47)

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
