import { createClient } from 'redis'

import { RedisConnection, Repository, Schema } from '$lib/index'

import { createJsonEntitySchema } from '../helpers/data-helper'
import { keyExists, removeKeys, saveJson } from '../helpers/redis-helper'

import { ANOTHER_JSON, A_JSON, A_THIRD_JSON } from '../helpers/json-example-data'

describe("remove JSON", () => {

  let redis: RedisConnection
  let repository: Repository
  let schema: Schema

  beforeAll(async () => {
    redis = createClient()
    await redis.connect()
    schema = createJsonEntitySchema('remove-json')
    repository = new Repository(schema, redis)
  })

  beforeEach(async () => {
    await removeKeys(redis, 'remove-json:1', 'remove-json:2', 'remove-json:3')
    await saveJson(redis, 'remove-json:1', A_JSON)
    await saveJson(redis, 'remove-json:2', ANOTHER_JSON)
    await saveJson(redis, 'remove-json:3', A_THIRD_JSON)
  })

  afterAll(async () => {
    await removeKeys(redis, 'remove-json:1', 'remove-json:2', 'remove-json:3')
    await redis.quit()
  })

  it("removes a single entity", async () => {
    expect(keyExists(redis, 'remove-json:1')).resolves.toBe(true)
    await repository.remove('1')
    expect(keyExists(redis, 'remove-json:1')).resolves.toBe(false)
  })

  it("removes multiple entities with discrete arguments", async () => {
    expect(keyExists(redis, 'remove-json:1')).resolves.toBe(true)
    expect(keyExists(redis, 'remove-json:2')).resolves.toBe(true)
    expect(keyExists(redis, 'remove-json:3')).resolves.toBe(true)

    await repository.remove('1', '2', '3')

    expect(keyExists(redis, 'remove-json:1')).resolves.toBe(false)
    expect(keyExists(redis, 'remove-json:2')).resolves.toBe(false)
    expect(keyExists(redis, 'remove-json:3')).resolves.toBe(false)
  })

  it("removes multiple entities with an array", async () => {
    expect(keyExists(redis, 'remove-json:1')).resolves.toBe(true)
    expect(keyExists(redis, 'remove-json:2')).resolves.toBe(true)
    expect(keyExists(redis, 'remove-json:3')).resolves.toBe(true)

    await repository.remove([ '1', '2', '3' ])

    expect(keyExists(redis, 'remove-json:1')).resolves.toBe(false)
    expect(keyExists(redis, 'remove-json:2')).resolves.toBe(false)
    expect(keyExists(redis, 'remove-json:3')).resolves.toBe(false)
  })

  it("removes a non-existing entity", async () => {
    expect(keyExists(redis, 'remove-json:empty')).resolves.toBe(false)
    await repository.remove('empty')
    expect(keyExists(redis, 'remove-json:empty')).resolves.toBe(false)
  })
})
