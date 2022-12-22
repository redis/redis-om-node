import { createClient } from 'redis'

import { EntityId, RedisConnection, Repository, Schema } from '$lib/index'

import { createHashEntitySchema } from '../helpers/data-helper'
import { fetchHashData, keyExists, removeKeys } from '../helpers/redis-helper'

import { AN_EMPTY_ENTITY, AN_EMPTY_HASH, AN_ENTITY, A_HASH } from '../helpers/hash-example-data'

describe("save hash", () => {

  let redis: RedisConnection
  let repository: Repository
  let schema: Schema
  let entityId: string

  beforeAll(async () => {
    redis = createClient()
    await redis.connect()

    schema = createHashEntitySchema('save-hash')
    repository = new Repository(schema, redis)
  })

  beforeEach(async () => await removeKeys(redis, 'save-hash:1', 'save-hash:empty'))
  afterAll(async () => {
    await removeKeys(redis, 'save-hash:1', 'save-hash:empty')
    await redis.quit()
  })

  describe("when saving an entity to redis", () => {
    beforeEach(async () => { entityId = await repository.save(AN_ENTITY) })

    it('returns the expected entityId', () => expect(entityId).toBe(AN_ENTITY[EntityId]))
    it('saves the expected Hash in Redis', async () => expect(fetchHashData(redis, 'save-hash:1')).resolves.toEqual(A_HASH))
  })

  describe("when saving an empty entity to redis", () => {
    beforeEach(async () => { entityId = await repository.save(AN_EMPTY_ENTITY) })

    it('returns the expected entityId', () => expect(entityId).toBe(AN_EMPTY_ENTITY[EntityId]))
    it('saves an empty Hash in Redis', async () => expect(fetchHashData(redis, 'save-hash:empty')).resolves.toEqual(AN_EMPTY_HASH))

    it("stores no Hash at all", async () => expect(keyExists(redis, 'save-hash:empty')).resolves.toBe(false))
  })
})
