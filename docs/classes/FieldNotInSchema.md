[redis-om](../README.md) / FieldNotInSchema

# Class: FieldNotInSchema

## Hierarchy

- [`SearchError`](SearchError.md)

  ↳ **`FieldNotInSchema`**

## Table of contents

### Constructors

- [constructor](FieldNotInSchema.md#constructor)

### Properties

- [cause](FieldNotInSchema.md#cause)
- [message](FieldNotInSchema.md#message)
- [name](FieldNotInSchema.md#name)
- [stack](FieldNotInSchema.md#stack)
- [prepareStackTrace](FieldNotInSchema.md#preparestacktrace)
- [stackTraceLimit](FieldNotInSchema.md#stacktracelimit)

### Accessors

- [field](FieldNotInSchema.md#field)

### Methods

- [captureStackTrace](FieldNotInSchema.md#capturestacktrace)

## Constructors

### constructor

• **new FieldNotInSchema**(`fieldName`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `fieldName` | `string` |

#### Overrides

[SearchError](SearchError.md).[constructor](SearchError.md#constructor)

#### Defined in

[lib/error/search-error.ts:11](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/error/search-error.ts#L11)

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

## Accessors

### field

• `get` **field**(): `string`

#### Returns

`string`

#### Defined in

[lib/error/search-error.ts:16](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/error/search-error.ts#L16)

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
