[redis-om](../README.md) / PointOutOfRange

# Class: PointOutOfRange

## Hierarchy

- [`RedisOmError`](RedisOmError.md)

  ↳ **`PointOutOfRange`**

## Table of contents

### Constructors

- [constructor](PointOutOfRange.md#constructor)

### Properties

- [cause](PointOutOfRange.md#cause)
- [message](PointOutOfRange.md#message)
- [name](PointOutOfRange.md#name)
- [stack](PointOutOfRange.md#stack)
- [prepareStackTrace](PointOutOfRange.md#preparestacktrace)
- [stackTraceLimit](PointOutOfRange.md#stacktracelimit)

### Accessors

- [point](PointOutOfRange.md#point)

### Methods

- [captureStackTrace](PointOutOfRange.md#capturestacktrace)

## Constructors

### constructor

• **new PointOutOfRange**(`point`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `point` | [`Point`](../README.md#point) |

#### Overrides

[RedisOmError](RedisOmError.md).[constructor](RedisOmError.md#constructor)

#### Defined in

[lib/error/point-out-of-range.ts:9](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/error/point-out-of-range.ts#L9)

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

## Accessors

### point

• `get` **point**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `latitude` | `number` |
| `longitude` | `number` |

#### Defined in

[lib/error/point-out-of-range.ts:15](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/error/point-out-of-range.ts#L15)

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
