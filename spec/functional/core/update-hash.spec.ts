import { createClient } from 'redis'

import { Entity, EntityId, EntityKeyName, RedisConnection, Repository, Schema } from '$lib/index'

import { createHashEntitySchema } from '../helpers/data-helper'
import { keyExists, removeKeys, saveHash, fetchHashData } from '../helpers/redis-helper'

import { ANOTHER_ENTITY, ANOTHER_HASH, AN_EMPTY_HASH, A_HASH } from '../helpers/hash-example-data'

describe("update hash", () => {

  let redis: RedisConnection
  let repository: Repository
  let schema: Schema
  let entity: Entity
  let returnedEntity: Entity

  beforeAll(async () => {
    redis = createClient()
    await redis.connect()

    schema = createHashEntitySchema('update-hash')
    repository = new Repository(schema, redis)
  })

  beforeEach(async () => {
    await removeKeys(redis, 'update-hash:1')
    await saveHash(redis, 'update-hash:1', A_HASH)
  })

  afterAll(async () => {
    await removeKeys(redis, 'update-hash:1')
    await redis.quit()
  })

  describe("when updating an Entity to Redis", () => {
    beforeEach(async () => {
      entity = await repository.fetch('1')
      entity.aString = ANOTHER_ENTITY.aString
      entity.anotherString = ANOTHER_ENTITY.anotherString
      entity.someText = ANOTHER_ENTITY.someText
      entity.someOtherText = ANOTHER_ENTITY.someOtherText
      entity.aNumber = ANOTHER_ENTITY.aNumber
      entity.anotherNumber = ANOTHER_ENTITY.anotherNumber
      entity.aBoolean = ANOTHER_ENTITY.aBoolean
      entity.anotherBoolean = ANOTHER_ENTITY.anotherBoolean
      entity.aPoint = ANOTHER_ENTITY.aPoint
      entity.anotherPoint = ANOTHER_ENTITY.anotherPoint
      entity.aDate = ANOTHER_ENTITY.aDate
      entity.anotherDate = ANOTHER_ENTITY.anotherDate
      entity.someStrings = ANOTHER_ENTITY.someStrings
      entity.someOtherStrings = ANOTHER_ENTITY.someOtherStrings
      returnedEntity = await repository.save(entity)
    })

    it("returns the expected entity", () => expect(returnedEntity).toEqual({
      ...ANOTHER_ENTITY,
      [EntityId]: '1',
      [EntityKeyName]: 'update-hash:1'
    }))

    it('saves the expected Hash in Redis', async () => expect(fetchHashData(redis, 'update-hash:1')).resolves.toEqual(ANOTHER_HASH))
  })

  describe("when updating an entity to be completely empty", () => {
    beforeEach(async () => {
      entity = await repository.fetch('1')
      entity.aString = null
      entity.anotherString = null
      entity.someText = null
      entity.someOtherText = null
      entity.aNumber = null
      entity.anotherNumber = undefined
      entity.aBoolean = undefined
      entity.anotherBoolean = undefined
      entity.aPoint = undefined
      entity.anotherPoint = undefined
      delete entity.aDate
      delete entity.anotherDate
      delete entity.someStrings
      delete entity.someOtherStrings
      returnedEntity = await repository.save(entity)
    })

    it("returns the expected entity", () => expect(returnedEntity).toEqual({
      aString: null,
      anotherString: null,
      someText: null,
      someOtherText: null,
      aNumber: null,
      anotherNumber: undefined,
      aBoolean: undefined,
      anotherBoolean: undefined,
      aPoint: undefined,
      anotherPoint: undefined,
      [EntityId]: '1',
      [EntityKeyName]: 'update-hash:1'
    }))

    it('saves an empty Hash in Redis', async () => expect(fetchHashData(redis, 'update-hash:1')).resolves.toEqual(AN_EMPTY_HASH))
    it("removes the Hash from Redis", async () => expect(keyExists(redis, 'update-hash:1')).resolves.toBe(false))
  })
})
