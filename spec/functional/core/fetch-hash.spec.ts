import { createClient } from 'redis'

import { EntityKeyName, RedisConnection, Repository, Schema } from '$lib/index'

import { createHashEntitySchema } from '../helpers/data-helper'
import { removeKeys, saveHash } from '../helpers/redis-helper'

import { ANOTHER_ENTITY, ANOTHER_HASH, AN_EMPTY_ENTITY, AN_ENTITY, A_HASH, A_THIRD_ENTITY, A_THIRD_HASH } from '../helpers/hash-example-data'

describe("fetch hash", () => {

  let redis: RedisConnection
  let repository: Repository
  let schema: Schema

  beforeAll(async () => {
    redis = createClient()
    await redis.connect()
    await removeKeys(redis, 'fetch-hash:1', 'fetch-hash:2', 'fetch-hash:3')
    await saveHash(redis, 'fetch-hash:1', A_HASH)
    await saveHash(redis, 'fetch-hash:2', ANOTHER_HASH)
    await saveHash(redis, 'fetch-hash:3', A_THIRD_HASH)

    schema = createHashEntitySchema('fetch-hash')
    repository = new Repository(schema, redis)
  })

  afterAll(async () => {
    await removeKeys(redis, 'fetch-hash:1', 'fetch-hash:2', 'fetch-hash:3')
    await redis.quit()
  })

  it("fetches a single entity from Redis", async () =>
    expect(repository.fetch('1')).resolves.toEqual({ [EntityKeyName]: 'fetch-hash:1', ...AN_ENTITY }))

  it("fetches an empty entity from Redis", async () =>
    expect(repository.fetch('empty')).resolves.toEqual({ [EntityKeyName]: 'fetch-hash:empty', ...AN_EMPTY_ENTITY }))

  it("fetches multiple entities from Redis with discrete arguments", async () => {
    let entities = await repository.fetch('1', '2', '3')
    expect(entities).toEqual(expect.arrayContaining([
      { [EntityKeyName]: 'fetch-hash:1', ...AN_ENTITY },
      { [EntityKeyName]: 'fetch-hash:2', ...ANOTHER_ENTITY },
      { [EntityKeyName]: 'fetch-hash:3', ...A_THIRD_ENTITY }
    ]))
  })

  it("fetches multiple entities from Redis with an array", async () => {
    let entities = await repository.fetch(['1', '2', '3'])
    expect(entities).toEqual(expect.arrayContaining([
      { [EntityKeyName]: 'fetch-hash:1', ...AN_ENTITY },
      { [EntityKeyName]: 'fetch-hash:2', ...ANOTHER_ENTITY },
      { [EntityKeyName]: 'fetch-hash:3', ...A_THIRD_ENTITY }
    ]))
  })
})
