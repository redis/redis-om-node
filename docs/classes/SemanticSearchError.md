[redis-om](../README.md) / SemanticSearchError

# Class: SemanticSearchError

## Hierarchy

- [`SearchError`](SearchError.md)

  ↳ **`SemanticSearchError`**

## Table of contents

### Constructors

- [constructor](SemanticSearchError.md#constructor)

### Properties

- [cause](SemanticSearchError.md#cause)
- [message](SemanticSearchError.md#message)
- [name](SemanticSearchError.md#name)
- [stack](SemanticSearchError.md#stack)
- [prepareStackTrace](SemanticSearchError.md#preparestacktrace)
- [stackTraceLimit](SemanticSearchError.md#stacktracelimit)

### Methods

- [captureStackTrace](SemanticSearchError.md#capturestacktrace)

## Constructors

### constructor

• **new SemanticSearchError**(`message?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

#### Inherited from

[SearchError](SearchError.md).[constructor](SearchError.md#constructor)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1059

• **new SemanticSearchError**(`message?`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |
| `options?` | `ErrorOptions` |

#### Inherited from

[SearchError](SearchError.md).[constructor](SearchError.md#constructor)

#### Defined in

node_modules/typescript/lib/lib.es2022.error.d.ts:30

## Properties

### cause

• `Optional` **cause**: `unknown`

#### Inherited from

[SearchError](SearchError.md).[cause](SearchError.md#cause)

#### Defined in

node_modules/typescript/lib/lib.es2022.error.d.ts:26

___

### message

• **message**: `string`

#### Inherited from

[SearchError](SearchError.md).[message](SearchError.md#message)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1054

___

### name

• **name**: `string`

#### Inherited from

[SearchError](SearchError.md).[name](SearchError.md#name)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1053

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

[SearchError](SearchError.md).[stack](SearchError.md#stack)

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

[SearchError](SearchError.md).[prepareStackTrace](SearchError.md#preparestacktrace)

#### Defined in

node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

[SearchError](SearchError.md).[stackTraceLimit](SearchError.md#stacktracelimit)

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

[SearchError](SearchError.md).[captureStackTrace](SearchError.md#capturestacktrace)

#### Defined in

node_modules/@types/node/globals.d.ts:4
