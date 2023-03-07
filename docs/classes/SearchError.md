[redis-om](../README.md) / SearchError

# Class: SearchError

## Hierarchy

- [`RedisOmError`](RedisOmError.md)

  ↳ **`SearchError`**

  ↳↳ [`SemanticSearchError`](SemanticSearchError.md)

  ↳↳ [`FieldNotInSchema`](FieldNotInSchema.md)

## Table of contents

### Constructors

- [constructor](SearchError.md#constructor)

### Properties

- [cause](SearchError.md#cause)
- [message](SearchError.md#message)
- [name](SearchError.md#name)
- [stack](SearchError.md#stack)
- [prepareStackTrace](SearchError.md#preparestacktrace)
- [stackTraceLimit](SearchError.md#stacktracelimit)

### Methods

- [captureStackTrace](SearchError.md#capturestacktrace)

## Constructors

### constructor

• **new SearchError**(`message?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

#### Inherited from

[RedisOmError](RedisOmError.md).[constructor](RedisOmError.md#constructor)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1059

• **new SearchError**(`message?`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |
| `options?` | `ErrorOptions` |

#### Inherited from

[RedisOmError](RedisOmError.md).[constructor](RedisOmError.md#constructor)

#### Defined in

node_modules/typescript/lib/lib.es2022.error.d.ts:30

## Properties

### cause

• `Optional` **cause**: `unknown`

#### Inherited from

[RedisOmError](RedisOmError.md).[cause](RedisOmError.md#cause)

#### Defined in

node_modules/typescript/lib/lib.es2022.error.d.ts:26

___

### message

• **message**: `string`

#### Inherited from

[RedisOmError](RedisOmError.md).[message](RedisOmError.md#message)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1054

___

### name

• **name**: `string`

#### Inherited from

[RedisOmError](RedisOmError.md).[name](RedisOmError.md#name)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1053

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

[RedisOmError](RedisOmError.md).[stack](RedisOmError.md#stack)

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

[RedisOmError](RedisOmError.md).[prepareStackTrace](RedisOmError.md#preparestacktrace)

#### Defined in

node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

[RedisOmError](RedisOmError.md).[stackTraceLimit](RedisOmError.md#stacktracelimit)

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

[RedisOmError](RedisOmError.md).[captureStackTrace](RedisOmError.md#capturestacktrace)

#### Defined in

node_modules/@types/node/globals.d.ts:4
