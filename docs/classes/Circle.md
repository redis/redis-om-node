[redis-om](../README.md) / Circle

# Class: Circle

A builder that defines a circle.

## Table of contents

### Constructors

- [constructor](Circle.md#constructor)

### Accessors

- [feet](Circle.md#feet)
- [foot](Circle.md#foot)
- [ft](Circle.md#ft)
- [kilometer](Circle.md#kilometer)
- [kilometers](Circle.md#kilometers)
- [km](Circle.md#km)
- [m](Circle.md#m)
- [meter](Circle.md#meter)
- [meters](Circle.md#meters)
- [mi](Circle.md#mi)
- [mile](Circle.md#mile)
- [miles](Circle.md#miles)

### Methods

- [latitude](Circle.md#latitude)
- [longitude](Circle.md#longitude)
- [origin](Circle.md#origin)
- [radius](Circle.md#radius)

## Constructors

### constructor

• **new Circle**()

## Accessors

### feet

• `get` **feet**(): `this`

Sets the units to feet.

#### Returns

`this`

This instance.

#### Defined in

[lib/search/where-point.ts:149](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-point.ts#L149)

___

### foot

• `get` **foot**(): `this`

Sets the units to feet.

#### Returns

`this`

This instance.

#### Defined in

[lib/search/where-point.ts:143](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-point.ts#L143)

___

### ft

• `get` **ft**(): `this`

Sets the units to feet.

#### Returns

`this`

This instance.

#### Defined in

[lib/search/where-point.ts:137](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-point.ts#L137)

___

### kilometer

• `get` **kilometer**(): `this`

Sets the units to kilometers.

#### Returns

`this`

This instance.

#### Defined in

[lib/search/where-point.ts:122](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-point.ts#L122)

___

### kilometers

• `get` **kilometers**(): `this`

Sets the units to kilometers.

#### Returns

`this`

This instance.

#### Defined in

[lib/search/where-point.ts:128](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-point.ts#L128)

___

### km

• `get` **km**(): `this`

Sets the units to kilometers.

#### Returns

`this`

This instance.

#### Defined in

[lib/search/where-point.ts:116](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-point.ts#L116)

___

### m

• `get` **m**(): `this`

Sets the units to meters.

#### Returns

`this`

This instance.

#### Defined in

[lib/search/where-point.ts:95](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-point.ts#L95)

___

### meter

• `get` **meter**(): `this`

Sets the units to meters.

#### Returns

`this`

This instance.

#### Defined in

[lib/search/where-point.ts:101](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-point.ts#L101)

___

### meters

• `get` **meters**(): `this`

Sets the units to meters.

#### Returns

`this`

This instance.

#### Defined in

[lib/search/where-point.ts:107](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-point.ts#L107)

___

### mi

• `get` **mi**(): `this`

Sets the units to miles.

#### Returns

`this`

This instance.

#### Defined in

[lib/search/where-point.ts:158](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-point.ts#L158)

___

### mile

• `get` **mile**(): `this`

Sets the units to miles.

#### Returns

`this`

This instance.

#### Defined in

[lib/search/where-point.ts:164](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-point.ts#L164)

___

### miles

• `get` **miles**(): `this`

Sets the units to miles.

#### Returns

`this`

This instance.

#### Defined in

[lib/search/where-point.ts:170](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-point.ts#L170)

## Methods

### latitude

▸ **latitude**(`value`): [`Circle`](Circle.md)

Sets the latitude. If not set, defaults to 0.0.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `number` | The latitude. |

#### Returns

[`Circle`](Circle.md)

This instance.

#### Defined in

[lib/search/where-point.ts:42](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-point.ts#L42)

___

### longitude

▸ **longitude**(`value`): [`Circle`](Circle.md)

Sets the longitude. If not set, defaults to 0.0.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `number` | The longitude. |

#### Returns

[`Circle`](Circle.md)

This instance.

#### Defined in

[lib/search/where-point.ts:31](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-point.ts#L31)

___

### origin

▸ **origin**(`point`): [`Circle`](Circle.md)

Sets the origin of the circle using a [Point](../README.md#point). If not
set, defaults to [Null Island](https://en.wikipedia.org/wiki/Null_Island).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `point` | [`Point`](../README.md#point) | A [Point](../README.md#point) containing the longitude and latitude of the origin. |

#### Returns

[`Circle`](Circle.md)

This instance.

#### Defined in

[lib/search/where-point.ts:54](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-point.ts#L54)

▸ **origin**(`longitude`, `latitude`): [`Circle`](Circle.md)

Sets the origin of the circle. If not set, defaults to
[Null Island](https://en.wikipedia.org/wiki/Null_Island).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `longitude` | `number` | The longitude. |
| `latitude` | `number` | The latitude. |

#### Returns

[`Circle`](Circle.md)

This instance.

#### Defined in

[lib/search/where-point.ts:64](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-point.ts#L64)

___

### radius

▸ **radius**(`size`): [`Circle`](Circle.md)

Sets the radius of the [Circle](Circle.md). Defaults to 1. If units are
not specified, defaults to meters.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `size` | `number` | The radius of the circle. |

#### Returns

[`Circle`](Circle.md)

This instance.

#### Defined in

[lib/search/where-point.ts:86](https://github.com/redis/redis-om-node/blob/1acd1cf/lib/search/where-point.ts#L86)
