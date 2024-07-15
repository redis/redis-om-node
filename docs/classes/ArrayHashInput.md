[redis-om](../README.md) / ArrayHashInput

# Class: ArrayHashInput

## Hierarchy

- [`InvalidInput`](InvalidInput.md)

  ↳ **`ArrayHashInput`**

## Table of contents

### Constructors

- [constructor](ArrayHashInput.md#constructor)

### Properties

- [cause](ArrayHashInput.md#cause)
- [message](ArrayHashInput.md#message)
- [name](ArrayHashInput.md#name)
- [stack](ArrayHashInput.md#stack)
- [prepareStackTrace](ArrayHashInput.md#preparestacktrace)
- [stackTraceLimit](ArrayHashInput.md#stacktracelimit)

### Accessors

- [field](ArrayHashInput.md#field)

### Methods

- [captureStackTrace](ArrayHashInput.md#capturestacktrace)

## Constructors

### constructor

• **new ArrayHashInput**(`property`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `property` | `string` |

#### Overrides

[InvalidInput](InvalidInput.md).[constructor](InvalidInput.md#constructor)

#### Defined in

[lib/error/invalid-input.ts:67](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/error/invalid-input.ts#L67)

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

### field

• `get` **field**(): `string`

#### Returns

`string`

#### Defined in

[lib/error/invalid-input.ts:73](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/error/invalid-input.ts#L73)

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
