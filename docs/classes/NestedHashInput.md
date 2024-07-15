[redis-om](../README.md) / NestedHashInput

# Class: NestedHashInput

## Hierarchy

- [`InvalidInput`](InvalidInput.md)

  ↳ **`NestedHashInput`**

## Table of contents

### Constructors

- [constructor](NestedHashInput.md#constructor)

### Properties

- [cause](NestedHashInput.md#cause)
- [message](NestedHashInput.md#message)
- [name](NestedHashInput.md#name)
- [stack](NestedHashInput.md#stack)
- [prepareStackTrace](NestedHashInput.md#preparestacktrace)
- [stackTraceLimit](NestedHashInput.md#stacktracelimit)

### Accessors

- [field](NestedHashInput.md#field)

### Methods

- [captureStackTrace](NestedHashInput.md#capturestacktrace)

## Constructors

### constructor

• **new NestedHashInput**(`property`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `property` | `string` |

#### Overrides

[InvalidInput](InvalidInput.md).[constructor](InvalidInput.md#constructor)

#### Defined in

[lib/error/invalid-input.ts:54](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/error/invalid-input.ts#L54)

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

[lib/error/invalid-input.ts:60](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/error/invalid-input.ts#L60)

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
