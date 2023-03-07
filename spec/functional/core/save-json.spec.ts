import { createClient } from 'redis'

import { Entity, EntityKeyName, EntityId, RedisConnection, Repository, Schema } from '$lib/index'

import { createJsonEntitySchema } from '../helpers/data-helper'
import { fetchJsonData, keyExists, removeKeys } from '../helpers/redis-helper'

import { AN_EMPTY_ENTITY, AN_EMPTY_JSON, AN_ENTITY, A_JSON } from '../helpers/json-example-data'

describe("save JSON", () => {

  let redis: RedisConnection
  let repository: Repository
  let schema: Schema
  let entity: Entity

  beforeAll(async () => {
    redis = createClient()
    await redis.connect()

    schema = createJsonEntitySchema('save-json')
    repository = new Repository(schema, redis)
  })

  beforeEach(async () => await removeKeys(redis, 'save-json:1', 'save-json:empty'))
  afterAll(async () => {
    await removeKeys(redis, 'save-json:1', 'save-json:empty')
    await redis.quit()
  })

  describe("when saving an entity to redis", () => {
    beforeEach(async () => { entity = await repository.save(AN_ENTITY) })

    it('returns the expected entity', () => expect(entity).toEqual({
      ...AN_ENTITY,
      [EntityId]: '1',
      [EntityKeyName]: 'save-json:1'
    }))

    it('saves the expected JSON in Redis', async () => expect(fetchJsonData(redis, 'save-json:1')).resolves.toEqual(A_JSON))
  })

  describe("when saving an empty entity to redis", () => {
    beforeEach(async () => { entity = await repository.save(AN_EMPTY_ENTITY) })

    it('returns the expected entity', () => expect(entity).toEqual({
      ...AN_EMPTY_ENTITY,
      [EntityId]: 'empty',
      [EntityKeyName]: 'save-json:empty'
    }))

    it('saves an empty JSON in Redis', async () => expect(fetchJsonData(redis, 'save-json:empty')).resolves.toEqual(AN_EMPTY_JSON))
    it("stores an empty key", async () => expect(keyExists(redis, 'save-json:empty')).resolves.toBe(true))
  })
})
