import { createClient } from 'redis'

import { EntityId, EntityKeyName, RedisConnection, Repository, Schema } from '$lib/index'

import { createJsonEntitySchema } from '../helpers/data-helper'
import { removeKeys, saveJson } from '../helpers/redis-helper'

import { ANOTHER_ENTITY, ANOTHER_JSON, AN_EMPTY_ENTITY, AN_ENTITY, A_JSON, A_THIRD_ENTITY, A_THIRD_JSON } from '../helpers/json-example-data'

describe("fetch JSON", () => {

  let redis: RedisConnection
  let repository: Repository
  let schema: Schema

  beforeAll(async () => {
    redis = createClient()
    await redis.connect()
    await removeKeys(redis, 'fetch-json:1', 'fetch-json:2', 'fetch-json:3')
    await saveJson(redis, 'fetch-json:1', A_JSON)
    await saveJson(redis, 'fetch-json:2', ANOTHER_JSON)
    await saveJson(redis, 'fetch-json:3', A_THIRD_JSON)

    schema = createJsonEntitySchema('fetch-json')
    repository = new Repository(schema, redis)
  })

  afterAll(async () => {
    await removeKeys(redis, 'fetch-json:1', 'fetch-json:2', 'fetch-json:3')
    await redis.quit()
  })

  it("fetches a single entity from Redis", async () =>
    expect(repository.fetch('1')).resolves.toEqual({ [EntityKeyName]: 'fetch-json:1', ...AN_ENTITY }))

  it("fetches an empty entity from Redis", async () => {
    const entity = await repository.fetch('empty')
    expect(entity).toEqual({ [EntityKeyName]: 'fetch-json:empty', ...AN_EMPTY_ENTITY })
  })

  it("fetches a missing entity from Redis", async () => {
    const entity = await repository.fetch('missing')
    expect(entity).toEqual({ [EntityId]: 'missing', [EntityKeyName]: 'fetch-json:missing' })
  })

  it("fetches all the entities from Redis with discrete arguments", async () => {
    let entities = await repository.fetch('1', '2', '3')
    expect(entities).toEqual(expect.arrayContaining([
      { [EntityKeyName]: 'fetch-json:1', ...AN_ENTITY },
      { [EntityKeyName]: 'fetch-json:2', ...ANOTHER_ENTITY },
      { [EntityKeyName]: 'fetch-json:3', ...A_THIRD_ENTITY }
    ]))
  })
})