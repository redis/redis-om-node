import { createClient } from 'redis'

import { RedisConnection, Repository, Schema } from '$lib/index'

import { createHashEntitySchema } from '../helpers/data-helper'
import { keyExists, removeKeys, saveHash } from '../helpers/redis-helper'

import { ANOTHER_HASH, A_HASH, A_THIRD_HASH } from '../helpers/hash-example-data'


describe("remove hash", () => {

  let redis: RedisConnection
  let repository: Repository
  let schema: Schema

  beforeAll(async () => {
    redis = createClient()
    await redis.connect()
    schema = createHashEntitySchema('remove-hash')
    repository = new Repository(schema, redis)
  })

  beforeEach(async () => {
    await removeKeys(redis, 'remove-hash:1', 'remove-hash:2', 'remove-hash:3')
    await saveHash(redis, 'remove-hash:1', A_HASH)
    await saveHash(redis, 'remove-hash:2', ANOTHER_HASH)
    await saveHash(redis, 'remove-hash:3', A_THIRD_HASH)
  })

  afterAll(async () => {
    await removeKeys(redis, 'remove-hash:1', 'remove-hash:2', 'remove-hash:3')
    await redis.quit()
  })

  it("removes a single entity", async () => {
    expect(keyExists(redis, 'remove-hash:1')).resolves.toBe(true)
    await repository.remove('1')
    expect(keyExists(redis, 'remove-hash:1')).resolves.toBe(false)
  })

  it("removes multiple entities with discrete arguments", async () => {
    expect(keyExists(redis, 'remove-hash:1')).resolves.toBe(true)
    expect(keyExists(redis, 'remove-hash:2')).resolves.toBe(true)
    expect(keyExists(redis, 'remove-hash:3')).resolves.toBe(true)

    await repository.remove('1', '2', '3')

    expect(keyExists(redis, 'remove-hash:1')).resolves.toBe(false)
    expect(keyExists(redis, 'remove-hash:2')).resolves.toBe(false)
    expect(keyExists(redis, 'remove-hash:full')).resolves.toBe(false)
  })

  it("removes multiple entities with an array", async () => {
    expect(keyExists(redis, 'remove-hash:1')).resolves.toBe(true)
    expect(keyExists(redis, 'remove-hash:2')).resolves.toBe(true)
    expect(keyExists(redis, 'remove-hash:3')).resolves.toBe(true)
    await repository.remove([ '1', '2', '3' ])

    expect(keyExists(redis, 'remove-hash:1')).resolves.toBe(false)
    expect(keyExists(redis, 'remove-hash:2')).resolves.toBe(false)
    expect(keyExists(redis, 'remove-hash:3')).resolves.toBe(false)
  })

  it("removes a non-existing entity", async () => {
    expect(keyExists(redis, 'remove-hash:empty')).resolves.toBe(false)
    await repository.remove('empty')
    expect(keyExists(redis, 'remove-hash:empty')).resolves.toBe(false)
  })
})
