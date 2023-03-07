[redis-om](../README.md) / RedisOmError

# Class: RedisOmError

## Hierarchy

- `Error`

  ↳ **`RedisOmError`**

  ↳↳ [`InvalidInput`](InvalidInput.md)

  ↳↳ [`InvalidSchema`](InvalidSchema.md)

  ↳↳ [`InvalidValue`](InvalidValue.md)

  ↳↳ [`PointOutOfRange`](PointOutOfRange.md)

  ↳↳ [`SearchError`](SearchError.md)

## Table of contents

### Constructors

- [constructor](RedisOmError.md#constructor)

### Properties

- [cause](RedisOmError.md#cause)
- [message](RedisOmError.md#message)
- [name](RedisOmError.md#name)
- [stack](RedisOmError.md#stack)
- [prepareStackTrace](RedisOmError.md#preparestacktrace)
- [stackTraceLimit](RedisOmError.md#stacktracelimit)

### Methods

- [captureStackTrace](RedisOmError.md#capturestacktrace)

## Constructors

### constructor

• **new RedisOmError**(`message?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

#### Inherited from

Error.constructor

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1059

• **new RedisOmError**(`message?`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |
| `options?` | `ErrorOptions` |

#### Inherited from

Error.constructor

#### Defined in

node_modules/typescript/lib/lib.es2022.error.d.ts:30

## Properties

### cause

• `Optional` **cause**: `unknown`

#### Inherited from

Error.cause

#### Defined in

node_modules/typescript/lib/lib.es2022.error.d.ts:26

___

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1054

___

### name

• **name**: `string`

#### Inherited from

Error.name

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1053

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

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

Error.prepareStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

node_modules/@types/node/globals.d.ts:13

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

Error.captureStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:4
