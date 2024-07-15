[redis-om](../README.md) / InvalidJsonValue

# Class: InvalidJsonValue

## Hierarchy

- [`InvalidValue`](InvalidValue.md)

  ↳ **`InvalidJsonValue`**

## Table of contents

### Constructors

- [constructor](InvalidJsonValue.md#constructor)

### Properties

- [cause](InvalidJsonValue.md#cause)
- [message](InvalidJsonValue.md#message)
- [name](InvalidJsonValue.md#name)
- [stack](InvalidJsonValue.md#stack)
- [prepareStackTrace](InvalidJsonValue.md#preparestacktrace)
- [stackTraceLimit](InvalidJsonValue.md#stacktracelimit)

### Accessors

- [fieldName](InvalidJsonValue.md#fieldname)
- [fieldType](InvalidJsonValue.md#fieldtype)
- [jsonPath](InvalidJsonValue.md#jsonpath)

### Methods

- [captureStackTrace](InvalidJsonValue.md#capturestacktrace)

## Constructors

### constructor

• **new InvalidJsonValue**(`field`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | [`Field`](Field.md) |

#### Overrides

[InvalidValue](InvalidValue.md).[constructor](InvalidValue.md#constructor)

#### Defined in

[lib/error/invalid-value.ts:25](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/error/invalid-value.ts#L25)

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

[lib/error/invalid-value.ts:31](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/error/invalid-value.ts#L31)

___

### fieldType

• `get` **fieldType**(): [`FieldType`](../README.md#fieldtype)

#### Returns

[`FieldType`](../README.md#fieldtype)

#### Defined in

[lib/error/invalid-value.ts:32](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/error/invalid-value.ts#L32)

___

### jsonPath

• `get` **jsonPath**(): `string`

#### Returns

`string`

#### Defined in

[lib/error/invalid-value.ts:33](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/error/invalid-value.ts#L33)

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
