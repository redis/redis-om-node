[redis-om](../README.md) / Entity

# Class: Entity

An Entity is the class from which objects that Redis OM maps to are made. You need
to subclass Entity in your application:

```typescript
class Foo extends Entity {}
```

## Table of contents

### Properties

- [entityId](Entity.md#entityid)

### Accessors

- [keyName](Entity.md#keyname)

### Methods

- [toJSON](Entity.md#tojson)

## Properties

### entityId

• `Readonly` **entityId**: `string`

The generated entity ID.

#### Defined in

[lib/entity/entity.ts:33](https://github.com/redis/redis-om-node/blob/0843d26/lib/entity/entity.ts#L33)

## Accessors

### keyName

• `get` **keyName**(): `string`

#### Returns

`string`

#### Defined in

[lib/entity/entity.ts:55](https://github.com/redis/redis-om-node/blob/0843d26/lib/entity/entity.ts#L55)

## Methods

### toJSON

▸ **toJSON**(): `Record`<`string`, `any`\>

#### Returns

`Record`<`string`, `any`\>

#### Defined in

[lib/entity/entity.ts:59](https://github.com/redis/redis-om-node/blob/0843d26/lib/entity/entity.ts#L59)
