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

___

### foot

• `get` **foot**(): `this`

Sets the units to feet.

#### Returns

`this`

This instance.

___

### ft

• `get` **ft**(): `this`

Sets the units to feet.

#### Returns

`this`

This instance.

___

### kilometer

• `get` **kilometer**(): `this`

Sets the units to kilometers.

#### Returns

`this`

This instance.

___

### kilometers

• `get` **kilometers**(): `this`

Sets the units to kilometers.

#### Returns

`this`

This instance.

___

### km

• `get` **km**(): `this`

Sets the units to kilometers.

#### Returns

`this`

This instance.

___

### m

• `get` **m**(): `this`

Sets the units to meters.

#### Returns

`this`

This instance.

___

### meter

• `get` **meter**(): `this`

Sets the units to meters.

#### Returns

`this`

This instance.

___

### meters

• `get` **meters**(): `this`

Sets the units to meters.

#### Returns

`this`

This instance.

___

### mi

• `get` **mi**(): `this`

Sets the units to miles.

#### Returns

`this`

This instance.

___

### mile

• `get` **mile**(): `this`

Sets the units to miles.

#### Returns

`this`

This instance.

___

### miles

• `get` **miles**(): `this`

Sets the units to miles.

#### Returns

`this`

This instance.

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
