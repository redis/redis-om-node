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

### Methods

- [toJSON](Entity.md#tojson)

## Properties

### entityId

• `Readonly` **entityId**: `string`

The generated entity ID.

#### Defined in

[lib/entity/entity.ts:27](https://github.com/redis/redis-om-node/blob/ee688a6/lib/entity/entity.ts#L27)

## Methods

### toJSON

▸ **toJSON**(): `Record`<`string`, `any`\>

#### Returns

`Record`<`string`, `any`\>

#### Defined in

[lib/entity/entity.ts:47](https://github.com/redis/redis-om-node/blob/ee688a6/lib/entity/entity.ts#L47)
