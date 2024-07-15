[redis-om](../README.md) / InvalidHashValue

# Class: InvalidHashValue

## Hierarchy

- [`InvalidValue`](InvalidValue.md)

  ↳ **`InvalidHashValue`**

## Table of contents

### Constructors

- [constructor](InvalidHashValue.md#constructor)

### Properties

- [cause](InvalidHashValue.md#cause)
- [message](InvalidHashValue.md#message)
- [name](InvalidHashValue.md#name)
- [stack](InvalidHashValue.md#stack)
- [prepareStackTrace](InvalidHashValue.md#preparestacktrace)
- [stackTraceLimit](InvalidHashValue.md#stacktracelimit)

### Accessors

- [fieldName](InvalidHashValue.md#fieldname)
- [fieldType](InvalidHashValue.md#fieldtype)
- [hashField](InvalidHashValue.md#hashfield)

### Methods

- [captureStackTrace](InvalidHashValue.md#capturestacktrace)

## Constructors

### constructor

• **new InvalidHashValue**(`field`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | [`Field`](Field.md) |

#### Overrides

[InvalidValue](InvalidValue.md).[constructor](InvalidValue.md#constructor)

#### Defined in

[lib/error/invalid-value.ts:40](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/error/invalid-value.ts#L40)

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

[lib/error/invalid-value.ts:46](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/error/invalid-value.ts#L46)

___

### fieldType

• `get` **fieldType**(): [`FieldType`](../README.md#fieldtype)

#### Returns

[`FieldType`](../README.md#fieldtype)

#### Defined in

[lib/error/invalid-value.ts:47](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/error/invalid-value.ts#L47)

___

### hashField

• `get` **hashField**(): `string`

#### Returns

`string`

#### Defined in

[lib/error/invalid-value.ts:48](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/error/invalid-value.ts#L48)

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
