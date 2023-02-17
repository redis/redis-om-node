import { createClient } from 'redis'

import { Entity, EntityId, EntityKeyName, RedisConnection, Repository, Schema } from '$lib/index'

import { createJsonEntitySchema } from '../helpers/data-helper'
import { fetchJsonData, keyExists, removeKeys, saveJson } from '../helpers/redis-helper'

import { ANOTHER_ENTITY, ANOTHER_JSON, AN_EMPTY_JSON, A_JSON } from '../helpers/json-example-data'

describe("update JSON", () => {

  let redis: RedisConnection
  let repository: Repository
  let schema: Schema
  let entity: Entity
  let returnedEntity: Entity

  beforeAll(async () => {
    redis = createClient()
    await redis.connect()

    schema = createJsonEntitySchema('update-json')
    repository = new Repository(schema, redis)
  })

  beforeEach(async () => {
    await removeKeys(redis, 'update-json:1')
    await saveJson(redis, 'update-json:1', A_JSON)
  })

  afterAll(async () => {
    await removeKeys(redis, 'update-json:1')
    await redis.quit()
  })

  describe("when updating an Entity to Redis", () => {
    beforeEach(async () => {
      entity = await repository.fetch('1')
      entity.root = ANOTHER_ENTITY.root
      entity.anotherString = ANOTHER_ENTITY.anotherString
      entity.someOtherText = ANOTHER_ENTITY.someOtherText
      entity.anotherNumber = ANOTHER_ENTITY.anotherNumber
      entity.anotherBoolean = ANOTHER_ENTITY.anotherBoolean
      entity.anotherPoint = ANOTHER_ENTITY.anotherPoint
      entity.anotherDate = ANOTHER_ENTITY.anotherDate
      entity.someOtherStrings = ANOTHER_ENTITY.someOtherStrings
      returnedEntity = await repository.save(entity)
    })

    it("returns the expected entity", () => expect(returnedEntity).toEqual({
      ...ANOTHER_ENTITY,
      [EntityId]: '1',
      [EntityKeyName]: 'update-json:1'
    }))

    it('create the expected JSON in Redis', async () => expect(fetchJsonData(redis, 'update-json:1')).resolves.toEqual(ANOTHER_JSON))
  })

  describe("when updating an empty entity to Redis", () => {
    beforeEach(async () => {
      entity = await repository.fetch('1')
      entity.root = undefined
      entity.anotherString = undefined
      entity.someOtherText = undefined
      entity.anotherNumber = undefined
      delete entity.anotherBoolean
      delete entity.anotherPoint
      delete entity.anotherDate
      delete entity.someOtherStrings
      returnedEntity = await repository.save(entity)
    })

    it("returns the expected entity", () => expect(returnedEntity).toEqual({
      root: undefined,
      anotherString: undefined,
      someOtherText: undefined,
      anotherNumber: undefined,
      [EntityId]: '1',
      [EntityKeyName]: 'update-json:1'
    }))

    it("creates the expected JSON", async () => expect(fetchJsonData(redis, 'update-json:1')).resolves.toEqual(AN_EMPTY_JSON))
    it("stores an empty key", async () => expect(keyExists(redis, 'update-json:1')).resolves.toBe(true))
  })
})
